import { useUniversalAccount } from '@/hooks/UniversalAccountProvider';
import { truncateAddress } from '@/utils/common';
import { useState } from 'react';

const DelegationCard = () => {
  const { accountInfo, isDelegated, ensureDelegated, undelegate, loading } = useUniversalAccount();
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // Hardcoded Theme matching the dashboard Light mode
  const t = {
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#111',
    subtext: '#64748b',
    cardShadow: '0 2px 4px rgba(0,0,0,0.02)'
  };

  const handleToggle = async () => {
    if (actionLoading) return;
    setError('');
    setActionLoading(true);
    
    try {
      if (isDelegated) {
        await undelegate();
      } else {
        await ensureDelegated();
      }
    } catch (err: any) {
      console.error('Delegation toggle failed:', err);
      setError(err?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !accountInfo.ownerAddress) {
    return (
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '24px', padding: '24px', boxShadow: t.cardShadow }}>
        <div style={{ height: '140px', borderRadius: '12px', background: '#f1f5f9', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '24px', padding: '24px', boxShadow: t.cardShadow }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: `1px solid ${t.border}`, paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {actionLoading ? (
               <div style={{ width: '12px', height: '12px', border: '2px solid rgba(0, 229, 153, 0.2)', borderTopColor: '#00e599', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : (
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e599" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: t.text }}>EIP-7702 Delegation</h3>
            <div 
              style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onMouseOver={(e) => {
                  const tooltip = e.currentTarget.querySelector('.tooltip-popup') as HTMLElement;
                  if (tooltip) { tooltip.style.opacity = '1'; tooltip.style.transform = 'translate(-50%, -8px)'; tooltip.style.visibility = 'visible'; }
              }}
              onMouseOut={(e) => {
                  const tooltip = e.currentTarget.querySelector('.tooltip-popup') as HTMLElement;
                  if (tooltip) { tooltip.style.opacity = '0'; tooltip.style.transform = 'translate(-50%, 0px)'; tooltip.style.visibility = 'hidden'; }
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <div 
                className="tooltip-popup"
                style={{
                  position: 'absolute', bottom: '100%', left: '50%', transform: 'translate(-50%, 0)', visibility: 'hidden',
                  width: 290, padding: 14, borderRadius: 10, background: '#27272a', color: '#f8fafc',
                  fontSize: 13, lineHeight: 1.5, fontWeight: 400, opacity: 0, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10, pointerEvents: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
              >
                Enables smart-account features for cross-chain payments while keeping your existing wallet address. Pay from any supported chain without switching networks—you remain in control and approve every transaction.
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', borderWidth: 6, borderStyle: 'solid', borderColor: '#27272a transparent transparent transparent' }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <div 
          style={{ 
             display: 'flex', 
             alignItems: 'center', 
             gap: '8px', 
             cursor: actionLoading ? 'not-allowed' : 'pointer', 
             opacity: actionLoading ? 0.8 : 1,
             transform: actionLoading ? 'scale(0.96)' : 'scale(1)',
             transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }} 
          onClick={handleToggle}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: isDelegated ? '#00e599' : t.subtext, transition: 'color 0.2s' }}>{isDelegated ? 'Delegated' : 'Not Delegated'}</span>
          <div style={{ width: '40px', height: '24px', background: actionLoading ? '#94a3b8' : (isDelegated ? '#00e599' : '#cbd5e1'), borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
            <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: isDelegated ? '18px' : '2px', transition: 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {actionLoading && (
                 <div style={{ width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: '#64748b', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
               )}
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { label: 'Your EOA', value: accountInfo ? truncateAddress(accountInfo.ownerAddress || '') : 'Loading...', copyValue: accountInfo?.ownerAddress },
          { label: 'EVM UA', value: accountInfo ? truncateAddress(accountInfo.evmSmartAccount) : 'Loading...', copyValue: accountInfo?.evmSmartAccount },
          { label: 'Solana UA', value: accountInfo ? truncateAddress(accountInfo.solanaSmartAccount) : 'Loading...', copyValue: accountInfo?.solanaSmartAccount },
          { label: 'Chain', value: 'Arbitrum • 42161', bold: true },
          { label: 'Mode', value: 'EIP-7702 Inline', bold: true }
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: t.subtext }}>{row.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {row.copyValue && (
                <button 
                  onClick={() => navigator.clipboard.writeText(row.copyValue as string)}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#00e599'; e.currentTarget.style.background = '#f0fdf4'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    width: '24px', height: '24px', borderRadius: '6px', border: 'none',
                    background: 'transparent', color: '#94a3b8', transition: 'all 0.2s', padding: 0
                  }}
                  title="Copy address"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              )}
              <span style={{ fontSize: '14px', fontWeight: row.bold ? 600 : 500, color: t.text, fontFamily: row.bold ? 'inherit' : 'monospace' }}>{row.value || '—'}</span>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
         <div style={{ marginTop: '16px', padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span> {error}
         </div>
      )}
      
      <style>{`
         @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DelegationCard;
