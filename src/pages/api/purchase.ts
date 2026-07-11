import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { issuePassOnChain } from '@/lib/contracts';

// ─────────────────────────────────────────────────────────
// POST /api/purchase
// Body: { particleTxId, buyerAddress, itemId, itemSlug, priceUSDC, chainItemId, sessionId? }
//
// Called after client-side tx confirmation (universalAccount.getTransaction).
// Issues the on-chain pass, then optionally updates the CheckoutSession + fires webhook.
// ─────────────────────────────────────────────────────────

interface PurchaseBody {
  particleTxId: string;
  buyerAddress: string;
  itemId: string;
  itemSlug: string;
  priceUSDC: number;
  chainItemId?: number | null;
  sessionId?: string | null;    // optional — present when initiated via /checkout/[sessionId]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    particleTxId,
    buyerAddress,
    itemId,
    itemSlug,
    priceUSDC,
    chainItemId,
    sessionId,
  } = req.body as PurchaseBody;

  // ── Validate ──
  if (!particleTxId || !buyerAddress || !itemId) {
    return res.status(400).json({ error: 'Missing required fields: particleTxId, buyerAddress, itemId' });
  }

  console.log(`[purchase] Starting purchase: item=${itemId} buyer=${buyerAddress} txId=${particleTxId}`);

  try {
    // ── 1. Check for existing pass (idempotency) ──
    const existingPass = await db.pass.findFirst({
      where: { particleTxId },
    });

    if (existingPass?.status === 'issued') {
      console.log('[purchase] Already issued:', existingPass.id);
      return res.status(200).json({
        passId: existingPass.chainPassId ?? 0,
        arbTxHash: existingPass.arbitrumTxHash ?? '',
        particleTxId,
        alreadyIssued: true,
      });
    }

    // ── 2. Create pending DB record (or reuse existing) ──
    const pendingPass = existingPass ?? await db.pass.create({
      data: {
        buyerAddress,
        particleTxId,
        status: 'pending',
        itemId,
      },
    });

    console.log('[purchase] Pending DB record:', pendingPass.id);

    // ── 3. Issue pass on Arbitrum ──
    // The client confirms the Particle tx via universalAccount.getTransaction()
    // before calling this endpoint, so we trust the tx is confirmed and go straight
    // to issuing the on-chain pass.
    console.log('[purchase] Issuing pass on Arbitrum…');

    // ── 4. Issue pass on Arbitrum ──
    // chainItemId is our on-chain item ID (from seed)
    if (chainItemId == null) {
      return res.status(400).json({ error: 'chainItemId not set for this item — cannot issue on-chain' });
    }

    const { txHash: arbTxHash, passId } = await issuePassOnChain(
      chainItemId,
      buyerAddress,
      particleTxId,
    );

    console.log(`[purchase] ✅ Pass #${passId} issued! Arbitrum tx: ${arbTxHash}`);

    // ── 5. Update DB pass record ──
    await db.pass.update({
      where: { id: pendingPass.id },
      data: { status: 'issued', chainPassId: passId, arbitrumTxHash: arbTxHash },
    });

    // ── 6. Update CheckoutSession + fire webhook (if session-initiated) ──
    if (sessionId) {
      const session = await db.checkoutSession.update({
        where: { id: sessionId },
        data: { status: 'complete', passId: String(passId), buyerAddress, particleTxId },
      }).catch(() => null);

      if (session?.webhookUrl) {
        // Fire-and-forget — don't block the response
        const webhookPayload = {
          event: 'checkout.session.completed',
          sessionId,
          status: 'complete',
          passId,
          particleTxId,
          arbTxHash,
          buyerAddress,
          metadata: session.metadata ? JSON.parse(session.metadata) : {},
        };
        fetch(session.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        }).catch(e => console.error('[purchase] Webhook delivery failed:', e.message));
        console.log('[purchase] Webhook fired to:', session.webhookUrl);
      }
    }

    return res.status(200).json({ passId, arbTxHash, particleTxId });
  } catch (err: any) {
    console.error('[purchase] ❌ Error:', err);
    if (err?.message?.includes('0xca3d7328') || err?.data === '0xca3d7328') {
      return res.status(400).json({
        error: 'You already hold a pass for this event. 1 pass per wallet enforced on-chain.',
      });
    }
    return res.status(500).json({
      error: err?.message ?? 'Internal server error during purchase',
    });
  }
}
