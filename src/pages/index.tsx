import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>UniCard — One Account. One Pass. Any Chain.</title>
        <meta name="description" content="Universal access platform powered by Particle Universal Accounts. Purchase passes from any chain, settle on Arbitrum." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', textAlign: 'center' }}>
          UniCard
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
          One Account. One Pass. Any Chain.
        </p>
        <div className="glass-card" style={{ padding: '2rem', maxWidth: '400px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            🚧 Building Day 1 — Magic Auth + Particle UA coming soon
          </p>
        </div>
      </main>
    </>
  );
}
