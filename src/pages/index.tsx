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
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="142" height="38" viewBox="0 0 142 38" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: '32px', width: 'auto' }}>
                <path d="M31 0H7C3.13401 0 0 3.13401 0 7V31C0 34.866 3.13401 38 7 38H31C34.866 38 38 34.866 38 31V7C38 3.13401 34.866 0 31 0Z" fill="#00F3AB"/>
                <path d="M10 10H15.5806V15.018C15.5806 21.2986 19.9355 22.4964 21.8387 22.4964C24.4452 22.341 27.0323 23.5971 28 24.2446L21.8387 28C13.5484 27.8381 10 21.0719 10 16.3777V10Z" fill="#010101"/>
                <path d="M27.9677 10H21.8065V22.5288C26.8129 22.1921 28 18.223 27.9677 16.2806V10Z" fill="#010101"/>
                <path d="M58.8266 26.764C56.6413 26.764 54.9326 26.1553 53.7006 24.938C52.4686 23.7207 51.8526 21.9827 51.8526 19.724V11.1H55.4166V19.592C55.4166 21.0587 55.7173 22.1147 56.3186 22.76C56.92 23.4053 57.7633 23.728 58.8486 23.728C59.934 23.728 60.7773 23.4053 61.3786 22.76C61.98 22.1147 62.2806 21.0587 62.2806 19.592V11.1H65.8006V19.724C65.8006 21.9827 65.1846 23.7207 63.9526 24.938C62.7206 26.1553 61.012 26.764 58.8266 26.764ZM68.8385 26.5V14.664H72.1165V17.942L71.5005 16.952C71.9258 16.16 72.5345 15.5513 73.3265 15.126C74.1185 14.7007 75.0205 14.488 76.0325 14.488C76.9712 14.488 77.8072 14.6787 78.5405 15.06C79.2885 15.4267 79.8752 15.9987 80.3005 16.776C80.7258 17.5387 80.9385 18.5213 80.9385 19.724V26.5H77.5065V20.252C77.5065 19.2987 77.2938 18.5947 76.8685 18.14C76.4578 17.6853 75.8712 17.458 75.1085 17.458C74.5658 17.458 74.0745 17.5753 73.6345 17.81C73.2092 18.03 72.8718 18.3747 72.6225 18.844C72.3878 19.3133 72.2705 19.9147 72.2705 20.648V26.5H68.8385ZM83.8074 26.5V14.664H87.2394V26.5H83.8074ZM85.5234 13.014C84.8928 13.014 84.3794 12.8307 83.9834 12.464C83.5874 12.0973 83.3894 11.6427 83.3894 11.1C83.3894 10.5573 83.5874 10.1027 83.9834 9.736C84.3794 9.36933 84.8928 9.186 85.5234 9.186C86.1541 9.186 86.6674 9.362 87.0634 9.714C87.4594 10.0513 87.6574 10.4913 87.6574 11.034C87.6574 11.606 87.4594 12.0827 87.0634 12.464C86.6821 12.8307 86.1688 13.014 85.5234 13.014ZM97.7946 26.764C96.6066 26.764 95.4993 26.5733 94.4726 26.192C93.4606 25.796 92.5806 25.2387 91.8326 24.52C91.0846 23.8013 90.498 22.958 90.0726 21.99C89.662 21.022 89.4566 19.9587 89.4566 18.8C89.4566 17.6413 89.662 16.578 90.0726 15.61C90.498 14.642 91.0846 13.7987 91.8326 13.08C92.5953 12.3613 93.4826 11.8113 94.4946 11.43C95.5066 11.034 96.614 10.836 97.8166 10.836C99.1513 10.836 100.354 11.0707 101.425 11.54C102.51 11.9947 103.419 12.6693 104.153 13.564L101.865 15.676C101.337 15.0747 100.75 14.6273 100.105 14.334C99.4593 14.026 98.7553 13.872 97.9926 13.872C97.274 13.872 96.614 13.9893 96.0126 14.224C95.4113 14.4587 94.8906 14.796 94.4506 15.236C94.0106 15.676 93.666 16.1967 93.4166 16.798C93.182 17.3993 93.0646 18.0667 93.0646 18.8C93.0646 19.5333 93.182 20.2007 93.4166 20.802C93.666 21.4033 94.0106 21.924 94.4506 22.364C94.8906 22.804 95.4113 23.1413 96.0126 23.376C96.614 23.6107 97.274 23.728 97.9926 23.728C98.7553 23.728 99.4593 23.5813 100.105 23.288C100.75 22.98 101.337 22.518 101.865 21.902L104.153 24.014C103.419 24.9087 102.51 25.5907 101.425 26.06C100.354 26.5293 99.144 26.764 97.7946 26.764ZM113.056 26.5V24.19L112.836 23.684V19.548C112.836 18.8147 112.609 18.2427 112.154 17.832C111.714 17.4213 111.032 17.216 110.108 17.216C109.477 17.216 108.854 17.3187 108.238 17.524C107.637 17.7147 107.123 17.9787 106.698 18.316L105.466 15.918C106.111 15.4633 106.889 15.1113 107.798 14.862C108.707 14.6127 109.631 14.488 110.57 14.488C112.374 14.488 113.775 14.9133 114.772 15.764C115.769 16.6147 116.268 17.942 116.268 19.746V26.5H113.056ZM109.448 26.676C108.524 26.676 107.732 26.522 107.072 26.214C106.412 25.8913 105.906 25.4587 105.554 24.916C105.202 24.3733 105.026 23.7647 105.026 23.09C105.026 22.386 105.195 21.77 105.532 21.242C105.884 20.714 106.434 20.3033 107.182 20.01C107.93 19.702 108.905 19.548 110.108 19.548H113.254V21.55H110.482C109.675 21.55 109.118 21.682 108.81 21.946C108.517 22.21 108.37 22.54 108.37 22.936C108.37 23.376 108.539 23.728 108.876 23.992C109.228 24.2413 109.705 24.366 110.306 24.366C110.878 24.366 111.391 24.234 111.846 23.97C112.301 23.6913 112.631 23.288 112.836 22.76L113.364 24.344C113.115 25.1067 112.66 25.686 112 26.082C111.34 26.478 110.489 26.676 109.448 26.676ZM119.132 26.5V14.664H122.41V18.008L121.948 17.04C122.3 16.204 122.865 15.5733 123.642 15.148C124.42 14.708 125.366 14.488 126.48 14.488V17.656C126.334 17.6413 126.202 17.634 126.084 17.634C125.967 17.6193 125.842 17.612 125.71 17.612C124.772 17.612 124.009 17.8833 123.422 18.426C122.85 18.954 122.564 19.7827 122.564 20.912V26.5H119.132ZM133.275 26.676C132.16 26.676 131.156 26.4267 130.261 25.928C129.366 25.4147 128.655 24.7033 128.127 23.794C127.614 22.8847 127.357 21.814 127.357 20.582C127.357 19.3353 127.614 18.2573 128.127 17.348C128.655 16.4387 129.366 15.7347 130.261 15.236C131.156 14.7373 132.16 14.488 133.275 14.488C134.272 14.488 135.145 14.708 135.893 15.148C136.641 15.588 137.22 16.2553 137.631 17.15C138.042 18.0447 138.247 19.1887 138.247 20.582C138.247 21.9607 138.049 23.1047 137.653 24.014C137.257 24.9087 136.685 25.576 135.937 26.016C135.204 26.456 134.316 26.676 133.275 26.676ZM133.869 23.86C134.426 23.86 134.932 23.728 135.387 23.464C135.842 23.2 136.201 22.826 136.465 22.342C136.744 21.8433 136.883 21.2567 136.883 20.582C136.883 19.8927 136.744 19.306 136.465 18.822C136.201 18.338 135.842 17.964 135.387 17.7C134.932 17.436 134.426 17.304 133.869 17.304C133.297 17.304 132.784 17.436 132.329 17.7C131.874 17.964 131.508 18.338 131.229 18.822C130.965 19.306 130.833 19.8927 130.833 20.582C130.833 21.2567 130.965 21.8433 131.229 22.342C131.508 22.826 131.874 23.2 132.329 23.464C132.784 23.728 133.297 23.86 133.869 23.86ZM136.971 26.5V24.08L137.037 20.56L136.817 17.062V10.176H140.249V26.5H136.971Z" fill="#0E0E0E"/>
              </svg>
            </Link>
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
