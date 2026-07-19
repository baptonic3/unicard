import { GetServerSideProps } from 'next';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { db } from '@/lib/db';
import { useUniversalAccount } from '@/hooks/UniversalAccountProvider';
import { useMagic } from '@/hooks/MagicProvider';
import { getUserAddress, truncateAddress } from '@/utils/common';
import BuyPassButton from '@/components/BuyPassButton';
import PassCard from '@/components/PassCard';
import Header from '@/components/Header';
import { AccessItemData } from '@/components/AccessCard';
import UnifiedBalanceCard from '@/components/UnifiedBalanceCard';

interface CheckoutPageProps {
  session: {
    id: string;
    successUrl: string;
    cancelUrl: string;
    status: string;
    expiresAt: string;
    sellerName?: string;
  };
  item: AccessItemData;
}

// ── Countdown timer hook ──────────────────────────────
function useCountdown(expiresAt: string) {
  const calc = () => Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
  const [seconds, setSeconds] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setSeconds(calc()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return { display: `${mm}:${ss}`, expired: seconds === 0 };
}

// ── Dark mode theme (same as dashboard) ──────────────
const LIGHT = {
  bg: '#fcfcfc', surface: '#fff', border: '#e2e8f0', text: '#111',
  subtext: '#64748b', muted: '#f1f5f9', accent: '#00e599',
  navBorder: '#e2e8f0', navBg: '#fff', activeTab: '#111',
  cardShadow: '0 2px 4px rgba(0,0,0,0.02)',
};


export default function CheckoutPage({ session, item }: CheckoutPageProps) {
  const router = useRouter();
  const { token, setToken } = useMagic();
  const { accountInfo, primaryAssets } = useUniversalAccount();
  const address = accountInfo?.ownerAddress || '';
  const evmSmartAccount = accountInfo?.evmSmartAccount || '';
  const solanaSmartAccount = accountInfo?.solanaSmartAccount || '';
  const primaryBalance = Number(primaryAssets?.totalAmountInUSD ?? 0).toFixed(2);
  const [mounted, setMounted] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    passId: number; arbTxHash: string; particleTxId: string;
  } | null>(null);
  const [redirectTimer, setRedirectTimer] = useState(13);

  const { display: timerDisplay, expired: sessionExpired } = useCountdown(session.expiresAt);
  const hasEnough = Number(primaryAssets?.totalAmountInUSD ?? 0) >= item.priceUSDC;
  const t = LIGHT;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!mounted) return;
    const addr = getUserAddress();
    if (!token && !addr) {
      router.replace(`/login?next=/checkout/${session.id}`);
    }
  }, [mounted, token]);

  const handleSuccess = (passId: number, particleTxId?: string, arbTxHash?: string) => {
    setPurchaseResult({ passId, arbTxHash: arbTxHash || '', particleTxId: particleTxId || '' });
  };

  // Handle countdown and auto-redirect when purchaseResult exists
  useEffect(() => {
    if (purchaseResult) {
      if (redirectTimer > 0) {
        const timer = setTimeout(() => setRedirectTimer(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const successHref = (() => {
          try {
            const url = new URL(session.successUrl);
            url.searchParams.set('session_id', session.id);
            url.searchParams.set('pass_id', String(purchaseResult.passId));
            url.searchParams.set('status', 'success');
            return url.toString();
          } catch { return session.successUrl; }
        })();
        window.location.href = successHref;
      }
    }
  }, [purchaseResult, redirectTimer, session]);

  if (!mounted) return null;

  // ── Session not open (complete / expired) ──
  if (session.status !== 'open') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Session {session.status}</h1>
          <p style={{ color: '#888', marginBottom: 24 }}>This checkout session is no longer active.</p>
          <a href={session.cancelUrl} style={{ color: '#7c3aed', textDecoration: 'underline' }}>← Go back</a>
        </div>
      </div>
    );
  }

  // ── After purchase: full-page receipt ──
  if (purchaseResult) {
    const successHref = (() => {
      try {
        const url = new URL(session.successUrl);
        url.searchParams.set('session_id', session.id);
        url.searchParams.set('pass_id', String(purchaseResult.passId));
        url.searchParams.set('status', 'success');
        return url.toString();
      } catch { return session.successUrl; }
    })();

    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        <Header token={token} setToken={setToken} />
        <div style={{ maxWidth: 540, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Success header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', letterSpacing: '-0.02em', marginBottom: 8 }}>
              Payment Complete!
            </h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>Your access pass has been issued on Arbitrum.</p>
          </div>

          {/* PassCard */}
          <PassCard
            passId={purchaseResult.passId}
            itemTitle={item.title}
            itemDescription={item.description}
            itemImageUrl={item.imageUrl ?? undefined}
            priceUSDC={item.priceUSDC}
            buyerAddress={address}
            arbTxHash={purchaseResult.arbTxHash}
            particleTxId={purchaseResult.particleTxId}
          />

          {/* CTAs */}
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
              Redirecting to the store in {redirectTimer}s...
            </div>
            <a
              href={successHref}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '16px 0', borderRadius: 14, fontWeight: 700, fontSize: 16,
                background: '#00e599', color: '#fff', textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,229,153,0.35)',
                transition: 'opacity 0.2s',
              }}
            >
              Return to store →
            </a>
            {/* <Link href="/dashboard" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
              View in my wallet →
            </Link> */}
          </div>
        </div>
      </div>
    );
  }

  // ── Main checkout page ──
  return (
    <>
      <Head>
        <title>Checkout — {item.title} | UniCard</title>
        <meta name="description" content={`Purchase access to ${item.title} with any crypto, any chain.`} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ backgroundColor: t.bg, minHeight: '100vh', color: t.text, fontFamily: 'Inter, sans-serif', transition: 'background-color 0.25s, color 0.25s' }}>

        {/* ── Header ── */}
        <Header token={token} setToken={setToken} />

        {/* <div style={{ borderBottom: `1px solid ${t.navBorder}`, backgroundColor: t.navBg, transition: 'background 0.25s' }}>
          <nav style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/dashboard" style={{ display: 'inline-block', padding: '14px 16px', color: t.subtext, textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>Wallet</Link>
            <span style={{ display: 'inline-block', padding: '14px 16px', color: t.subtext, fontSize: 14, cursor: 'default' }}>Transactions</span>
            <span style={{ display: 'inline-block', padding: '14px 16px', color: t.subtext, fontSize: 14, cursor: 'default' }}>Settings</span>

            <div style={{ marginLeft: 'auto' }}>
              <button
                onClick={() => setIsDark(d => !d)}
                title={isDark ? 'Light mode' : 'Dark mode'}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                  border: `1px solid ${t.navBorder}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                {isDark
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0f0f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                }
              </button>
            </div>
          </nav>
        </div> */}

        {/* ── Main content ── */}
        <main style={{ maxWidth: '1024px', margin: '0 auto', padding: '40px 24px' }}>

          {/* Welcome */}
          <div style={{ marginBottom: 30 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4, color: t.text }}>Welcome back</h1>
            <p style={{ color: t.subtext, fontSize: 14 }}>
              Your EOA&nbsp;
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                {address ? truncateAddress(address) : '—'}
              </span>
            </p>
          </div>

          {/* ── Pending Payment Block ── */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 20, padding: '24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            marginBottom: 32,
            transition: 'background 0.25s, border-color 0.25s',
          }}>
            {/* Event row (Side-by-side Image 2 Layout) */}
            <div style={{ display: 'flex', gap: 32, alignItems: 'stretch' }}>
              {/* Event image */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: 280, height: 280, borderRadius: 16, objectFit: 'cover', flexShrink: 0, border: '1px solid #e2e8f0' }}
                />
              )}

              {/* Event details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                {/* Status row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff7ed', borderRadius: 20, padding: '5px 12px' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#c2410c' }}>Pending payment</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: sessionExpired ? '#ef4444' : t.subtext, fontSize: 13 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {sessionExpired
                      ? 'Session expired'
                      : `Reserved · ${timerDisplay} left`
                    }
                  </div>
                </div>

                <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{item.title}</h2>
                
                {item.description && (
                  <p style={{ fontSize: 15, color: t.subtext, marginBottom: 16, lineHeight: 1.5 }}>{item.description}</p>
                )}
                
                {/* <a href="#" style={{ fontSize: 14, fontWeight: 600, color: '#10b981', textDecoration: 'none', marginBottom: 'auto' }}>
                  View on lu.ma/ethglobal ↗
                </a> */}

                {/* Price row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: `1px solid ${t.border}`, paddingTop: 16, marginTop: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                    <span style={{ color: t.subtext }}>Price</span>
                    <span style={{ color: t.text, fontWeight: 500 }}>${item.priceUSDC.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 700, marginTop: 4 }}>
                    <span style={{ color: t.text }}>Total</span>
                    <span style={{ color: t.text }}>${item.priceUSDC.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insufficient Balance Notice */}
            {!hasEnough && !sessionExpired && (
              <div style={{ marginTop: 20, color: '#b45309', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.00004 2L1.33337 13.3333H14.6667L8.00004 2ZM7.33337 6H8.66671V10H7.33337V6ZM7.33337 11.3333H8.66671V12.6667H7.33337V11.3333Z" fill="#9A5410"/>
                </svg>
                Insufficient balance — add ${item.priceUSDC.toFixed(2)} to your balance to pay
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: !hasEnough && !sessionExpired ? 12 : 20 }}>
              <a
                href={session.cancelUrl}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.03)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = t.border;
                  e.currentTarget.style.color = t.subtext;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                style={{
                  flex: 1, padding: '14px 0', borderRadius: 14, margin: '0 0 0.5rem 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${t.border}`, color: t.subtext, fontSize: 16, fontWeight: 600,
                  textDecoration: 'none', background: '#fff', cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Cancel
              </a>

              {sessionExpired ? (
                <div style={{
                  flex: 1, padding: '13px 0', textAlign: 'center', borderRadius: 12,
                  background: '#f1f5f9', color: '#94a3b8', fontSize: 15, fontWeight: 600,
                }}>
                  Session expired
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <BuyPassButton
                    item={item}
                    buyerAddress={address}
                    balance={Number(primaryAssets?.totalAmountInUSD ?? 0)}
                    depositAddress={evmSmartAccount}
                    sessionId={session.id}
                    onSuccess={(passId, particleTxId, arbTxHash) => handleSuccess(passId, particleTxId, arbTxHash)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom 2-col Grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* Universal Balance */}
            {/* Universal Balance */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24, boxShadow: t.cardShadow, display: 'flex', flexDirection: 'column', alignSelf: 'start' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.subtext, marginBottom: 8 }}>Universal Balance</div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: t.text }}>
                  ${primaryBalance}
                </div>
                <svg width="150" height="40" viewBox="0 0 120 40" fill="none" preserveAspectRatio="none">
                  <path d="M0 32L15 28L30 34L50 20L65 26L85 14L105 18L120 8" stroke="#00e599" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 13, color: t.subtext, marginTop: 6 }}>across all chains</div>

              {/* Delegated Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${t.border}`, marginTop: 24, paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e599" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: t.text, lineHeight: 1.2 }}>EIP-7702 Delegation</h3>
                      <div 
                        style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        onMouseOver={(e) => {
                           const tooltip = e.currentTarget.querySelector('.tooltip-popup') as HTMLElement;
                           if (tooltip) { tooltip.style.opacity = '1'; tooltip.style.transform = 'translate(-50%, -8px)'; tooltip.style.visibility = 'visible'; }
                        }}
                        onMouseOut={(e) => {
                           const tooltip = e.currentTarget.querySelector('.tooltip-popup') as HTMLElement;
                           if (tooltip) { tooltip.style.opacity = '0'; tooltip.style.transform = 'translate(-50%, 0px)'; tooltip.style.visibility = 'hidden'; }
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <div 
                          className="tooltip-popup"
                          style={{
                            position: 'absolute', bottom: '100%', left: '50%', transform: 'translate(-50%, 0)', visibility: 'hidden',
                            width: 290, padding: 14, borderRadius: 10, background: '#27272a', color: '#f8fafc',
                            fontSize: 13, lineHeight: 1.5, fontWeight: 400, opacity: 0, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10, pointerEvents: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                          }}
                        >
                          Enables smart-account features for cross-chain payments while keeping your existing wallet address. Pay from any supported chain without switching networks—you remain in control and approve every transaction.
                          <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', borderWidth: 6, borderStyle: 'solid', borderColor: '#27272a transparent transparent transparent' }} />
                        </div>
                      </div>
                    </div>
                    {/* <span style={{ fontSize: '13px', color: t.subtext, marginTop: 2 }}>Pay from EOA directly</span> */}
                  </div>
                </div>
                  
                  {/* Status Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f0fdf4', padding: '4px 10px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#15803d' }}>Auto-delegating</span>
                  </div>
                </div>
              </div>
            {/* UnifiedBalanceCard overriding EIP-7702 Delegation */}
            <UnifiedBalanceCard />
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const sessionId = params?.sessionId as string;

  const session = await db.checkoutSession.findUnique({
    where: { id: sessionId },
    include: { item: true },
  });

  if (!session) return { notFound: true };

  if (session.status === 'open' && new Date() > session.expiresAt) {
    await db.checkoutSession.update({ where: { id: sessionId }, data: { status: 'expired' } });
  }

  const item: AccessItemData = {
    id: session.item.id,
    slug: session.item.slug,
    title: session.item.title,
    description: session.item.description,
    imageUrl: session.item.imageUrl ?? null,
    priceUSDC: session.item.priceUSDC,
    chainItemId: session.item.chainItemId ?? null,
    active: session.item.active,
  };

  return {
    props: {
      session: {
        id: session.id,
        successUrl: session.successUrl,
        cancelUrl: session.cancelUrl,
        status: session.status,
        expiresAt: session.expiresAt.toISOString(),
      },
      item,
    },
  };
};
