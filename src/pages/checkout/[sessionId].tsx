import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import { db } from '@/lib/db';
import { useUniversalAccount } from '@/hooks/UniversalAccountProvider';
import { useMagic } from '@/hooks/MagicProvider';
import Login from '@/components/Login';
import BuyPassButton from '@/components/BuyPassButton';
import { AccessItemData } from '@/components/AccessCard';

interface CheckoutPageProps {
  session: {
    id: string;
    successUrl: string;
    cancelUrl: string;
    status: string;
    expiresAt: string;
  };
  item: AccessItemData;
}

export default function CheckoutPage({ session, item }: CheckoutPageProps) {
  const { token, setToken } = useMagic();         // ← global context, syncs with UAProvider
  const { accountInfo, primaryAssets } = useUniversalAccount();
  const address = accountInfo?.ownerAddress || '';
  const primaryBalance = Number(primaryAssets?.totalAmountInUSD ?? 0);
  const [passed, setPassed] = useState(false);

  const handleSuccess = (passId: number) => {
    setPassed(true);
    setTimeout(() => {
      const url = new URL(session.successUrl);
      url.searchParams.set('session_id', session.id);
      url.searchParams.set('pass_id', String(passId));
      url.searchParams.set('status', 'success');
      window.location.href = url.toString();
    }, 2500);
  };

  if (session.status !== 'open') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Session {session.status}</h1>
          <p style={{ color: '#888', marginBottom: 24 }}>This checkout session is no longer active.</p>
          <a href={session.cancelUrl} style={{ color: '#7c3aed', textDecoration: 'underline' }}>← Go back</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout — {item.title} | UniCard</title>
        <meta name="description" content={`Purchase access to ${item.title} with any crypto, any chain.`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif', background: '#0a0a0f' }}>
        {/* Left — Item Preview */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1a0a2e 0%, #0a0a1f 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px',
          borderRight: '1px solid rgba(124,58,237,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glow */}
          <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: 400, height: 400, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* UniCard badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20, padding: '6px 14px', marginBottom: 32 }}>
              <span style={{ fontSize: 14, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>UniCard</span>
              <span style={{ color: '#888', fontSize: 12 }}>Secure Checkout</span>
            </div>

            {/* Event image */}
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} style={{ width: '100%', maxWidth: 400, borderRadius: 16, marginBottom: 28, objectFit: 'cover', height: 220 }} />
            )}

            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12, lineHeight: 1.3 }}>{item.title}</h1>
            <p style={{ color: '#888', fontSize: 15, lineHeight: 1.6, marginBottom: 32, maxWidth: 380 }}>{item.description}</p>

            {/* Price */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 400 }}>
              <span style={{ color: '#888', fontSize: 14 }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>${item.priceUSDC.toFixed(2)} <span style={{ fontSize: 14, color: '#888' }}>USDC</span></span>
            </div>

            {/* Trust signals */}
            <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {['🔒 Chain abstracted', '⚡ Any wallet', '🌐 Any chain'].map(t => (
                <span key={t} style={{ fontSize: 12, color: '#666', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Powered by footer */}
          <div style={{ position: 'absolute', bottom: 24, left: 48, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#444', fontSize: 12 }}>Powered by</span>
            <span style={{ fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>UniCard</span>
            <span style={{ color: '#333', fontSize: 12 }}>× Particle Network × Magic</span>
          </div>
        </div>

        {/* Right — Login / Pay */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px 40px' }}>
          {passed ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 72, marginBottom: 16, animation: 'pulse 1s ease' }}>🎉</div>
              <h2 style={{ fontSize: 24, color: '#fff', fontWeight: 700, marginBottom: 8 }}>Payment Complete!</h2>
              <p style={{ color: '#888' }}>Redirecting you back...</p>
            </div>
          ) : !address ? (
            <div style={{ width: '100%', maxWidth: 400 }}>
              <h2 style={{ fontSize: 20, color: '#fff', fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>Sign in to complete purchase</h2>
              <p style={{ color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>Use your email — no wallet extension needed</p>
              <Login token={token} setToken={setToken} />
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: 400 }}>
              <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, fontSize: 13, color: '#888' }}>
                Logged in as <span style={{ color: '#a78bfa', fontWeight: 600 }}>{address.slice(0, 6)}...{address.slice(-4)}</span>
              </div>
              <BuyPassButton
                item={item}
                buyerAddress={address}
                balance={primaryBalance}
                depositAddress={accountInfo?.evmSmartAccount || ''}
                onSuccess={(passId) => handleSuccess(passId)}
              />
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <a href={session.cancelUrl} style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>Cancel and go back</a>
              </div>
            </div>
          )}
        </div>
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
    imageUrl: session.item.imageUrl ?? undefined,
    priceUSDC: session.item.priceUSDC,
    chainItemId: session.item.chainItemId ?? undefined,
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
