import Head from 'next/head';
import Login from '@/components/Login';
import { getUserAddress, truncateAddress } from '@/utils/common';
import { useEffect, useState } from 'react';

interface HomeProps {
  token: string;
  setToken: (token: string) => void;
}

export default function Home({ token, setToken }: HomeProps) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    setAddress(getUserAddress());
  }, [token]);

  return (
    <>
      <Head>
        <title>UniCard — One Account. One Pass. Any Chain.</title>
        <meta
          name="description"
          content="Universal access platform powered by Particle Universal Accounts. Purchase passes from any chain, settle on Arbitrum."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {!token || !address ? (
        <Login token={token} setToken={setToken} />
      ) : (
        <main className="home-main fade-in">
          <div className="home-container">
            {/* Welcome Section */}
            <section className="welcome-section">
              <h1 className="gradient-text welcome-title">Welcome back</h1>
              <div className="welcome-address glass-card">
                <div className="welcome-address-row">
                  <span className="welcome-label">Your EOA</span>
                  <span className="address-truncate" style={{ fontSize: '14px' }}>
                    {truncateAddress(address)}
                  </span>
                </div>
                <div className="welcome-address-row">
                  <span className="welcome-label">Auth</span>
                  <span className="welcome-value">
                    <span className="auth-badge">✉ Email OTP</span>
                  </span>
                </div>
                <div className="welcome-address-row">
                  <span className="welcome-label">UA Mode</span>
                  <span className="welcome-value">
                    <span className="ua-badge">⚡ EIP-7702</span>
                  </span>
                </div>
              </div>
            </section>

            {/* Coming Soon Section */}
            <section className="coming-section">
              <div className="glass-card coming-card">
                <h3>🎫 Access Passes</h3>
                <p>Browse and purchase event passes. Your Universal Account lets you pay from any chain.</p>
                <span className="coming-tag">Coming Day 5</span>
              </div>
              <div className="glass-card coming-card">
                <h3>💳 Unified Balance</h3>
                <p>View your cross-chain balance across all supported tokens and networks.</p>
                <span className="coming-tag">Coming Day 3</span>
              </div>
              <div className="glass-card coming-card">
                <h3>🔗 EIP-7702 Delegation</h3>
                <p>Delegate your EOA on Arbitrum to enable Universal Account transactions.</p>
                <span className="coming-tag">Coming Day 3</span>
              </div>
            </section>
          </div>

          <style jsx>{`
            .home-main {
              min-height: calc(100vh - 60px);
              padding: 2rem 1.5rem;
            }
            .home-container {
              max-width: 900px;
              margin: 0 auto;
            }
            .welcome-section {
              margin-bottom: 3rem;
            }
            .welcome-title {
              font-size: 2rem;
              font-weight: 800;
              margin-bottom: 1.5rem;
            }
            .welcome-address {
              padding: 1.5rem;
              max-width: 450px;
            }
            .welcome-address-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0.625rem 0;
            }
            .welcome-address-row:not(:last-child) {
              border-bottom: 1px solid var(--glass-border);
            }
            .welcome-label {
              color: var(--text-muted);
              font-size: 0.8125rem;
              font-weight: 500;
            }
            .welcome-value {
              font-size: 0.875rem;
            }
            .auth-badge {
              background: rgba(124, 58, 237, 0.1);
              color: var(--color-primary-light);
              padding: 0.25rem 0.625rem;
              border-radius: 6px;
              font-size: 0.75rem;
              font-weight: 500;
            }
            .ua-badge {
              background: rgba(6, 182, 212, 0.1);
              color: var(--color-accent-light);
              padding: 0.25rem 0.625rem;
              border-radius: 6px;
              font-size: 0.75rem;
              font-weight: 500;
            }
            .coming-section {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
              gap: 1.25rem;
            }
            .coming-card {
              padding: 1.5rem;
              cursor: default;
            }
            .coming-card h3 {
              font-size: 1rem;
              font-weight: 600;
              margin-bottom: 0.5rem;
            }
            .coming-card p {
              color: var(--text-secondary);
              font-size: 0.8125rem;
              line-height: 1.5;
              margin-bottom: 0.75rem;
            }
            .coming-tag {
              display: inline-block;
              padding: 0.2rem 0.5rem;
              background: rgba(245, 158, 11, 0.1);
              color: var(--color-warning);
              border-radius: 4px;
              font-size: 0.6875rem;
              font-weight: 500;
            }
          `}</style>
        </main>
      )}
    </>
  );
}
