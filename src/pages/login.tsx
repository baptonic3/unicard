import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useMagic } from '@/hooks/MagicProvider';
import { getUserAddress, saveUserInfo } from '@/utils/common';

export default function LoginPage() {
  const router = useRouter();
  const { magic, token, setToken } = useMagic();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    if (token && getUserAddress()) {
      router.replace(getNext());
    }
  }, [mounted, router.isReady, token]);

  if (!mounted) return null;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !magic) return;
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
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
              Welcome back
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
                  disabled={isLoading}
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
                disabled={isLoading || !email}
                style={{
                  width: '100%', padding: '14px',
                  background: isLoading || !email
                    ? '#e2e8f0'
                    : 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                  color: isLoading || !email ? '#94a3b8' : '#fff',
                  border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                  cursor: isLoading || !email ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                  marginTop: 4,
                }}
              >
                {isLoading ? (
                  <>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Sending code…
                  </>
                ) : 'Continue with Email →'}
              </button>
            </form>

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
