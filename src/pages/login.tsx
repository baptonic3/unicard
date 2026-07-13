import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
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
        background: '#fff', color: '#111',
      }}>
        {/* ── Left: Branding ── */}
        <div style={{
          flex: '0 0 480px', background: 'linear-gradient(160deg, #0f0a1e 0%, #111827 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '64px 56px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Background glow */}
          <div style={{ position: 'absolute', top: -80, left: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(124,58,237,0.18)', filter: 'blur(90px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(6,182,212,0.12)', filter: 'blur(70px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Logo */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>UniCard</span>
            </div>

            <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.03em' }}>
              Your Universal<br />Crypto Wallet
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, marginBottom: 48 }}>
              Pay for anything with any token — UniCard handles cross-chain routing automatically.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon: '⚡', label: 'Magic Email Login', sub: 'No seed phrase, no extension needed' },
                { icon: '🌐', label: 'Cross-chain payments', sub: 'Pay with USDC on any chain' },
                { icon: '🔒', label: 'EIP-7702 Smart Account', sub: 'Full smart account, standard EOA' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ fontSize: 22, lineHeight: 1, width: 32, flexShrink: 0, paddingTop: 1 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#f1f5f9' }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ position: 'absolute', bottom: 28, left: 56, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ color: '#374151', fontSize: 11 }}>Powered by</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>UniCard</span>
            <span style={{ color: '#374151', fontSize: 11 }}>× Particle × Magic</span>
          </div>
        </div>

        {/* ── Right: OTP Form ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '48px 40px', background: '#fff',
        }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8, color: '#0f172a' }}>
              Get Started
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 36, lineHeight: 1.6 }}>
              Enter your email to sign in or create your account.
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
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
                    width: '100%', padding: '13px 16px', fontSize: 15,
                    border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
                    borderRadius: 12, outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box', color: '#111', background: '#fafafa',
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
                  width: '100%', padding: '14px',
                  background: !!loadingProvider || !email
                    ? '#e2e8f0'
                    : 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                  color: !!loadingProvider || !email ? '#94a3b8' : '#fff',
                  border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                  cursor: !!loadingProvider || !email ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                  marginTop: 4,
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
              {/* <SocialButton provider="apple" label="Apple" icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#111"><path d="M17.05 20.28c-.98.95-2.05 1.8-3.08 1.8-1.09 0-1.44-.65-2.67-.65-1.2 0-1.58.65-2.65.65-1.09 0-2.22-.91-3.23-1.98C3.12 17.65 1.06 13.06 3.4 9.9c1.16-1.57 2.87-2.58 4.74-2.58 1.19 0 2.29.58 2.92.58.61 0 1.94-.74 3.34-.74 1.79 0 3.27.76 4.14 1.94-3.66 1.91-3.09 7.07.45 8.43-.88 1.4-1.94 1.75-2.05 2.75h-.01zM15.11 3.93c-1.12.02-2.31.57-3.07 1.34-.69.7-1.24 1.72-1.09 2.71 1.22.06 2.37-.52 3.12-1.32.72-.75 1.22-1.8 1.04-2.73z"/></svg>
              } /> */}
              <SocialButton provider="twitter" label="" icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              } />
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                Powered by <strong style={{ color: '#7c3aed' }}>Magic</strong> × <strong style={{ color: '#06b6d4' }}>Particle Network</strong>
              </p>
              <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>Non-custodial · Your keys, your account.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        #email-input:focus { border-color: #7c3aed !important; background: #fff !important; }
      `}</style>
    </>
  );
}
