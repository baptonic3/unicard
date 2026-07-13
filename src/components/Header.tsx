import { useMagic } from '@/hooks/MagicProvider';
import { logout, truncateAddress, getUserAddress } from '@/utils/common';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';

interface HeaderProps {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
}

const Header = ({ token, setToken }: HeaderProps) => {
  const { magic } = useMagic();
  const [address, setAddress] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const addr = getUserAddress();
    setAddress(addr);
    if (addr) {
      console.log('🔑 Magic EOA Address:', addr);
    }
  }, [token]);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      console.log('📋 Copied EOA address:', address);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = address;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout(setToken, magic);
      setAddress(null);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-logo gradient-text">◈</span>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 className="header-title">
              <span className="gradient-text">UniCard</span>
            </h1>
          </Link>
        </div>

        <nav className="header-nav">
          {token && address ? (
            <div className="header-user">
              <div className="header-address-chip" onClick={handleCopy} title="Click to copy full address">
                <span className="header-dot" />
                <span className="address-truncate">{truncateAddress(address)}</span>
                <span className="copy-icon">
                  {copied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </span>
              </div>
              <button
                className="header-logout-btn"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : null}
        </nav>
      </div>

      <style jsx>{`
        .app-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid #e2e8f0;
          color: #0f172a;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.875rem 1.5rem;
        }
        .header-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .header-logo {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .header-title {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .header-nav {
          display: flex;
          align-items: center;
        }
        .header-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .header-address-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #334155;
        }
        .header-address-chip:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }
        .header-address-chip .address-truncate {
          color: #334155;
        }
        .header-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
        }
        .copy-icon {
          display: flex;
          align-items: center;
          margin-left: 2px;
        }
        .header-logout-btn {
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
          font-weight: 600;
          border-radius: 20px;
          background: #fff;
          color: #64748b;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .header-logout-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }
        .header-logout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </header>
  );
};

export default Header;
