import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { checkHasPass } from '@/lib/contracts';

// GET /api/check-pass?buyer=0x...&itemId=N&chainItemId=N
// Returns { hasPass: bool, pass: Pass|null } — called client-side before Particle tx
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { buyer, itemId, chainItemId } = req.query;

  if (!buyer || !itemId) {
    return res.status(400).json({ error: 'Missing buyer or itemId' });
  }

  try {
    // 1. Quick DB check (fast, no RPC needed)
    const dbPass = await db.pass.findFirst({
      where: { buyerAddress: buyer as string, itemId: itemId as string, status: 'issued' },
    });

    if (dbPass) {
      return res.status(200).json({ hasPass: true, pass: dbPass });
    }

    // 2. On-chain check (authoritative, catches cases where DB is stale)
    if (chainItemId) {
      const onChain = await checkHasPass(buyer as string, Number(chainItemId));
      if (onChain) {
        return res.status(200).json({ hasPass: true, pass: null });
      }
    }

    return res.status(200).json({ hasPass: false, pass: null });
  } catch (err: any) {
    console.error('[check-pass] error:', err.message);
    // Fail open — don't block the purchase if check itself fails
    return res.status(200).json({ hasPass: false, pass: null });
  }
}
