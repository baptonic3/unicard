import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>UniCard | Universal Crypto Checkout</title>
        <meta
          name="description"
          content="The chain-abstracted checkout engine. Businesses accept any token on any chain and settle in USDC on Arbitrum."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="landing-root">
        {/* Soft Light Background Elements */}
        <div className="bg-pattern" />
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />

        {/* Header / Navbar */}
        <header className="navbar">
          <div className="logo fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            UniCard
          </div>
          <div className="nav-links fade-in" style={{ animationDelay: '0.1s' }}>
            <Link href="/login" className="nav-link">Login</Link>
          </div>
        </header>

        <main className="main-content">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="pill-badge fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="pill-dot" /> B2B2C Checkout Infrastructure
            </div>
            <h1 className="hero-title fade-in" style={{ animationDelay: '0.3s' }}>
              Accept Any Token.<br />
              <span className="gradient-text">Verify Anywhere.</span><br />
              Settle on Arbitrum.
            </h1>
            <p className="hero-sub fade-in" style={{ animationDelay: '0.4s' }}>
              The frictionless checkout engine for Web3. Buyers pay with any assets spread across chains. Funds are securely routed to an Arbitrum Treasury.
            </p>

            {/* CTAs */}
            <div className="cta-group fade-in" style={{ animationDelay: '0.5s' }}>
              <Link href="/demo" className="btn-primary">
                Try Demo <span className="arrow">→</span>
              </Link>
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
            </div>
          </section>

          {/* Duality Section: Business vs Buyer */}
          <section className="duality-section fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="duality-card business-card">
              <div className="duality-header">
                <h3>For Businesses & Sellers</h3>
                <span className="badge">Stripe-like API</span>
              </div>
              <ul className="feature-list">
                <li><strong>Treasury Settlement:</strong> Don't worry about managing 10 different networks. Payments route seamlessly to our Arbitrum Treasury for future withdrawal.</li>
                <li><strong>API Integration:</strong> Simply call our <code>POST /api/sessions</code> endpoint from your backend with the checkout details.</li>
                <li><strong>Verified Analytics:</strong> Access a single dashboard to track all cross-chain customer purchases with verifiable on-chain proofs.</li>
              </ul>
            </div>

            <div className="duality-card buyer-card">
              <div className="duality-header">
                <h3>For Your Customers</h3>
                <span className="badge">Zero Friction</span>
              </div>
              <ul className="feature-list">
                <li><strong>Seamless Sign In:</strong> Fast authentication with Google, Apple, or Email. No tedious seed phrases required to get started.</li>
                <li><strong>No Manual Bridging:</strong> Buyers pay with assets spread across chains. The Particle SDK handles the complex cross-chain routing automatically.</li>
                <li><strong>Instant Utility:</strong> Complete the purchase and immediately unlock digital assets or event access, backed by the Universal Account.</li>
              </ul>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer fade-in" style={{ animationDelay: '0.8s' }}>
            <p>Powered by <strong>Particle Network</strong> & <strong>Magic</strong></p>
            <p className="footer-sub">Built for seamless Web3 Experience.</p>
          </footer>
        </main>
      </div>

      <style jsx global>{`
        :root {
          --bg-color: #fafafa;
          --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --color-accent-1: #7c3aed;
          --color-accent-2: #06b6d4;
          --border-color: #e2e8f0;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: var(--bg-color);
          color: var(--text-primary);
          font-family: var(--font-sans);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* Ambient Orbs & Background (Light Mode style) */
        .landing-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 0;
          mask-image: radial-gradient(ellipse at top, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at top, black 30%, transparent 80%);
          pointer-events: none;
          opacity: 0.5;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          z-index: 0;
          pointer-events: none;
        }
        .orb-1 { width: 500px; height: 500px; background: var(--color-accent-1); top: -200px; left: -100px; }
        .orb-2 { width: 400px; height: 400px; background: var(--color-accent-2); top: 20%; right: -150px; }

        /* Navbar */
        .navbar {
          width: 100%;
          max-width: 1200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          z-index: 10;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
        }

        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9375rem;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--color-accent-1);
        }

        /* Main Content */
        .main-content {
          width: 100%;
          max-width: 1200px;
          padding: 3rem 2rem 6rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        /* Hero */
        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 5rem;
          max-width: 800px;
        }

        .pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .pill-dot {
          width: 8px;
          height: 8px;
          background: var(--color-accent-2);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--color-accent-2);
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin: 0 0 1.5rem 0;
          color: #0f172a;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-sub {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          max-width: 650px;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        /* Buttons & CTAs */
        .cta-group {
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          padding: 0.875rem 2.25rem;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.25, 1.25, 0.5, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary {
          background: #0f172a;
          color: #fff;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
        }
        .btn-primary .arrow {
          transition: transform 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.3);
          background: #1e293b;
        }
        .btn-primary:hover .arrow {
          transform: translateX(4px);
        }
        .btn-primary:active {
          transform: translateY(0) scale(0.98);
        }

        .btn-secondary {
          background: #ffffff;
          color: #0f172a;
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .btn-secondary:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        }
        .btn-secondary:active {
          transform: translateY(0);
        }

        /* Visual Diagram Flow */
        .diagram-section {
          width: 100%;
          max-width: 900px;
          margin-bottom: 6rem;
        }
        .diagram-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 3rem 2rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
          position: relative;
        }
        
        @media (max-width: 768px) {
          .diagram-container {
            flex-direction: column;
            gap: 2rem;
          }
          .connector { transform: rotate(90deg); margin: -10px 0; }
        }

        .node {
          flex: 1;
          text-align: center;
          padding: 1.5rem;
          background: #fafafa;
          border: 1px solid var(--border-color);
          border-radius: 16px;
          z-index: 2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .node:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }
        .node-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }
        .node h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
        }
        .node p {
          margin: 0;
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.4;
        }
        
        .connector {
          display: flex;
          align-items: center;
          position: relative;
          width: 60px;
          justify-content: center;
          z-index: 1;
        }
        .connector-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: var(--border-color);
        }
        .connector-icon {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          position: relative;
          z-index: 3;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        
        .unicard-node {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 10px 30px rgba(124,58,237,0.08);
          transform: scale(1.05);
        }
        .unicard-node:hover {
          transform: scale(1.05) translateY(-4px);
        }

        /* Duality Section - B2B vs B2C */
        .duality-section {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .duality-card {
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .duality-card:hover {
          transform: translateY(-4px);
          border-color: #cbd5e1;
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }

        .business-card {
          border-top: 4px solid var(--color-accent-1);
        }
        .buyer-card {
          border-top: 4px solid var(--color-accent-2);
        }

        .duality-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
        }

        .duality-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
        }

        .badge {
          background: #f1f5f9;
          color: #475569;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .feature-list li {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .feature-list strong {
          color: #0f172a;
          display: block;
          margin-bottom: 4px;
        }

        /* Footer */
        .footer {
          margin-top: 6rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-align: center;
          border-top: 1px solid var(--border-color);
          padding-top: 2rem;
          width: 100%;
        }
        .footer strong {
          color: #0f172a;
        }
        .footer-sub {
          margin-top: 8px;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </>
  );
}
