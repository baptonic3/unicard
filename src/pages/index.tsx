import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>UniCard — One Account. One Pass. Any Chain.</title>
        <meta
          name="description"
          content="The chain-abstracted checkout engine. Buy access passes from any chain using any asset. Powered by Particle Universal Accounts and settled on Arbitrum."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="landing-root">
        {/* Hero */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title fade-in">
              One Account.<br />
              <span className="gradient-text">One Pass.</span><br />
              Any Chain.
            </h1>
            <p className="hero-sub fade-in">
              The chain-abstracted checkout engine — the &ldquo;Stripe of Web3.&rdquo;
              Integrate in minutes. Let buyers pay with any asset on any chain. You receive USDC on Arbitrum.
            </p>

            {/* Feature chips */}
            <div className="feature-chips stagger-in">
              {[
                { icon: '-', label: 'EIP-7702 Universal Account' },
                { icon: '-', label: 'Cross-chain payments' },
                { icon: '-', label: 'Magic embedded wallet' },
                { icon: '-', label: 'Arbitrum settlement' },
              ].map((f) => (
                <div key={f.label} className="feature-chip glass-card">
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>

            {/* B2B / B2C CTAs */}
            <div className="hero-ctas fade-in" style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/demo" style={{
                padding: '16px 28px', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                borderRadius: '12px', color: '#fff', fontWeight: 600, textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                 Try Demo
              </Link>
              <Link href="/dashboard" style={{
                padding: '16px 28px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', color: '#fff', fontWeight: 600, textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s'
              }}>
                Sign In
              </Link>
            </div>
          </div>

          {/* Integration Visual */}
          <div className="hero-visual fade-in" style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px',
            display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontFamily: 'monospace' }}>POST /api/sessions</div>
              <div style={{ color: '#fff', fontSize: '14px', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {`{
  "item": "hackathon-ticket",
  "successUrl": "https://yoursite.com/success"
}`}
              </div>
            </div>
            <div style={{ textAlign: 'center', color: '#7c3aed' }}>↓</div>
            <div style={{ padding: '16px', background: 'rgba(124,58,237,0.15)', borderRadius: '12px', border: '1px solid rgba(124,58,237,0.3)', color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
              Redirect buyer to UniCard
            </div>
          </div>
        </section>

        {/* How it works — buyer flow */}
        <section className="how-section">
          <h2 className="section-title gradient-text">How it works — for buyers</h2>
          <div className="steps-grid stagger-in">
            {[
              { step: '01', title: 'Login with Email', desc: 'One-click via Magic. No MetaMask. No seed phrase. Your embedded wallet is ready instantly.' },
              { step: '02', title: 'Universal Account', desc: 'EIP-7702 transforms your EOA into a cross-chain powerhouse — happens automatically.' },
              { step: '03', title: 'Pay from Anywhere', desc: 'USDC on Base, USDT on Polygon — funds route automatically. No bridging, ever.' },
              { step: '04', title: 'Receive Your Pass', desc: 'Payment settles on Arbitrum. Your pass is minted on-chain with QR code + Arbiscan proof.' },
            ].map((s) => (
              <div key={s.step} className="step-card glass-card">
                <div className="step-number">{s.step}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For Sellers — how the checkout layer works */}
        <section className="seller-section">
          <div className="seller-header">
            <span className="seller-pill">For Sellers &amp; Organizers</span>
            <h2 className="section-title gradient-text">The Stripe Checkout of Web3</h2>
            <p className="seller-sub">
              Integrate UniCard in minutes. Your buyers pay with any asset on any chain.
              You receive USDC on Arbitrum with full on-chain proof.
            </p>
          </div>

          <div className="seller-flow">
            {[
              {
                num: '1',
                title: 'List your item',
                desc: 'Add your event, membership, or digital product — we give you a shareable UniCard checkout URL.',
              },
              {
                num: '2',
                title: 'Buyer clicks your link',
                desc: 'They land on our checkout page pre-loaded with your item. We handle login, wallet creation, and payment.',
              },
              {
                num: '3',
                title: 'They pay from any chain',
                desc: 'USDC on Base, ETH on Mainnet, USDT on Polygon — Particle Universal Accounts route and settle automatically.',
              },
              {
                num: '4',
                title: 'You get USDC + on-chain proof',
                desc: 'Settlement arrives on Arbitrum One. Buyer gets a verifiable pass. You get an Arbiscan receipt.',
              },
            ].map((step, i) => (
              <div key={step.num} className="seller-step">
                <div className="seller-step-icon gradient-border">
                  {step.num}
                </div>
                {i < 3 && <div className="seller-connector" />}
                <h4 className="seller-step-title">{step.title}</h4>
                <p className="seller-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        /* ── Landing ── */
        .landing-root {
          min-height: 100vh;
        }
        /* Hero */
        .hero-section {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          align-items: center;
          max-width: 1100px;
          margin: 0 auto;
          padding: 5rem 2rem 3rem;
        }
        @media (max-width: 768px) {
          .hero-section {
            grid-template-columns: 1fr;
            padding: 3rem 1.25rem 2rem;
          }
          .hero-visual { order: 2; margin-top: 2rem; }
        }
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .hero-sub {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 480px;
        }
        .feature-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .feature-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        /* How it works */
        .how-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        .section-title {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .section-sub {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .steps-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 540px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }
        }
        .step-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .step-number {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--color-primary-light);
          letter-spacing: 0.1em;
        }
        .step-title {
          font-size: 0.9375rem;
          font-weight: 700;
        }
        .step-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        /* ── Seller section ── */
        .seller-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 1rem 2rem 4rem;
        }
        .seller-header {
          margin-bottom: 2.5rem;
        }
        .seller-pill {
          display: inline-block;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--color-accent-light);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .seller-sub {
          color: var(--text-secondary);
          font-size: 0.9375rem;
          line-height: 1.6;
          max-width: 560px;
          margin-bottom: 0;
        }
        .seller-flow {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          position: relative;
          margin-bottom: 2rem;
        }
        @media (max-width: 900px) {
          .seller-flow {
            grid-template-columns: 1fr 1fr;
          }
          .seller-connector { display: none; }
        }
        @media (max-width: 540px) {
          .seller-flow { grid-template-columns: 1fr; }
        }
        .seller-step {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
        }
        .seller-step-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary-light);
          font-weight: bold;
          font-size: 1.25rem;
        }
        .seller-connector {
          position: absolute;
          top: 24px;
          right: -0.75rem;
          width: 1.5rem;
          height: 1px;
          background: var(--glass-border);
          z-index: 0;
        }
        .seller-step-title {
          font-size: 0.9375rem;
          font-weight: 700;
        }
        .seller-step-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}
