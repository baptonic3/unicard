import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { AccessItemData } from '@/components/AccessCard';
import { useUniversalAccount } from '@/hooks/UniversalAccountProvider';
import { getUserAddress, truncateAddress } from '@/utils/common';
import Login from '@/components/Login';
import CheckoutPreview from '@/components/CheckoutPreview';
import BuyPassButton from '@/components/BuyPassButton';

interface AccessPageProps {
  token: string;
  setToken: (t: string) => void;
  item: AccessItemData | null;
}

// Derive a friendly referrer display name from a URL
function getReferrerName(url: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

export default function AccessPage({ token, setToken, item }: AccessPageProps) {
  const router = useRouter();
  const { primaryAssets, accountInfo } = useUniversalAccount();
  const [address, setAddress] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Read redirect param from URL (preserved through login)
  const redirect = typeof router.query.redirect === 'string' ? router.query.redirect : null;
  const referrerName = getReferrerName(redirect);

  useEffect(() => {
    setMounted(true);
    setAddress(getUserAddress());
  }, [token]);

  if (!mounted) return null;

  if (!item) {
    return (
      <div className="not-found">
        <h1>Pass Not Found</h1>
        <p>This access pass does not exist or has been removed.</p>
        <Link href="/" className="btn-primary back-btn">← Back to passes</Link>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <style jsx>{`.not-found { text-align: center; padding: 6rem 2rem; }`}</style>
      </div>
    );
  }

  const balance = Number(primaryAssets?.totalAmountInUSD ?? 0);
  const hasEnough = balance >= item.priceUSDC;
  const isLoggedIn = !!token && !!address;

  return (
    <>
      <Head>
        <title>{item.title} — UniCard Checkout</title>
        <meta name="description" content={`Pay for ${item.title} with any token on any chain. Settles on Arbitrum.`} />
      </Head>

      <div className="checkout-root">
        {/* ── Back link (subtle, top-left) */}
        <Link href="/" className="back-link">← All passes</Link>

        {/* ─────────────────────────────────────────────────
            CHECKOUT LAYOUT — varies by login state
            ───────────────────────────────────────────────── */}

        {!isLoggedIn ? (
          /* ══ LOGGED OUT: split view ══
             Left: item preview | Right: login panel */
          <div className="checkout-split">
            {/* Left pane — item preview */}
            <div className="checkout-left fade-in">
              <CheckoutPreview item={item} referrer={referrerName} />
            </div>

            {/* Right pane — login to proceed */}
            <div className="checkout-right fade-in">
              <div className="checkout-card glass-card">
                {/* Glow orb */}
                <div className="card-glow" />

                <div className="checkout-card-header">
                  <div className="checkout-lock-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#checkout-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="checkout-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h2 className="gradient-text checkout-heading">Complete Checkout</h2>
                  <p className="checkout-subheading">
                    Sign in to pay with any asset on any chain.
                    No wallet extension. No bridging.
                  </p>
                </div>

                {/* Price summary */}
                <div className="price-summary">
                  <div className="price-summary-row">
                    <span className="price-summary-label">You pay</span>
                    <span className="price-summary-amount gradient-text">
                      ${item.priceUSDC.toFixed(2)} USDC
                    </span>
                  </div>
                  <div className="price-summary-row price-summary-sub">
                    <span>Settles on</span>
                    <span className="chain-inline">
                      <span className="pulse-dot-sm" />
                      Arbitrum One
                    </span>
                  </div>
                </div>

                {/* Login form */}
                <div className="login-section">
                  <Login token={token} setToken={setToken} />
                </div>

                <p className="checkout-disclaimer">
                  By signing in, your Universal Account handles cross-chain routing automatically.
                  Gas is deducted from your token balance.
                </p>
              </div>

              {/* Powered-by footer */}
              <div className="powered-by">
                <span>Powered by</span>
                <span className="gradient-text">Particle Network</span>
                <span>×</span>
                <span className="gradient-text">Magic</span>
                <span>×</span>
                <span className="gradient-text">Arbitrum</span>
              </div>
            </div>
          </div>
        ) : (
          /* ══ LOGGED IN: checkout panel ══ */
          <div className="checkout-logged-in">
            {/* Left: item info (compact) */}
            <div className="item-compact-wrap fade-in">
              <div className="item-compact glass-card">
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.title} className="item-compact-img" />
                )}
                <div className="item-compact-info">
                  <h1 className="item-compact-title">{item.title}</h1>
                  <p className="item-compact-desc">{item.description}</p>
                  <div className="item-compact-meta">
                    <div className="meta-row">
                      <span className="meta-label">Price</span>
                      <span className="meta-value">${item.priceUSDC.toFixed(2)} <span className="price-unit">USDC</span></span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Settlement</span>
                      <span className="meta-value chain-inline">
                        <span className="pulse-dot-sm" />
                        Arbitrum One
                      </span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Payment</span>
                      <span className="meta-value">Any chain, any asset</span>
                    </div>
                    {item.chainItemId != null && (
                      <div className="meta-row">
                        <span className="meta-label">On-chain ID</span>
                        <span className="meta-value mono">#{item.chainItemId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: buy panel */}
            <div className="buy-panel-wrap fade-in">
              <div className="buy-card glass-card">
                <h2 className="buy-title">Complete Purchase</h2>

                {/* Balance row */}
                <div className="balance-row">
                  <span className="balance-label">Your universal balance</span>
                  <span className={`balance-amount ${hasEnough ? 'balance-ok' : 'balance-low'}`}>
                    ${balance.toFixed(2)}
                  </span>
                </div>

                {/* Price row */}
                <div className="price-row">
                  <span>Pass price</span>
                  <span className="price-final">${item.priceUSDC.toFixed(2)} USDC</span>
                </div>

                {/* Account row */}
                <div className="account-row">
                  <span className="account-label">Your account</span>
                  <span className="address-truncate">{truncateAddress(address || '')}</span>
                </div>

                {/* BuyPassButton handles balance check, TopUpPrompt, TransactionSteps overlay, and receipt */}
                <BuyPassButton
                  item={item}
                  buyerAddress={address || ''}
                  balance={balance}
                  depositAddress={accountInfo.evmSmartAccount || address || ''}
                  redirectUrl={redirect || undefined}
                />

                {/* Trust row */}
                <div className="trust-row">
                  {[
                    { icon: '🔒', label: 'Non-custodial' },
                    { icon: '⛓️', label: 'On-chain proof' },
                    { icon: '🌐', label: 'Cross-chain' },
                  ].map((t) => (
                    <div key={t.label} className="trust-item">
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>

                {/* Return link if redirect param present */}
                {redirect && (
                  <div className="redirect-hint">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 14l-4-4 4-4"/>
                      <path d="M5 10h11a4 4 0 0 1 0 8h-1"/>
                    </svg>
                    You'll be returned to <strong>{referrerName || 'the seller'}</strong> after purchase.
                  </div>
                )}
              </div>

              {/* Powered by */}
              <div className="powered-by">
                <span>Powered by</span>
                <span className="gradient-text">Particle Network</span>
                <span>×</span>
                <span className="gradient-text">Magic</span>
                <span>×</span>
                <span className="gradient-text">Arbitrum</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        .checkout-root {
          max-width: 1100px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 4rem;
        }
        .back-link {
          display: inline-block;
          margin-bottom: 1.5rem;
          color: var(--text-muted);
          font-size: 0.8125rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-link:hover { color: var(--text-primary); }

        /* ── LOGGED OUT: split layout ── */
        .checkout-split {
          display: grid;
          grid-template-columns: 1fr 460px;
          gap: 2.5rem;
          align-items: start;
        }
        @media (max-width: 920px) {
          .checkout-split {
            grid-template-columns: 1fr;
          }
          .checkout-left {
            order: 2;
          }
          .checkout-right {
            order: 1;
          }
        }
        .checkout-card {
          position: relative;
          padding: 2rem;
          overflow: hidden;
        }
        .card-glow {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .checkout-card-header {
          text-align: center;
          margin-bottom: 1.5rem;
          position: relative;
        }
        .checkout-lock-icon {
          margin-bottom: 0.75rem;
        }
        .checkout-heading {
          font-size: 1.375rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .checkout-subheading {
          color: var(--text-secondary);
          font-size: 0.8125rem;
          line-height: 1.5;
        }
        .price-summary {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 0.875rem 1rem;
          margin-bottom: 1.25rem;
        }
        .price-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }
        .price-summary-row + .price-summary-row {
          margin-top: 0.375rem;
          padding-top: 0.375rem;
          border-top: 1px solid var(--glass-border);
        }
        .price-summary-label {
          color: var(--text-muted);
          font-size: 0.8125rem;
        }
        .price-summary-amount {
          font-size: 1.125rem;
          font-weight: 800;
        }
        .price-summary-sub {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .chain-inline {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-accent-light);
          font-weight: 600;
        }
        .pulse-dot-sm {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent);
          box-shadow: 0 0 5px var(--color-accent);
          display: inline-block;
          animation: pulse-dot 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .login-section {
          margin-bottom: 0.75rem;
        }
        .checkout-disclaimer {
          font-size: 0.6875rem;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.5;
          margin-top: 0.5rem;
        }

        /* ── LOGGED IN: separate layout ── */
        .checkout-logged-in {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .checkout-logged-in {
            grid-template-columns: 1fr;
          }
        }
        .item-compact {
          padding: 0;
          overflow: hidden;
        }
        .item-compact-img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
        }
        .item-compact-info {
          padding: 1.5rem;
        }
        .item-compact-title {
          font-size: 1.375rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .item-compact-desc {
          color: var(--text-secondary);
          font-size: 0.8125rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
        .item-compact-meta {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--glass-border);
          font-size: 0.8125rem;
        }
        .meta-row:last-child { border-bottom: none; }
        .meta-label { color: var(--text-muted); font-weight: 500; }
        .meta-value { font-weight: 600; }
        .price-unit {
          color: var(--color-accent-light);
          font-size: 0.6875rem;
          font-weight: 500;
        }
        .mono {
          font-family: 'Fira Code', monospace;
          font-size: 0.8125rem;
        }

        /* Buy panel */
        .buy-card {
          padding: 1.75rem;
          position: sticky;
          top: 80px;
        }
        .buy-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 1.25rem;
        }
        .balance-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }
        .balance-label { color: var(--text-muted); font-size: 0.8125rem; }
        .balance-amount { font-weight: 700; font-size: 1rem; }
        .balance-ok { color: var(--color-success); }
        .balance-low { color: var(--color-warning); }
        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--glass-border);
          margin-bottom: 0.75rem;
        }
        .price-final { font-weight: 700; color: var(--text-primary); }
        .account-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8125rem;
          margin-bottom: 1rem;
        }
        .account-label { color: var(--text-muted); }
        .notice-box {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 0.75rem;
          border-radius: 10px;
          font-size: 0.8125rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }
        .notice-warn {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: var(--color-warning);
        }
        .buy-btn {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          margin-bottom: 0.75rem;
          border-radius: 14px;
        }
        .gas-note {
          text-align: center;
          font-size: 0.6875rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .trust-row {
          display: flex;
          justify-content: space-around;
          padding-top: 0.75rem;
          border-top: 1px solid var(--glass-border);
          margin-bottom: 0.75rem;
        }
        .trust-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 0.6875rem;
          color: var(--text-muted);
        }
        .trust-item span:first-child { font-size: 1.125rem; }
        .redirect-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-muted);
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
        }

        /* Powered-by footer */
        .powered-by {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          margin-top: 1rem;
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        /* Not found */
        .not-found { text-align: center; padding: 6rem 2rem; }
        .back-btn { display: inline-block; margin-top: 1.5rem; text-decoration: none; }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;

  try {
    const item = await db.accessItem.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        imageUrl: true,
        priceUSDC: true,
        chainItemId: true,
        active: true,
      },
    });

    if (!item || !item.active) {
      return { props: { item: null } };
    }

    return { props: { item } };
  } catch {
    return { props: { item: null } };
  }
};
