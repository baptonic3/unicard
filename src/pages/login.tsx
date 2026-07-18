import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useMagic } from '@/hooks/MagicProvider';
import { getUserAddress, saveUserInfo } from '@/utils/common';

export default function LoginPage() {
  const router = useRouter();
  const { magic, token, setToken } = useMagic();
  const [email, setEmail] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<'email'|'google'|'apple'|'twitter'|'callback'|null>(null);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  // router.query is empty until router.isReady
  // Must wait for isReady before reading ?next= param
  const getNext = () => {
    if (!router.isReady) return '/dashboard';
    if (typeof router.query.next === 'string' && router.query.next.startsWith('/')) {
      return router.query.next;
    }
    const pendingCheckout = window.localStorage.getItem('pending_checkout');
    if (pendingCheckout && pendingCheckout.startsWith('/checkout/')) {
      return pendingCheckout;
    }
    const stored = window.localStorage.getItem('magic_oauth_next');
    if (stored && stored.startsWith('/')) {
      return stored;
    }
    return '/dashboard';
  };

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-redirect if already logged in — wait for router.isReady first
  useEffect(() => {
    if (!mounted || !router.isReady) return;
    
    // Check if returning from an OAuth redirect first
    const search = window.location.search;
    if (search.includes('magic_credential=') || search.includes('state=')) {
      return; // Skip normal auth auto-redirect, let the OAuth handler below process it
    }

    if (token && getUserAddress()) {
      const nextUrl = getNext();
      window.localStorage.removeItem('magic_oauth_next');
      if (nextUrl.startsWith('/checkout/')) {
        window.localStorage.removeItem('pending_checkout');
      }
      router.replace(nextUrl);
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
            // The auto-redirect useEffect will pick up the token update and handle navigation deterministically
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
      const nextUrl = getNext();
      window.localStorage.removeItem('magic_oauth_next');
      if (nextUrl.startsWith('/checkout/')) {
        window.localStorage.removeItem('pending_checkout');
      }
      router.replace(nextUrl);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (!msg.includes('canceled')) setError('Login failed. Please try again.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'twitter') => {
    if (!magic) return;
    const nextTarget = getNext();
    window.localStorage.setItem('magic_oauth_next', nextTarget);

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

  const SocialButton = ({ provider, icon, label }: { provider: 'google'|'apple'|'twitter', icon: React.ReactNode, label: string }) => {
    const isThisLoading = loadingProvider === provider;
    return (
      <button
        type="button"
        onClick={() => handleSocialLogin(provider)}
        disabled={!!loadingProvider}
        style={{
          flex: 1, padding: '12px', background: '#fff',
          border: '1px solid #e2e8f0', borderRadius: 12,
          cursor: loadingProvider ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 14, fontWeight: 600, color: '#334155',
          transition: 'all 0.2s',
          opacity: loadingProvider ? 0.6 : 1
        }}
        onMouseOver={(e) => loadingProvider ? null : (e.currentTarget.style.border = '1px solid #cbd5e1', e.currentTarget.style.background = '#f8fafc')}
        onMouseOut={(e) => loadingProvider ? null : (e.currentTarget.style.border = '1px solid #e2e8f0', e.currentTarget.style.background = '#fff')}
      >
        {isThisLoading ? (
            <span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.1)', borderTop: '2px solid #334155', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
        ) : icon} 
        {label}
      </button>
    );
  };

  return (
    <>
      <Head>
        <title>Sign in | UniCard</title>
        <meta name="description" content="Sign in to UniCard — your universal crypto wallet." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif',
        background: '#FBFBFB', color: '#111',
      }}>
        {/* ── Left: OTP Form ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '48px 40px', background: '#fff',
        }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 36, cursor: 'pointer' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_121_1303)"><path d="M26.1053 0H5.89474C2.63917 0 0 2.63917 0 5.89474V26.1053C0 29.3608 2.63917 32 5.89474 32H26.1053C29.3608 32 32 29.3608 32 26.1053V5.89474C32 2.63917 29.3608 0 26.1053 0Z" fill="#00F3AB"/><path d="M8.4209 8.42114H13.1204V12.6468C13.1204 17.9358 16.7876 18.9444 18.3903 18.9444C20.5853 18.8136 22.7639 19.8713 23.5788 20.4166L18.3903 23.579C11.409 23.4427 8.4209 17.7448 8.4209 13.7918V8.42114Z" fill="#010101"/><path d="M23.5517 8.42114H18.3633V18.9717C22.5792 18.6882 23.5789 15.3458 23.5517 13.7101V8.42114Z" fill="#010101"/></g><defs><clipPath id="clip0_121_1303"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>UniCard</span>
            </Link>

            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 8, color: '#0f172a' }}>
                Get started
              </h2>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                Use your email to sign in or create your account — no wallet or seed phrase needed. UniCard creates one for you.
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                  Email address
                </label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  disabled={!!loadingProvider}
                  autoFocus
                  style={{
                    width: '100%', padding: '14px 16px', fontSize: 15,
                    border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
                    borderRadius: 12, outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box', color: '#111', background: '#fff',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>

              {error && (
                <p style={{ color: '#ef4444', fontSize: 13, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>⚠</span> {error}
                </p>
              )}

              <button
                id="login-btn"
                type="submit"
                disabled={!!loadingProvider || !email}
                style={{
                  width: '100%', padding: '15px',
                  background: !!loadingProvider || !email ? '#f1f5f9' : '#00F3AB',
                  color: !!loadingProvider || !email ? '#94a3b8' : '#062018',
                  border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 550,
                  cursor: !!loadingProvider || !email ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                  marginTop: 6,
                }}
              >
                {loadingProvider === 'email' ? (
                  <>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Sending code…
                  </>
                ) : loadingProvider === 'callback' ? (
                  <>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Signing in…
                  </>
                ) : 'Continue with Email →'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#f1f5f9' }}></div>
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#f1f5f9' }}></div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <SocialButton provider="google" label="Google" icon={
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
              } />
              <SocialButton provider="twitter" label="" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              } />
            </div>

            <div style={{ marginTop: 40, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                Powered by <strong style={{ color: '#10b981' }}>Magic</strong> × <strong style={{ color: '#10b981' }}>Particle Network</strong>
              </p>
              <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 6 }}>Non-custodial · Your keys, your account.</p>
            </div>
          </div>
        </div>

        {/* ── Right: Promo ── */}
        <div style={{
          flex: '0 0 520px', display: 'flex', flexDirection: 'column',
          padding: '24px 24px 24px 0', background: '#fff',
        }}>
          <div style={{
            background: '#F7F6F4', borderRadius: 32, flex: 1, padding: '64px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.03em' }}>
              Your Universal Crypto Wallet
            </h1>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 48 }}>
              Pay for anything with any token — UniCard handles cross-chain routing automatically.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { label: 'Magic Email Login', sub: 'No seed phrase, no extension needed' },
                { label: 'Cross-chain payments', sub: 'Pay with USDC on any chain' },
                { label: 'EIP-7702 Smart Account', sub: 'Full smart account, standard EOA' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ flexShrink: 0, paddingTop: 2 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#00e599" />
                      <path d="M7 12.5L10 15.5L17 8.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{f.label}</div>
                    <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        #email-input:focus { border-color: #00e599 !important; background: #fff !important; }
      `}</style>
    </>
  );
}
