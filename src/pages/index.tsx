import Head from 'next/head';
import Login from '@/components/Login';
import DelegationCard from '@/components/DelegationCard';
import UnifiedBalance from '@/components/UnifiedBalance';
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
            {/* Welcome */}
            <section className="welcome-section">
              <h1 className="gradient-text welcome-title">Welcome back</h1>
              <p className="welcome-subtitle">
                Your EOA: <span className="address-truncate">{truncateAddress(address)}</span>
              </p>
            </section>

            {/* Dashboard Grid */}
            <section className="dashboard-grid">
              <div className="dashboard-col-left">
                <UnifiedBalance />
              </div>
              <div className="dashboard-col-right">
                <DelegationCard />
              </div>
            </section>

            {/* Coming Soon */}
            <section className="coming-section">
              <div className="glass-card coming-card">
                <h3>🎫 Access Passes</h3>
                <p>Browse and purchase event passes. Your Universal Account lets you pay from any chain.</p>
                <span className="coming-tag">Coming Day 5</span>
              </div>
            </section>
          </div>

          <style jsx>{`
            .home-main {
              min-height: calc(100vh - 60px);
              padding: 2rem 1.5rem;
            }
            .home-container {
              max-width: 960px;
              margin: 0 auto;
            }
            .welcome-section {
              margin-bottom: 2rem;
            }
            .welcome-title {
              font-size: 2rem;
              font-weight: 800;
              margin-bottom: 0.375rem;
            }
            .welcome-subtitle {
              color: var(--text-secondary);
              font-size: 0.875rem;
            }
            .dashboard-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1.25rem;
              margin-bottom: 2rem;
            }
            @media (max-width: 768px) {
              .dashboard-grid {
                grid-template-columns: 1fr;
              }
            }
            .coming-section {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
