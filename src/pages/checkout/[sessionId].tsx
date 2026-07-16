import { GetServerSideProps } from 'next';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { db } from '@/lib/db';
import { useUniversalAccount } from '@/hooks/UniversalAccountProvider';
import { useMagic } from '@/hooks/MagicProvider';
import { getUserAddress, saveUserInfo, truncateAddress } from '@/utils/common';
import BuyPassButton from '@/components/BuyPassButton';
import PassCard from '@/components/PassCard';
import Header from '@/components/Header';
import SignInModal from '@/components/checkout/SignInModal';
import SignInScreen from '@/components/checkout/SignInScreen';
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
  const { magic, token, setToken } = useMagic();
  const { accountInfo, primaryAssets, isDelegated } = useUniversalAccount();
  const address = accountInfo?.ownerAddress || '';
  const evmSmartAccount = accountInfo?.evmSmartAccount || '';
  const solanaSmartAccount = accountInfo?.solanaSmartAccount || '';
  const primaryBalance = Number(primaryAssets?.totalAmountInUSD ?? 0).toFixed(2);
  const [mounted, setMounted] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    passId: number; arbTxHash: string; particleTxId: string;
  } | null>(null);

  const { display: timerDisplay, expired: sessionExpired } = useCountdown(session.expiresAt);
  const hasEnough = Number(primaryAssets?.totalAmountInUSD ?? 0) >= item.priceUSDC;
  const t = LIGHT;

  // Inline sign-in (Magic email OTP) shown as a modal over the checkout.
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loggedOut = mounted && !token && !getUserAddress();

  const handleEmailSignIn = async (submittedEmail: string) => {
    if (!magic) {
      setOtpError('Sign-in is unavailable right now. Please try again.');
      return;
    }
    try {
      setOtpSubmitting(true);
      setOtpError(null);
      const didToken = await magic.auth.loginWithEmailOTP({ email: submittedEmail });
      const metadata = await magic.user.getInfo();
      const publicAddress = metadata?.wallets?.ethereum?.publicAddress;
      if (!didToken || !publicAddress) throw new Error('Login failed');
      saveUserInfo(didToken, 'EMAIL', publicAddress);
      setToken(didToken); // re-renders into the authenticated checkout
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (!msg.includes('canceled')) setOtpError('Sign-in failed. Please try again.');
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!magic) {
      setOtpError('Sign-in is unavailable right now. Please try again.');
      return;
    }
    // Reuses /login's existing OAuth callback handling. The destination is
    // carried in the redirect URL (?next=) so it survives the OAuth roundtrip
    // even if sessionStorage doesn't; sessionStorage stays as the fast path.
    const next = `/checkout/${session.id}`;
    sessionStorage.setItem('magic_oauth_next', next);
    try {
      setOtpSubmitting(true);
      setOtpError(null);
      await magic.oauth2.loginWithRedirect({
        provider: 'google',
        redirectURI: new URL(`/login?next=${encodeURIComponent(next)}`, window.location.origin).href,
      });
    } catch (err) {
      console.error('Social login init error:', err);
      setOtpSubmitting(false);
      setOtpError('Failed to connect to Google.');
    }
  };

  const handleSuccess = (passId: number, particleTxId?: string, arbTxHash?: string) => {
    setPurchaseResult({ passId, arbTxHash: arbTxHash || '', particleTxId: particleTxId || '' });
  };

  if (!mounted) return null;

  // ── Logged out: sign-in-to-purchase modal over a dimmed wallet ──
  // The modal handles both the live countdown and the expired state itself.
  if (loggedOut) {
    return (
      <SignInScreen>
        <SignInModal
          itemTitle={item.title}
          itemDescription={item.description}
          total={`$${item.priceUSDC.toFixed(2)}`}
          thumbnailSrc={item.imageUrl ?? undefined}
          expiresAt={new Date(session.expiresAt).getTime()}
          expired={session.status !== 'open'}
          eventUrl={session.cancelUrl}
          onSubmit={handleEmailSignIn}
          onGoogleSignIn={handleGoogleSignIn}
          submitting={otpSubmitting}
          submitError={otpError}
        />
      </SignInScreen>
    );
  }

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
    return (
      <div style={{ minHeight: '100vh', background: t.bg, fontFamily: 'Inter, sans-serif', transition: 'background 0.25s' }}>
        <Header token={token} setToken={setToken} />
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Payment Complete!
            </h1>
            <p style={{ color: t.subtext, fontSize: 14 }}>Your access pass has been issued on Arbitrum.</p>
          </div>

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

          {/* Return CTA */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <a
              href={(() => {
                try {
                  const url = new URL(session.successUrl);
                  url.searchParams.set('session_id', session.id);
                  url.searchParams.set('pass_id', String(purchaseResult.passId));
                  url.searchParams.set('status', 'success');
                  return url.toString();
                } catch { return session.successUrl; }
              })()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15,
                background: '#00e599', color: '#fff', textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
            >
              {item.title ? `Return to checkout →` : 'Return to seller →'}
            </a>
            <div style={{ marginTop: 12 }}>
              <Link href="/dashboard" style={{ fontSize: 13, color: t.subtext, textDecoration: 'none' }}>
                View in my wallet →
              </Link>
            </div>
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
            {/* Status row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 20, padding: '5px 12px' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316', flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#c2410c' }}>Pending payment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: sessionExpired ? '#ef4444' : t.subtext, fontSize: 13 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {sessionExpired
                  ? 'Session expired'
                  : `Reserved · ${timerDisplay} left`
                }
              </div>
            </div>

            {/* Event row */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              {/* Event image */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: 180, height: 180, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                />
              )}

              {/* Event details */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 4, lineHeight: 1.3 }}>{item.title}</h2>
                {item.description && (
                  <p style={{ fontSize: 13, color: t.subtext, marginBottom: 12, lineHeight: 1.5 }}>{item.description}</p>
                )}
                {/* Price row — no fee */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderTop: `1px solid ${t.border}`, paddingTop: 12, marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: t.subtext }}>Price</span>
                    <span style={{ color: t.text, fontWeight: 500 }}>${item.priceUSDC.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginTop: 5 }}>
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
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00004 2L1.33337 13.3333H14.6667L8.00004 2ZM7.33337 6H8.66671V10H7.33337V6ZM7.33337 11.3333H8.66671V12.6667H7.33337V11.3333Z" fill="#9A5410"/>
                </svg>
                Insufficient balance — add ${item.priceUSDC.toFixed(2)} to your balance to pay
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: !hasEnough && !sessionExpired ? 12 : 20 }}>
              <a
                href={session.cancelUrl}
                style={{
                  flex: 1, padding: '13px 0', textAlign: 'center', borderRadius: 12,
                  border: `1px solid ${t.border}`, color: t.subtext, fontSize: 15, fontWeight: 600,
                  textDecoration: 'none', background: 'transparent', cursor: 'pointer',
                  transition: 'background 0.15s',
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
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24, boxShadow: t.cardShadow }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.subtext, marginBottom: 8 }}>Universal Balance</div>
              <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6, color: t.text }}>
                ${primaryBalance}
              </div>
              <div style={{ fontSize: 13, color: t.subtext }}>across all chains</div>
              <svg style={{ marginTop: 16, display: 'block' }} width="100%" height="32" viewBox="0 0 200 32" fill="none" preserveAspectRatio="none">
                <path d="M0 28L25 24L45 30L65 18L85 22L105 14L125 18L145 10L165 12L185 5L200 6" stroke="#00e599" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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

  let status = session.status;
  if (status === 'open' && new Date() > session.expiresAt) {
    await db.checkoutSession.update({ where: { id: sessionId }, data: { status: 'expired' } });
    status = 'expired';
  }

  const item: AccessItemData = {
    id: session.item.id,
    slug: session.item.slug,
    title: session.item.title,
    description: session.item.description,
    imageUrl: session.item.imageUrl ?? undefined,
    priceUSDC: session.item.priceUSDC,
    chainItemId: session.item.chainItemId ?? undefined,
    active: session.item.active,
  };

  // JSON round-trip strips `undefined` values, which Next.js cannot serialize.
  return {
    props: JSON.parse(
      JSON.stringify({
        session: {
          id: session.id,
          successUrl: session.successUrl,
          cancelUrl: session.cancelUrl,
          status,
          expiresAt: session.expiresAt.toISOString(),
        },
        item,
      })
    ),
  };
};
