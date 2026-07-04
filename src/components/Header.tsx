import { useMagic } from '@/hooks/MagicProvider';
import { logout, truncateAddress, getUserAddress } from '@/utils/common';
import { useState, useEffect } from 'react';

interface HeaderProps {
  token: string;
  setToken: (token: string) => void;
}

const Header = ({ token, setToken }: HeaderProps) => {
  const { magic } = useMagic();
  const [address, setAddress] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const addr = getUserAddress();
    setAddress(addr);
  }, [token]);

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
          <h1 className="header-title">
            <span className="gradient-text">UniCard</span>
          </h1>
        </div>

        <nav className="header-nav">
          {token && address ? (
            <div className="header-user">
              <div className="header-address-chip">
                <span className="header-dot" />
                <span className="address-truncate">{truncateAddress(address)}</span>
              </div>
              <button
                className="btn-secondary header-logout-btn"
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
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--glass-border);
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
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
        }
        .header-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-success);
          box-shadow: 0 0 6px var(--color-success);
        }
        .header-logout-btn {
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
          border-radius: 20px;
        }
      `}</style>
    </header>
  );
};

export default Header;
