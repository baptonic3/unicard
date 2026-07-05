import { useUniversalAccount } from '@/hooks/UniversalAccountProvider';
import { truncateAddress } from '@/utils/common';
import { useState } from 'react';

const DelegationCard = () => {
  const { accountInfo, isDelegated, ensureDelegated, undelegate, loading } = useUniversalAccount();
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelegate = async () => {
    setError('');
    setActionLoading(true);
    try {
      await ensureDelegated();
    } catch (err: any) {
      console.error('Delegation failed:', err);
      setError(err?.message || 'Delegation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUndelegate = async () => {
    setError('');
    setActionLoading(true);
    try {
      await undelegate();
    } catch (err: any) {
      console.error('Undelegation failed:', err);
      setError(err?.message || 'Undelegation failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !accountInfo.ownerAddress) {
    return (
      <div className="delegation-card glass-card">
        <div className="skeleton" style={{ height: '140px', borderRadius: '12px' }} />
      </div>
    );
  }

  return (
    <div className="delegation-card glass-card fade-in">
      <div className="delegation-header">
        <h3>
          <span className="delegation-icon">⚡</span>
          EIP-7702 Delegation
        </h3>
        <span className={`delegation-badge ${isDelegated ? 'active' : 'inactive'}`}>
          {isDelegated ? '● Active' : '○ Not delegated'}
        </span>
      </div>

      <div className="delegation-rows">
        <div className="delegation-row">
          <span className="delegation-label">Your EOA</span>
          <span className="address-truncate">{truncateAddress(accountInfo.ownerAddress)}</span>
        </div>
        <div className="delegation-row">
          <span className="delegation-label">EVM UA</span>
          <span className="address-truncate">
            {accountInfo.evmSmartAccount ? truncateAddress(accountInfo.evmSmartAccount) : '—'}
          </span>
        </div>
        <div className="delegation-row">
          <span className="delegation-label">Solana UA</span>
          <span className="address-truncate">
            {accountInfo.solanaSmartAccount ? truncateAddress(accountInfo.solanaSmartAccount) : '—'}
          </span>
        </div>
        <div className="delegation-row">
          <span className="delegation-label">Chain</span>
          <span className="delegation-chain">Arbitrum One (42161)</span>
        </div>
        <div className="delegation-row">
          <span className="delegation-label">Mode</span>
          <span className="delegation-mode">EIP-7702 Inline</span>
        </div>
      </div>

      {error && (
        <div className="delegation-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      <div className="delegation-actions">
        {isDelegated ? (
          <button
            className="btn-secondary delegation-btn"
            onClick={handleUndelegate}
            disabled={actionLoading}
          >
            {actionLoading ? 'Undelegating...' : 'Undelegate'}
          </button>
        ) : (
          <button
            className="btn-primary delegation-btn"
            onClick={handleDelegate}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span className="delegation-spinner" />
                Delegating on Arbitrum...
              </span>
            ) : (
              '⚡ Delegate on Arbitrum'
            )}
          </button>
        )}
      </div>

      <style jsx>{`
        .delegation-card {
          padding: 1.5rem;
        }
        .delegation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .delegation-header h3 {
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .delegation-icon {
          font-size: 1.25rem;
        }
        .delegation-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .delegation-badge.active {
          background: rgba(16, 185, 129, 0.1);
          color: var(--color-success);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .delegation-badge.inactive {
          background: rgba(245, 158, 11, 0.1);
          color: var(--color-warning);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        .delegation-rows {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .delegation-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .delegation-row:last-child {
          border-bottom: none;
        }
        .delegation-label {
          color: var(--text-muted);
          font-size: 0.8125rem;
          font-weight: 500;
        }
        .delegation-chain {
          font-size: 0.8125rem;
          color: var(--color-accent-light);
        }
        .delegation-mode {
          font-size: 0.8125rem;
          color: var(--color-primary-light);
        }
        .delegation-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 0.875rem;
          margin-top: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: var(--color-error);
          font-size: 0.75rem;
        }
        .delegation-actions {
          margin-top: 1rem;
        }
        .delegation-btn {
          width: 100%;
          padding: 12px;
          font-size: 0.875rem;
        }
        .delegation-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DelegationCard;
