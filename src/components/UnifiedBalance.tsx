import { useUniversalAccount } from '@/hooks/UniversalAccountProvider';
import { useState } from 'react';

const UnifiedBalance = () => {
  const { primaryAssets, refreshBalance, loading } = useUniversalAccount();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshBalance();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && !primaryAssets) {
    return (
      <div className="balance-card glass-card">
        <div className="skeleton" style={{ height: '120px', borderRadius: '12px' }} />
      </div>
    );
  }

  const totalUSD = primaryAssets?.totalAmountInUSD != null
    ? Number(primaryAssets.totalAmountInUSD).toFixed(2)
    : '0.00';

  const assets = primaryAssets?.assets || [];

  return (
    <div className="balance-card glass-card fade-in">
      <div className="balance-header">
        <h3>
          <span className="balance-icon">💳</span>
          Universal Balance
        </h3>
        <button
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
          title="Refresh balance"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }}
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>

      <div className="balance-total">
        <span className="balance-usd gradient-text">${totalUSD}</span>
        <span className="balance-label">across all chains</span>
      </div>

      {assets.length > 0 ? (
        <div className="balance-breakdown">
          {assets.map((asset: any, i: number) => {
            const amount = parseFloat(asset.balance || '0');
            if (amount <= 0) return null;
            return (
              <div key={i} className="balance-asset">
                <div className="asset-info">
                  <span className="asset-symbol">{asset.symbol || asset.tokenType}</span>
                  <span className="asset-chain">{getChainName(asset.chainId)}</span>
                </div>
                <div className="asset-amounts">
                  <span className="asset-balance">{amount.toFixed(6)}</span>
                  {asset.amountInUSD && (
                    <span className="asset-usd">${parseFloat(asset.amountInUSD).toFixed(2)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="balance-empty">
          <p>No assets found. Fund your EOA to get started.</p>
          <p className="balance-hint">Send USDC, ETH, or USDT to your address on any supported chain.</p>
        </div>
      )}

      <style jsx>{`
        .balance-card {
          padding: 1.5rem;
        }
        .balance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .balance-header h3 {
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .balance-icon {
          font-size: 1.25rem;
        }
        .refresh-btn {
          background: none;
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }
        .refresh-btn:hover {
          border-color: var(--color-primary-light);
          color: var(--text-primary);
        }
        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .balance-total {
          text-align: center;
          padding: 1rem 0;
          border-bottom: 1px solid var(--glass-border);
          margin-bottom: 1rem;
        }
        .balance-usd {
          font-size: 2rem;
          font-weight: 800;
          display: block;
        }
        .balance-label {
          color: var(--text-muted);
          font-size: 0.75rem;
          margin-top: 0.25rem;
          display: block;
        }
        .balance-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .balance-asset {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.625rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }
        .balance-asset:last-child {
          border-bottom: none;
        }
        .asset-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }
        .asset-symbol {
          font-size: 0.875rem;
          font-weight: 600;
        }
        .asset-chain {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }
        .asset-amounts {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.125rem;
        }
        .asset-balance {
          font-size: 0.875rem;
          font-family: 'Fira Code', monospace;
        }
        .asset-usd {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }
        .balance-empty {
          text-align: center;
          padding: 1rem 0;
        }
        .balance-empty p {
          color: var(--text-secondary);
          font-size: 0.8125rem;
        }
        .balance-hint {
          margin-top: 0.375rem;
          font-size: 0.75rem !important;
          color: var(--text-muted) !important;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Helper: chain ID → display name
function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: 'Ethereum',
    42161: 'Arbitrum One',
    8453: 'Base',
    137: 'Polygon',
    56: 'BNB Chain',
    43114: 'Avalanche',
    10: 'Optimism',
    534352: 'Scroll',
    59144: 'Linea',
  };
  return chains[chainId] || `Chain ${chainId}`;
}

export default UnifiedBalance;
