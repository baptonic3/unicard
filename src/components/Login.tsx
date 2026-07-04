import { useMagic } from '@/hooks/MagicProvider';
import { saveUserInfo } from '@/utils/common';
import { MagicRPCError, RPCErrorCode } from 'magic-sdk';
import { useState, FormEvent } from 'react';

interface LoginProps {
  token: string;
  setToken: (token: string) => void;
}

const Login = ({ token, setToken }: LoginProps) => {
  const { magic } = useMagic();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setEmailError(true);
      return;
    }

    try {
      setIsLoading(true);
      setEmailError(false);

      const didToken = await magic?.auth.loginWithEmailOTP({ email });
      const metadata = await magic?.user.getInfo();
      const publicAddress = metadata?.wallets?.ethereum?.publicAddress;

      if (!didToken || !publicAddress) {
        throw new Error('Magic login failed — no token or address returned');
      }

      setToken(didToken);
      saveUserInfo(didToken, 'EMAIL', publicAddress);
      setEmail('');
    } catch (e: unknown) {
      console.error('Login error:', e);
      if (e instanceof MagicRPCError) {
        switch (e.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
          case RPCErrorCode.MagicLinkExpired:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            setErrorMsg(e.message);
            break;
          default:
            setErrorMsg('Something went wrong. Please try again.');
        }
      } else {
        setErrorMsg('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container fade-in">
      <div className="login-card glass-card">
        {/* Decorative glow */}
        <div className="login-glow" />

        <div className="login-header">
          <div className="login-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="gradient-text">Welcome to UniCard</h2>
          <p>Sign in with your email to get started</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-wrapper">
            <input
              type="email"
              placeholder={token ? 'Already logged in' : 'Enter your email'}
              value={email}
              onChange={(e) => {
                if (emailError) setEmailError(false);
                if (errorMsg) setErrorMsg('');
                setEmail(e.target.value);
              }}
              disabled={isLoading}
              className="login-input"
              autoComplete="email"
            />
            {emailError && <span className="input-error">Please enter a valid email address</span>}
          </div>

          {errorMsg && (
            <div className="error-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary login-btn"
            disabled={isLoading || (!token && email.length === 0)}
          >
            {isLoading ? (
              <span className="spinner-wrapper">
                <span className="spinner" />
                Sending OTP...
              </span>
            ) : (
              'Sign in with Email OTP'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Powered by <span className="gradient-text">Magic</span> × <span className="gradient-text">Particle Network</span></p>
          <p className="login-footer-sub">No wallet extension needed. No seed phrase.</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          padding: 2rem;
        }
        .login-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          overflow: hidden;
        }
        .login-glow {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }
        .login-icon {
          margin-bottom: 1rem;
        }
        .login-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .login-header p {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .login-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 15px;
          font-family: inherit;
          transition: all 0.2s ease;
          outline: none;
        }
        .login-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }
        .login-input::placeholder {
          color: var(--text-muted);
        }
        .login-input:disabled {
          opacity: 0.6;
        }
        .input-error {
          color: var(--color-error);
          font-size: 0.75rem;
          padding-left: 4px;
        }
        .error-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          color: var(--color-error);
          font-size: 0.8125rem;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          margin-top: 0.25rem;
        }
        .spinner-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .login-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--glass-border);
        }
        .login-footer p {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .login-footer-sub {
          margin-top: 0.25rem;
          font-size: 0.6875rem !important;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default Login;
