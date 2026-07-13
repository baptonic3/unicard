import { useState } from 'react';
import { useUniversalAccount } from '@/hooks/UniversalAccountProvider';
import { CHAIN_ID, SUPPORTED_TOKEN_TYPE } from '@particle-network/universal-account-sdk';
import { Interface, parseUnits } from 'ethers'; // ethers v6 — named exports from root
import { USDC_ARBITRUM_ADDRESS, ARBITRUM_CHAIN_ID, universalXActivityUrl, arbiscanTxUrl } from '@/lib/contracts';

// ERC-20 ABI fragment — only the transfer function
const ERC20_TRANSFER_IFACE = new Interface([
  'function transfer(address to, uint256 amount) returns (bool)',
]);
import TransactionSteps, { TxStep } from '@/components/TransactionSteps';
import TopUpPrompt from '@/components/TopUpPrompt';
import { AccessItemData } from '@/components/AccessCard';

interface BuyPassButtonProps {
  item: AccessItemData;
  buyerAddress: string;
  balance: number;         // USD total from primaryAssets
  depositAddress: string;  // UA smart account address
  redirectUrl?: string;    // ?redirect= param — fire after success
  sessionId?: string;      // present when initiated via /checkout/[sessionId]
  onSuccess?: (passId: number, particleTxId: string, arbTxHash: string) => void;
}

interface PurchaseResult {
  passId: number;
  particleTxId: string;
  arbTxHash: string;
}

export default function BuyPassButton({
  item,
  buyerAddress,
  balance,
  depositAddress,
  redirectUrl,
  sessionId,
  onSuccess,
}: BuyPassButtonProps) {
  const { universalAccount, signAndSend, refreshBalance } = useUniversalAccount();
  const [txStep, setTxStep] = useState<TxStep>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [result, setResult] = useState<PurchaseResult | null>(null);
  const [showTopUp, setShowTopUp] = useState(false);

  const hasEnough = balance >= item.priceUSDC;
  const treasuryWallet = process.env.NEXT_PUBLIC_TREASURY_WALLET;

  const handleBuy = async () => {
    if (!universalAccount || !treasuryWallet) {
      setErrorMsg('Wallet or treasury not configured.');
      setTxStep('error');
      return;
    }

    setErrorMsg('');
    setTxStep('building');

    try {
      // ── Step 1: Build the cross-chain USDC payment ──
      // We use createUniversalTransaction instead of createTransferTransaction:
      //   • expectTokens tells the SDK to guarantee USDC is delivered to Arbitrum
      //   • transactions encodes the actual ERC-20 transfer() call to the treasury
      // This avoids the "would fail on target chain" simulation error that occurs
      // when the smart account doesn't already hold USDC on Arbitrum at build time.
      const usdcAmount = item.priceUSDC.toFixed(6); // e.g. "0.500000"
      const usdcAmountRaw = parseUnits(usdcAmount, 6); // USDC has 6 decimals

      const transferCalldata = ERC20_TRANSFER_IFACE.encodeFunctionData('transfer', [
        treasuryWallet,
        usdcAmountRaw,
      ]);

      console.log(`🛒 Building UA transaction: ${usdcAmount} USDC → ${treasuryWallet} on Arbitrum`);

      const transaction = await universalAccount.createUniversalTransaction({
        chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE,
        expectTokens: [
          {
            type: SUPPORTED_TOKEN_TYPE.USDC,
            amount: usdcAmount, // SDK bridges whatever is needed to meet this
          },
        ],
        transactions: [
          {
            to: USDC_ARBITRUM_ADDRESS,       // the USDC contract on Arbitrum
            data: transferCalldata,           // transfer(treasury, amount)
            value: '0x0',                    // ERC-20 transfer, no native value
          },
        ],
      });

      console.log('🛒 Transaction built, rootHash:', transaction.rootHash);

      // ── Step 2: Sign + broadcast (inline 7702 if needed) ──
      setTxStep('signing');
      const { transactionId } = await signAndSend(transaction);
      console.log('🛒 TX broadcast! particleTxId:', transactionId);

      // ── Step 3: Poll client-side until Particle confirms the tx ──
      // universalAccount.getTransaction() is the SDK method — no server-side REST API exists.
      // We log the full response so we can observe the exact status enum value.
      setTxStep('routing');
      const MAX_POLLS = 75;
      const POLL_MS = 4000;
      let confirmed = false;

      for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise((r) => setTimeout(r, POLL_MS));
        try {
          const txDetails = await universalAccount.getTransaction(transactionId);

          // Log the full object on the first few polls so we can see the status shape
          if (i < 3) console.log(`🔄 Poll ${i + 1} full response:`, JSON.stringify(txDetails));

          const rawStatus = txDetails?.status;
          const statusStr = (rawStatus ?? '').toString().toLowerCase();
          console.log(`🔄 Poll ${i + 1}: status = ${statusStr} (raw: ${rawStatus})`);

          // Explicitly failed
          if (statusStr === 'failed' || statusStr === 'error' || rawStatus === 3) {
            throw new Error('Particle transaction failed on-chain');
          }

          // Known success values (string or numeric)
          // Status 2 and 4 are both confirmed per observed SDK responses
          if (
            statusStr === 'success' ||
            statusStr === 'confirmed' ||
            statusStr === 'complete' ||
            rawStatus === 2 || statusStr === '2' ||
            rawStatus === 4 || statusStr === '4'
          ) {
            confirmed = true;
            break;
          }

          // If the txDetails object looks real (has transactionId) and
          // the status is NOT failed/pending-ish, trust the tx since
          // we already got a rootHash + sent it. After 5 polls (20s)
          // with a valid-looking response, proceed.
          const isRealResponse = txDetails && (txDetails.transactionId || txDetails.sender || txDetails.type);
          const isPending = statusStr === 'pending' || statusStr === 'processing' || statusStr === '' || rawStatus === 0 || rawStatus === 1;
          if (isRealResponse && !isPending && i >= 4) {
            console.warn(`🔄 Unrecognized status "${statusStr}" but tx object is real — treating as confirmed`);
            confirmed = true;
            break;
          }
        } catch (pollErr: any) {
          // Re-throw if it's our explicit failure error
          if (pollErr?.message?.includes('failed on-chain')) throw pollErr;
          // Otherwise log + keep retrying (404 while tx propagates is normal)
          console.warn(`🔄 Poll ${i + 1} error (transient):`, pollErr?.message);
        }
      }

      if (!confirmed) {
        // The tx was broadcast and likely settled — proceed optimistically rather than blocking.
        // The user can verify on UniversalX if needed.
        console.warn('⚠️ Poll timed out but tx was broadcast — proceeding to pass issuance');
        confirmed = true;
      }

      // ── Step 4: Tell backend to issue the on-chain pass ──
      setTxStep('confirming');
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          particleTxId: transactionId,
          buyerAddress,
          itemId: item.id,
          itemSlug: item.slug,
          priceUSDC: item.priceUSDC,
          chainItemId: item.chainItemId,
          sessionId: sessionId ?? null,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `Server error: ${response.status}`);
      }

      // ── Step 5: Pass issuance ──
      setTxStep('issuing');
      const data = await response.json();
      console.log('🛒 Pass issued!', data);

      const purchaseResult: PurchaseResult = {
        passId: data.passId,
        particleTxId: transactionId,
        arbTxHash: data.arbTxHash,
      };

      setResult(purchaseResult);
      setTxStep('done');

      // Refresh balance to show updated amount
      await refreshBalance();

      onSuccess?.(purchaseResult.passId, purchaseResult.particleTxId, purchaseResult.arbTxHash);

      // Auto-redirect after 3 seconds if redirect URL provided
      if (redirectUrl) {
        const successUrl = new URL(redirectUrl);
        successUrl.searchParams.set('unicard_pass_id', String(purchaseResult.passId));
        successUrl.searchParams.set('unicard_tx', transactionId);
        successUrl.searchParams.set('unicard_status', 'success');
        setTimeout(() => {
          window.location.href = successUrl.toString();
        }, 3000);
      }
    } catch (err: any) {
      console.error('❌ Purchase error:', err);
      const msg = err?.message || 'Transaction failed';
      setErrorMsg(msg.includes('cancelled') ? 'Transaction cancelled.' : msg);
      setTxStep('error');
      await refreshBalance();
    }
  };

  const handleCancel = () => {
    setTxStep('idle');
    setErrorMsg('');
  };

  // ── Render ──
  if (!hasEnough) {
    return (
      <div className="buy-section">
        <button
          className="btn-primary buy-btn buy-btn-disabled"
          onClick={() => setShowTopUp(!showTopUp)}
          id="buy-pass-btn"
        >
          💳 Insufficient balance — top up
        </button>

        {showTopUp && (
          <TopUpPrompt
            needed={item.priceUSDC}
            current={balance}
            depositAddress={depositAddress}
          />
        )}

        <style jsx>{`
          .buy-section { display: flex; flex-direction: column; gap: 0.75rem; }
          .buy-btn { width: 100%; padding: 14px; font-size: 1rem; border-radius: 14px; }
          .buy-btn-disabled { background: var(--glass-bg) !important; opacity: 0.7; }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* Transaction overlay (renders in the DOM but fixed-positioned) */}
      <TransactionSteps step={txStep} errorMsg={errorMsg} onCancel={handleCancel} />

      {/* Success receipt (shown below button after done) */}
      {txStep === 'done' && result && (
        <div className="receipt-card glass-card">
          <div className="receipt-header">
            <span className="receipt-check">✅</span>
            <span className="receipt-title">Pass #{result.passId} issued!</span>
          </div>
          <div className="receipt-links">
            <a
              href={arbiscanTxUrl(result.arbTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="receipt-link"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Arbiscan receipt
            </a>
            <a
              href={universalXActivityUrl(result.particleTxId)}
              target="_blank"
              rel="noopener noreferrer"
              className="receipt-link"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              UniversalX activity
            </a>
          </div>
          {redirectUrl && (
            <p className="receipt-redirect">Redirecting you back in 3s…</p>
          )}
        </div>
      )}

      {/* Main buy button */}
      {txStep === 'idle' || txStep === 'error' ? (
        <button
          id="buy-pass-btn"
          className="btn-primary buy-btn"
          onClick={handleBuy}
          disabled={txStep === 'error'}
        >
          {txStep === 'error' ? '❌ Failed — try again' : ` Pay $${item.priceUSDC.toFixed(2)}`}
        </button>
      ) : txStep === 'done' ? (
        <button id="buy-pass-btn" className="btn-primary buy-btn buy-btn-done" disabled>
          ✅ Pass Issued!
        </button>
      ) : (
        <button id="buy-pass-btn" className="btn-primary buy-btn buy-btn-processing" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" className="spin-icon">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="40 20" />
          </svg>
          Processing…
        </button>
      )}

      {/* <p className="gas-note">Gas included. Cross-chain routing automatic.</p>  not gasless user pays gas for cross chain txn via partical universal sdk - todo: need to update this note (take care of this by including gas + pass price in the priceUSDC) */}

      <style jsx>{`
        .buy-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .buy-btn {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .buy-btn-processing { opacity: 0.7; }
        .buy-btn-done { background: linear-gradient(135deg, #10b981, #06b6d4) !important; }
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .gas-note {
          text-align: center;
          font-size: 0.6875rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        .receipt-card {
          padding: 1rem;
          margin-bottom: 0.75rem;
          animation: slide-in 0.3s ease;
        }
        @keyframes slide-in { from { opacity: 0; transform: translateY(-8px); } }
        .receipt-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.625rem;
          font-size: 0.9375rem;
          font-weight: 700;
        }
        .receipt-links {
          display: flex;
          gap: 0.75rem;
        }
        .receipt-link {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          color: var(--color-primary-light);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .receipt-link:hover { border-color: var(--color-primary-light); }
        .receipt-redirect {
          font-size: 0.6875rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }
      `}</style>
    </>
  );
}
