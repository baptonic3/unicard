import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useMagic } from '@/hooks/MagicProvider';
import { getUserAddress, saveUserInfo } from '@/utils/common';
import Logo from '@/components/landing/Logo';

const FEATURES = [
  { title: 'Magic Email Login', sub: 'No seed phrase, no extension needed' },
  { title: 'Cross-chain payments', sub: 'Pay with USDC on any chain' },
  { title: 'EIP-7702 Smart Account', sub: 'Full smart account, standard EOA' },
];

export default function LoginPage() {
  const router = useRouter();
  const { magic, token, setToken } = useMagic();
  const [email, setEmail] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<'email' | 'google' | 'apple' | 'twitter' | 'callback' | null>(null);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  // ─── CRITICAL: router.query is empty until router.isReady ───
  // Must wait for isReady before reading ?next= param
  const getNext = () => {
    if (!router.isReady) return '/dashboard';
    if (typeof router.query.next !== 'string') return '/dashboard';
    const n = router.query.next;
    return n.startsWith('/') ? n : '/dashboard';
  };

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-redirect if already logged in — wait for router.isReady first
  useEffect(() => {
    if (!mounted || !router.isReady) return;

    // Check if we're returning from an OAuth redirect first
    const search = window.location.search;
    if (search.includes('magic_credential=') || search.includes('state=')) {
      return; // Skip normal auth auto-redirect, let the OAuth handler below process it
    }

    if (token && getUserAddress()) {
      router.replace(getNext());
    }
  }, [mounted, router.isReady, token]);

  // Handle OAuth callback
  useEffect(() => {
    if (!magic || !router.isReady) return;
    const finishOAuth = async () => {
      const search = window.location.search;
      if (search.includes('magic_credential=') || search.includes('state=')) {
        try {
          setLoadingProvider('callback');
          const result = await magic.oauth2.getRedirectResult();
          const didToken = result.magic.idToken;

          // In Magic SDK v33+, get public address via getInfo() or fallback to the metadata cast
          let publicAddress = (result.magic.userMetadata as any).publicAddress;
          try {
            const metadata = await magic.user.getInfo();
            publicAddress = metadata?.wallets?.ethereum?.publicAddress || publicAddress;
          } catch (e) {
            // ignore
          }

          if (didToken && publicAddress) {
            setToken(didToken);
            saveUserInfo(didToken, result.oauth.provider.toUpperCase(), publicAddress);
            const nextUrl = sessionStorage.getItem('magic_oauth_next') || '/dashboard';
            sessionStorage.removeItem('magic_oauth_next');
            router.replace(nextUrl);
          }
        } catch (err) {
          console.error('OAuth callback error:', err);
          setError('Social login failed. Please try again.');
          setLoadingProvider(null);
        }
      }
    };
    finishOAuth();
  }, [magic, router.isReady]);

  if (!mounted) return null;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !magic) return;
    try {
      setLoadingProvider('email');
      setError('');
      const didToken = await magic.auth.loginWithEmailOTP({ email });
      const metadata = await magic.user.getInfo();
      const publicAddress = metadata?.wallets?.ethereum?.publicAddress;
      if (!didToken || !publicAddress) throw new Error('Login failed');
      setToken(didToken);
      saveUserInfo(didToken, 'EMAIL', publicAddress);
      router.replace(getNext());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (!msg.includes('canceled')) setError('Login failed. Please try again.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'twitter') => {
    if (!magic) return;
    sessionStorage.setItem('magic_oauth_next', getNext());
    try {
      setLoadingProvider(provider);
      setError('');
      await magic.oauth2.loginWithRedirect({
        provider,
        redirectURI: new URL('/login', window.location.origin).href,
      });
    } catch (err) {
      console.error('Social login init error:', err);
      setLoadingProvider(null);
      setError(`Failed to connect to ${provider}.`);
    }
  };

  const busy = !!loadingProvider;

  return (
    <>
      <Head>
        <title>Sign in | UniCard</title>
        <meta name="description" content="Sign in to UniCard — your universal crypto wallet." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="au">
        <a href="/" className="au-logo" aria-label="UniCard home">
          <Logo height={32} />
        </a>

        <aside className="au-brand">
          <div className="au-brand-inner">
            <div className="au-brand-copy">
              <h2 className="au-brand-title">Your Universal Crypto Wallet</h2>
              <p className="au-brand-sub">
                Pay for anything with any token — UniCard handles cross-chain routing automatically.
              </p>
            </div>
            <ul className="au-features">
              {FEATURES.map((f) => (
                <li className="au-feature" key={f.title}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" fill="#0FA97D" />
                    <path d="M7.5 12.2l3 3 6-6.4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="au-feature-text">
                    <span className="au-feature-title">{f.title}</span>
                    <span className="au-feature-sub">{f.sub}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="au-form">
          <div className="au-head">
            <h1 className="au-title">Get started</h1>
            <p className="au-subtitle">
              Use your email to sign in or create your account — no wallet or seed phrase needed. UniCard creates one for you.
            </p>
          </div>

          <form onSubmit={handleLogin} className="au-field">
            <label htmlFor="email-input" className="au-label">Email address</label>
            <div className="au-input">
              <input
                id="email-input"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={email}
                disabled={busy}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                autoFocus
              />
            </div>

            {error && (
              <p className="au-error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 7.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
                {error}
              </p>
            )}

            <button type="submit" className="au-primary" disabled={busy || !email}>
              {loadingProvider === 'email' ? (
                <><span className="au-spinner" aria-hidden="true" /> Sending code…</>
              ) : loadingProvider === 'callback' ? (
                <><span className="au-spinner" aria-hidden="true" /> Signing in…</>
              ) : (
                'Continue with Email →'
              )}
            </button>
          </form>

          <div className="au-or">
            <span className="au-or-line" />
            <span className="au-or-text">or</span>
            <span className="au-or-line" />
          </div>

          <button
            type="button"
            className="au-social"
            onClick={() => handleSocialLogin('google')}
            disabled={busy}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <div className="au-footer">
            <p className="au-powered">Powered by Magic × Particle Network</p>
            <p className="au-note">Non-custodial · Your keys, your account.</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body { background: #ffffff; }
      `}</style>

      <style jsx>{`
        .au {
          display: grid;
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #0e0e0e;
          grid-template-columns: minmax(0, 1fr) 498px;
          grid-template-rows: 1fr auto auto 1fr;
          grid-template-areas:
            '.    brand'
            'logo brand'
            'form brand'
            '.    brand';
          column-gap: 0;
        }
        .au-logo { grid-area: logo; justify-self: center; align-self: end; display: inline-flex; padding-bottom: 24px; }
        .au-form {
          grid-area: form;
          justify-self: center;
          align-self: start;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 400px;
          padding: 0 24px;
          gap: 20px;
        }
        .au-head { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .au-title { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.015em; color: #0e0e0e; }
        .au-subtitle { margin: 0; font-size: 14px; line-height: 1.5; text-align: center; color: #71717a; }
        .au-field { display: flex; flex-direction: column; gap: 12px; width: 100%; }
        .au-label { font-size: 13px; font-weight: 600; color: #0e0e0e; }
        .au-input {
          display: flex; align-items: center; height: 50px; padding: 0 16px;
          background: #fff; border: 1.5px solid #e4e4e7; border-radius: 12px;
          transition: border-color 0.15s ease;
        }
        .au-input:focus-within { border-color: #00f3ab; }
        .au-input input {
          width: 100%; border: none; outline: none; background: transparent;
          font-family: inherit; font-size: 15px; color: #0e0e0e;
        }
        .au-input input::placeholder { color: #a1a1ab; }
        .au-error { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 12.5px; color: #e5484d; }
        .au-primary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          height: 50px; width: 100%; border: none; border-radius: 12px;
          background: #00f3ab; font-family: inherit; font-size: 15px; font-weight: 600;
          color: #062018; cursor: pointer; transition: filter 0.15s ease;
        }
        .au-primary:hover:not(:disabled) { filter: brightness(0.96); }
        .au-primary:disabled { background: #e4e4e7; color: #a1a1aa; cursor: not-allowed; }
        .au-or { display: flex; align-items: center; gap: 12px; width: 100%; }
        .au-or-line { flex: 1; height: 1px; background: #e4e4e7; }
        .au-or-text { font-size: 13px; font-weight: 500; color: #71717a; }
        .au-social {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          height: 48px; width: 100%; background: #fff; border: 1px solid #e4e4e7; border-radius: 12px;
          font-family: inherit; font-size: 14px; font-weight: 600; color: #0e0e0e;
          cursor: pointer; transition: background 0.15s ease;
        }
        .au-social:hover:not(:disabled) { background: #fafafa; }
        .au-social:disabled { opacity: 0.6; cursor: not-allowed; }
        .au-footer { display: flex; flex-direction: column; align-items: center; gap: 4px; margin-top: 8px; }
        .au-powered { margin: 0; font-size: 12px; font-weight: 600; color: #0fa97d; text-align: center; }
        .au-note { margin: 0; font-size: 11px; color: #71717a; text-align: center; }
        .au-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(6, 32, 24, 0.25);
          border-top-color: #062018; border-radius: 50%; animation: au-spin 0.7s linear infinite;
        }
        @keyframes au-spin { to { transform: rotate(360deg); } }

        /* Brand panel — beige card on the right */
        .au-brand { grid-area: brand; display: flex; padding: 28px 28px 28px 0; }
        .au-brand-inner {
          display: flex; flex-direction: column; justify-content: center; width: 100%;
          padding: 40px 56px; background: #f7f6f4; border: 1px solid #e8e8e8;
          border-radius: 20px; box-shadow: 0 12px 32px -8px rgba(51, 46, 36, 0.06);
        }
        .au-brand-copy { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        .au-brand-title { margin: 0; font-size: 21px; font-weight: 700; line-height: 1.3; letter-spacing: -0.02em; color: #0e0e0e; }
        .au-brand-sub { margin: 0; font-size: 14px; line-height: 1.55; color: #474d52; max-width: 340px; }
        .au-features { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
        .au-feature { display: flex; align-items: flex-start; gap: 12px; }
        .au-feature svg { flex-shrink: 0; margin-top: 1px; }
        .au-feature-text { display: flex; flex-direction: column; gap: 2px; }
        .au-feature-title { font-size: 14px; font-weight: 600; color: #0e0e0e; }
        .au-feature-sub { font-size: 13px; color: #596166; }

        /* Mobile: single column — logo, beige card, form */
        @media (max-width: 900px) {
          .au {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 24px;
          }
          .au-logo { align-self: center; padding-bottom: 0; margin-bottom: 28px; }
          .au-brand { width: 100%; max-width: 400px; padding: 0; margin-bottom: 28px; }
          .au-brand-inner { padding: 24px; }
          .au-brand-sub { max-width: none; }
          .au-form { padding: 0; max-width: 400px; }
        }
      `}</style>
    </>
  );
}
