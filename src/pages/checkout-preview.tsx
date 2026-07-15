import Head from 'next/head';
import { useEffect, useState } from 'react';
import SignInModal from '../components/checkout/SignInModal';
import SignInScreen from '../components/checkout/SignInScreen';

/**
 * Visual preview of the logged-out checkout: a dimmed wallet behind a scrim
 * with the sign-in-to-purchase modal. Standalone route for design review.
 */
export default function CheckoutPreview() {
  const [expired, setExpired] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | undefined>(undefined);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('state') === 'expired') {
      setExpired(true);
      return;
    }
    // Countdown starts at 25 min; override with ?seconds=N to watch it expire.
    const seconds = Number(params.get('seconds')) || 25 * 60;
    setExpiresAt(Date.now() + seconds * 1000);
  }, []);
  return (
    <>
      <Head>
        <title>UniCard · Sign in to complete your purchase</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <SignInScreen>
        <SignInModal
          expired={expired}
          expiresAt={expiresAt}
          itemTitle="Onchain Rooftop — Builders’ Mixer"
          itemDescription="An evening for onchain builders — talks, demos, and rooftop drinks. Wed, Jul 22 · StartDock Coworking, Amsterdam."
          total="$5.20"
          eventUrl="/demo"
        />
      </SignInScreen>

      <style jsx global>{`
        body {
          background: #fafafa;
        }
      `}</style>
    </>
  );
}
