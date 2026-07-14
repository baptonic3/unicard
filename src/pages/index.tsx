import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import CtaBanner from '../components/landing/CtaBanner';
import Faq from '../components/landing/Faq';
import Footer from '../components/landing/Footer';
import Hero from '../components/landing/Hero';
import Nav from '../components/landing/Nav';
import Steps from '../components/landing/Steps';
import { Persona } from '../components/landing/content';

export default function Home() {
  const router = useRouter();
  const [persona, setPersona] = useState<Persona>('personal');

  // read ?for=business deep link once the router is ready
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.for === 'business') setPersona('business');
  }, [router.isReady, router.query.for]);

  const handlePersonaChange = useCallback(
    (p: Persona) => {
      setPersona(p);
      const query = p === 'business' ? { for: 'business' } : {};
      router.replace({ pathname: '/', query }, undefined, { shallow: true });
    },
    [router]
  );

  return (
    <>
      <Head>
        <title>UniCard | Universal Crypto Checkout</title>
        <meta
          name="description"
          content="Pay for anything with any token — UniCard handles cross-chain routing automatically. Businesses accept any asset on any chain and settle in USDC on Arbitrum."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="UniCard | Universal Crypto Checkout" />
        <meta
          property="og:description"
          content="One balance, every chain. The chain-abstracted wallet and checkout engine."
        />
        <meta property="og:type" content="website" />
      </Head>

      <div className="lp">
        <Nav />
        <main>
          <Hero persona={persona} onPersonaChange={handlePersonaChange} />
          <Steps persona={persona} />
          <Faq />
          <CtaBanner />
        </main>
        <Footer />
      </div>

      <style jsx global>{`
        body {
          background: #ffffff;
        }
        .lp {
          /* LP design tokens (scoped — globals.css keeps the dark app theme) */
          --lp-bg: #ffffff;
          --lp-fg: #0e0e0e;
          --lp-muted: #71717a;
          --lp-muted-bg: #f4f4f5;
          --lp-border: #e4e4e7;
          --lp-mint: #00f3ab;
          --lp-ink: #062018;
          --lp-beige: #f7f6f4;
          --lp-beige-border: #eceae4;
          --lp-warm-border: #e0dfd9;
          --lp-mono: 'Geist Mono', 'Fira Code', monospace;
          --lp-dark-gradient: linear-gradient(135deg, #081712 0%, #0e0e0e 55%, #053b2b 100%);

          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: var(--lp-bg);
          color: var(--lp-fg);
          min-height: 100vh;
        }

        /* shared buttons */
        .lp .lp-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 10px;
          border: 1px solid transparent;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .lp .lp-btn:hover {
          transform: translateY(-1px);
        }
        .lp .lp-btn-primary {
          background: var(--lp-mint);
          color: var(--lp-ink);
        }
        .lp .lp-btn-primary:hover {
          box-shadow: 0 6px 18px rgba(0, 243, 171, 0.35);
        }
        .lp .lp-btn-outline {
          background: #fff;
          color: var(--lp-fg);
          border-color: var(--lp-border);
        }
        .lp .lp-btn-ghost {
          background: transparent;
          color: #fff;
          border-color: rgba(255, 255, 255, 0.3);
        }

        html {
          scroll-behavior: smooth;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp .lp-btn {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
