import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useMagic } from '@/hooks/MagicProvider';
import { getUserAddress, truncateAddress, saveUserInfo } from '@/utils/common';
import { useUniversalAccount } from '@/hooks/UniversalAccountProvider';
import Header from '@/components/Header';
import DelegationCard from '@/components/DelegationCard';
import UnifiedBalanceCard from '@/components/UnifiedBalanceCard';
import PassCard from '@/components/PassCard';

export default function Dashboard() {
  const router = useRouter();
  const { token, setToken } = useMagic();
  const { accountInfo, primaryAssets, isDelegated } = useUniversalAccount();
  const [address, setAddress] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [passes, setPasses] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [selectedPass, setSelectedPass] = useState<any | null>(null);

  const t = isDark
    ? { bg: '#0f0f14', surface: '#1a1a24', border: 'rgba(255,255,255,0.08)', text: '#f0f0f5', subtext: '#8892a4', muted: '#333344', accent: '#00e599', navBorder: 'rgba(255,255,255,0.07)', navBg: '#15151f', activeTab: '#fff', cardShadow: '0 2px 12px rgba(0,0,0,0.4)' }
    : { bg: '#fcfcfc', surface: '#fff', border: '#e2e8f0', text: '#111', subtext: '#64748b', muted: '#f1f5f9', accent: '#00e599', navBorder: '#e2e8f0', navBg: '#fff', activeTab: '#111', cardShadow: '0 2px 4px rgba(0,0,0,0.02)' };

  useEffect(() => {
    setMounted(true);
    const addr = getUserAddress();
    setAddress(addr);
    if (addr) {
      fetch(`/api/passes?address=${addr}`)
        .then(res => res.json())
        .then(data => {
          if (data.passes) setPasses(data.passes);
        })
        .catch(console.error);
    }
  }, [token]);

  // Redirect to unified /login if not authenticated
  useEffect(() => {
    if (mounted && !token && !getUserAddress()) {
      router.replace('/login?next=/dashboard');
    }
  }, [mounted, token]);

  if (!mounted) return null;
  const balance = Number(primaryAssets?.totalAmountInUSD ?? 0).toFixed(2);
  const isPendingEvent = router.query.pending === 'true';

  // PassCard modal overlay
  const passModal = selectedPass && (
    <div
      onClick={() => setSelectedPass(null)}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '1rem',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
        <button
          onClick={() => setSelectedPass(null)}
          style={{
            position: 'absolute', top: -14, right: -14, zIndex: 10,
            width: 32, height: 32, borderRadius: '50%',
            background: '#fff', border: '1px solid #e2e8f0',
            fontSize: 18, color: '#64748b', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >×</button>
        <PassCard
          passId={selectedPass.chainPassId ?? selectedPass.id}
          itemTitle={selectedPass.item?.title || 'Access Pass'}
          itemDescription={selectedPass.item?.description}
          itemImageUrl={selectedPass.item?.imageUrl ?? undefined}
          priceUSDC={selectedPass.item?.priceUSDC ?? 0}
          buyerAddress={selectedPass.buyerAddress || ''}
          arbTxHash={selectedPass.arbitrumTxHash || ''}
          particleTxId={selectedPass.particleTxId || ''}
        />
      </div>
    </div>
  );

  return (
    <>
      {passModal}
      <Head>
        <title>Wallet | UniCard</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <Header token={token} setToken={setToken} />

      <div style={{ backgroundColor: t.bg, minHeight: '100vh', color: t.text, fontFamily: 'Inter, sans-serif', transition: 'background-color 0.25s, color 0.25s' }}>

        {/* SECONDARY NAV STRIP */}
        {/* <div style={{ borderBottom: `1px solid ${t.navBorder}`, backgroundColor: t.navBg, transition: 'background-color 0.25s' }}>
          <nav style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/dashboard" style={{ display: 'inline-block', padding: '14px 16px', color: t.activeTab, textDecoration: 'none', fontWeight: 600, fontSize: '14px', borderBottom: `2px solid ${t.activeTab}` }}>Wallet</Link>
            <span style={{ display: 'inline-block', padding: '14px 16px', color: t.subtext, fontSize: '14px', cursor: 'default' }}>Transactions</span>
            <span style={{ display: 'inline-block', padding: '14px 16px', color: t.subtext, fontSize: '14px', cursor: 'default' }}>Settings</span>
            
            <div style={{ marginLeft: 'auto' }}>
              <button
                onClick={() => setIsDark(d => !d)}
                title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                  border: `1px solid ${t.navBorder}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                {isDark
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0f0f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                }
              </button>
            </div>
          </nav>
        </div> */}

        {/* MAIN BODY */}
        <main style={{ maxWidth: '1024px', margin: '0 auto', padding: '48px 24px' }}>
            <div className="fade-in">
              {/* WELCOME */}
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px', color: t.text }}>Welcome back</h1>
                <p style={{ color: t.subtext, fontSize: '14px' }}>
                  Your EOA <span style={{ fontFamily: 'monospace', fontWeight: 600, color: isDark ? '#a5b4fc' : '#334155' }}>{truncateAddress(address || '')}</span>
                </p>
              </div>

              {isPendingEvent ? (
                /* PENDING EVENT UI (IMAGE 2) */
                <>
                  {/* Top large card for pending event */}
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '24px', display: 'flex', gap: '32px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    {/* Event image mockup (using a gradient placeholder with text to look like the Onchain trading forum) */}
                    <div style={{ width: '320px', height: '320px', borderRadius: '16px', background: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: '24px', left: '24px', color: '#fff' }}>
                        <div style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.1 }}>Onchain<br/>Trading Forum<br/>2026</div>
                        <div style={{ fontSize: '12px', marginTop: '12px', opacity: 0.8 }}>13:30 - 18:30 JST, 12th July<br/>WebX Tokyo</div>
                      </div>
                      <div style={{ position: 'absolute', bottom: '24px', left: '24px', color: '#fff', fontSize: '18px', fontWeight: 800 }}>PopDEX</div>
                    </div>
                    
                    {/* Event Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span style={{ padding: '6px 12px', background: '#fef3c7', color: '#d97706', borderRadius: '20px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706' }}></span> Pending payment
                        </span>
                        <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          Reserved - 23:45 left
                        </span>
                      </div>
                      
                      <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>Onchain Trading Forum 2026 in Tokyo</h2>
                      <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '8px' }}>Thu, Jul 12 · Minato City, Japan</p>
                      <a href="#" style={{ color: '#00e599', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: 'auto' }}>
                        View on lu.ma/ethglobal <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </a>
                      
                      {/* Price Details */}
                      <div style={{ marginTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', fontSize: '14px', color: '#64748b' }}>
                          <span>Price</span>
                          <span style={{ color: '#111', fontWeight: 500 }}>$5.00</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#64748b' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Service fee <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>
                          <span style={{ color: '#111', fontWeight: 500 }}>$0.20</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', fontSize: '16px', fontWeight: 700 }}>
                          <span>Total</span>
                          <span>$5.20</span>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                        <button style={{ flex: 1, padding: '16px', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '16px', fontWeight: 600, borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
                        <button style={{ flex: 2, padding: '16px', background: '#00e599', color: '#fff', border: 'none', fontSize: '16px', fontWeight: 600, borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                          Pay $5.20 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom two columns */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Add funds box */}
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px', display: 'flex', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Universal Balance</div>
                        <div style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '8px' }}>$0.00</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>across all chains</div>
                      </div>
                      
                      <div style={{ maxWidth: '200px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Add funds to get started</div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Buy with Apple Pay or card, or receive from any chain.</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <button style={{ padding: '12px', background: '#00e599', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add funds
                          </button>
                          <button style={{ padding: '12px', background: '#fff', color: '#111', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg> Receive
                          </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '16px', fontSize: '12px', color: '#94a3b8' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"></path></svg> Powered by Magic
                        </div>
                      </div>
                    </div>

                    {/* Delegation Card (same as empty wallet) */}
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e599" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                          </div>
                          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>EIP-7702 Delegation</h3>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#00e599' }}>{isDelegated ? 'Active' : 'Unsigned'}</span>
                          <div style={{ width: '40px', height: '24px', background: isDelegated ? '#00e599' : '#cbd5e1', borderRadius: '12px', position: 'relative' }}>
                            <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: isDelegated ? '18px' : '2px', transition: 'left 0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                          { label: 'Your EOA', value: truncateAddress(address || '') },
                          { label: 'EVM UA', value: accountInfo ? truncateAddress(accountInfo.evmSmartAccount) : 'Loading...' },
                          { label: 'Solana UA', value: accountInfo ? truncateAddress(accountInfo.solanaSmartAccount) : 'Loading...' },
                          { label: 'Chain', value: 'Arbitrum • 42161', bold: true },
                          { label: 'Mode', value: 'EIP-7702 Inline', bold: true }
                        ].map(row => (
                          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: '#64748b' }}>{row.label}</span>
                            <span style={{ fontSize: '14px', fontWeight: row.bold ? 600 : 500, color: '#111', fontFamily: row.bold ? 'inherit' : 'monospace' }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* DEFAULT EMPTY WALLET UI (IMAGE 1) */
                <>
                  <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '24px', padding: '32px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px', boxShadow: t.cardShadow }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: t.subtext, marginBottom: '8px' }}>Universal Balance</div>
                      <div style={{ fontSize: '56px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '8px', color: t.text }}>${balance}</div>
                      <div style={{ fontSize: '13px', color: t.subtext, marginBottom: '24px' }}>across all chains</div>
                      <svg width="180" height="40" viewBox="0 0 180 40" fill="none">
                        <path d="M0 35L20 32L35 38L50 25L65 28L80 20L95 24L110 15L125 18L140 10L155 12L175 5" stroke="#00e599" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', paddingRight: '16px' }}>
                      {/* existing buttons code here... */}
                      {[{label: 'Send', icon: <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />}, 
                        {label: 'Receive', icon: <path d="M12 5v14M19 12l-7 7-7-7" />},
                        {label: 'Add', icon: <path d="M12 5v14M5 12h14" />},
                        {label: 'Convert', icon: <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />}
                      ].map((btn) => (
                        <div key={btn.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                          <button 
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = '#00e599';
                              const svg = e.currentTarget.querySelector('svg');
                              if (svg) svg.style.stroke = '#fff';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = '#f1f5f9';
                              const svg = e.currentTarget.querySelector('svg');
                              if (svg) svg.style.stroke = '#334155';
                            }}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s' }}>{btn.icon}</svg>
                          </button>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>{btn.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                      <DelegationCard />

                      <UnifiedBalanceCard />
                  </div>

                  {/* <div style={{ background: t.surface, border: `1px solid ${isDark ? t.accent + '33' : '#bbf7d0'}`, borderRadius: '20px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px dashed #00e599', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e599" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0', color: t.text }}>Add funds from any chain</h4>
                        <p style={{ fontSize: '13px', color: t.subtext, margin: 0 }}>Top up in seconds — no bridging.</p>
                      </div>
                    </div>
                    <button style={{ padding: '12px 24px', background: '#00e599', color: '#fff', fontWeight: 600, fontSize: '14px', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Add funds <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div> */}

                  <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '24px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: t.text }}>Recent activity</h3>
                      {/* <span style={{ fontSize: '13px', fontWeight: 600, color: t.accent, cursor: 'pointer' }}>View all →</span> */}
                    </div>

                    {passes.length === 0 ? (
                      <div style={{ fontSize: '14px', color: t.subtext, marginTop: '16px' }}>No recent activity.</div>
                    ) : (
                      passes.map(pass => (
                        <div
                          key={pass.id}
                          onClick={() => setSelectedPass(pass)}
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            paddingBottom: '16px', borderBottom: `1px solid ${t.border}`,
                            marginBottom: '16px', marginTop: '16px',
                            cursor: 'pointer', borderRadius: 8, padding: '12px 8px',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isDark ? 'rgba(0,229,153,0.1)' : '#e6fcf5', border: `1px solid ${isDark ? '#00e59933' : '#a7f3d0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                                <line x1="12" y1="8" y2="16" x2="12" strokeDasharray="2 3"></line>
                              </svg>
                            </div>
                            <div>
                              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px', color: t.text }}>Pass Issued</div>
                              <div style={{ fontSize: '13px', color: t.subtext }}>{pass.item?.title || 'Unknown Item'}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 600, background: '#f0fdf4', color: '#059669', padding: '4px 10px', borderRadius: '12px' }}>• Confirmed</span>
                            <span style={{ fontSize: '13px', color: '#94a3b8', width: '70px', textAlign: 'right' }}>TX: {truncateAddress(pass.arbTxHash || pass.particleTxId || '')}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
        </main>
      </div>
    </>
  );
}
