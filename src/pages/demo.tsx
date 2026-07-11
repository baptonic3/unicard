import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

const EVENT = {
  title: 'UXmaxx Hackathon by Encode',
  date: 'July 17-19, 2026',
  location: 'Dubai, UAE',
  price: 0.30,
  image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
  slug: 'arbitrum-hackathon-uxmaxx',
  description: 'The flagship Web3 UX hackathon. Build consumer dApps with embedded wallets, chain abstraction, and social login.',
  perks: ['Access to all workshops', 'Judging panel feedback', 'Networking with 200+ builders', 'Arbitrum mainnet demo slot'],
};

export default function DemoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUniCardPay = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemSlug: EVENT.slug,
          successUrl: `${window.location.origin}/demo?status=success`,
          cancelUrl: `${window.location.origin}/demo`,
          webhookUrl: null, // sellers would put their own webhook URL here
          metadata: { source: 'demo-page', event: EVENT.title },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create session');
      router.push(data.checkoutUrl);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const isSuccess = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('status') === 'success';

  return (
    <>
      <Head>
        <title>UXmaxx Hackathon — Demo Seller Page</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#050508', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
        {/* Demo banner */}
        <div style={{ background: 'linear-gradient(90deg,#7c3aed,#06b6d4)', padding: '10px 20px', textAlign: 'center', fontSize: 13, fontWeight: 600 }}>
          🎭 Demo Seller Page — This simulates an external event ticketing platform integrating UniCard
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#fff' }}>EncodeTickets <span style={{ color: '#7c3aed' }}>✦</span></div>
          <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#888' }}>
            <a href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</a>
            <a href="#" style={{ color: '#888', textDecoration: 'none' }}>Events</a>
            <a href="#" style={{ color: '#888', textDecoration: 'none' }}>About</a>
          </div>
        </nav>

        {/* Success banner */}
        {isSuccess && (
          <div style={{ margin: '24px 48px', padding: '16px 24px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, color: '#34d399', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
            ✅ Payment successful! Your pass has been issued on Arbitrum. Check your UniCard dashboard.
          </div>
        )}

        {/* Main content */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 48px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48 }}>
          {/* Left — Event details */}
          <div>
            <img src={EVENT.image} alt={EVENT.title} style={{ width: '100%', borderRadius: 20, height: 260, objectFit: 'cover', marginBottom: 32 }} />

            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              {['Hackathon', 'Web3', 'Chain Abstraction', 'Arbitrum'].map(tag => (
                <span key={tag} style={{ padding: '4px 12px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, fontSize: 12, color: '#a78bfa' }}>{tag}</span>
              ))}
            </div>

            <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>{EVENT.title}</h1>

            <div style={{ display: 'flex', gap: 24, marginBottom: 24, color: '#888', fontSize: 14 }}>
              <span>📅 {EVENT.date}</span>
              <span>📍 {EVENT.location}</span>
            </div>

            <p style={{ color: '#999', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>{EVENT.description}</p>

            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#fff' }}>What&apos;s included</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {EVENT.perks.map(perk => (
                <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ccc', fontSize: 15 }}>
                  <span style={{ color: '#7c3aed' }}>✓</span> {perk}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Payment panel */}
          <div style={{ position: 'sticky', top: 32, alignSelf: 'start' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Reserve your spot</h2>
              <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Limited seats available</p>

              {/* Price */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
                <span style={{ color: '#888' }}>Access pass</span>
                <span style={{ fontWeight: 700, fontSize: 18 }}>${EVENT.price.toFixed(2)} USDC</span>
              </div>

              {/* Pay with card — disabled */}
              <button disabled style={{
                width: '100%', padding: '14px', marginBottom: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)', color: '#444', fontSize: 15, cursor: 'not-allowed', fontFamily: 'Inter',
              }}>
                💳 Pay with card {/* <span style={{ fontSize: 12, marginLeft: 8, background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 10 }}></span> */}
              </button>

              {/* Pay with UniCard */}
              <button
                onClick={handleUniCardPay}
                disabled={loading}
                style={{
                  width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                  background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                  color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
                }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Creating session...
                  </>
                ) : (
                  <>
                    ⚡ Pay with UniCard
                    <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 10 }}>Any chain</span>
                  </>
                )}
              </button>

              {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>}

              {/* Trust signals */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#444', fontSize: 12 }}>Powered by</span>
                <span style={{ fontWeight: 700, fontSize: 12, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>UniCard</span>
              </div>
            </div>

            {/* Seller integration snippet */}
            <div style={{ marginTop: 16, padding: 16, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
              <p style={{ color: '#555', fontSize: 11, marginBottom: 8, fontStyle: 'italic' }}>🛠 How this button works (seller code):</p>
              <pre style={{ color: '#7dd3fc', fontSize: 11, overflow: 'auto', margin: 0 }}>{`POST /api/sessions
  {
    itemSlug: "arbitrum-hackathon-uxmaxx",
    successUrl: "https://encodetix.com/success",
    cancelUrl: "https://encodetix.com/event",
    webhookUrl: "https://encodetix.com/webhook"
  }
  → { checkoutUrl }  // redirect buyer here`}</pre>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
