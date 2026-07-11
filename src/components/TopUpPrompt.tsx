interface TopUpPromptProps {
  needed: number;  // USD needed
  current: number; // USD current balance
  depositAddress: string; // User's smart account address
}

const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', tokens: ['ETH', 'USDC', 'USDT', 'DAI'], color: '#627EEA' },
  { id: 'base',     name: 'Base',     tokens: ['ETH', 'USDC', 'USDbC'],       color: '#0052FF' },
  { id: 'polygon',  name: 'Polygon',  tokens: ['MATIC', 'USDC', 'USDT'],      color: '#8247E5' },
  { id: 'bnb',      name: 'BNB Chain',tokens: ['BNB', 'USDC', 'USDT'],        color: '#F3BA2F' },
  { id: 'arbitrum', name: 'Arbitrum', tokens: ['ETH', 'USDC', 'USDT'],        color: '#12AAFF' },
  { id: 'solana',   name: 'Solana',   tokens: ['SOL', 'USDC', 'USDT'],        color: '#9945FF' },
];

export default function TopUpPrompt({ needed, current, depositAddress }: TopUpPromptProps) {
  const shortfall = Math.max(needed - current, 0).toFixed(2);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
    } catch { /* ignore */ }
  };

  return (
    <div className="topup-root">
      {/* Shortfall banner */}
      <div className="shortfall-banner">
        <div className="shortfall-row">
          <span className="shortfall-label">Balance needed</span>
          <span className="shortfall-need">${needed.toFixed(2)} USDC</span>
        </div>
        <div className="shortfall-row">
          <span className="shortfall-label">Your balance</span>
          <span className="shortfall-have">${current.toFixed(2)}</span>
        </div>
        <div className="shortfall-divider" />
        <div className="shortfall-row">
          <span className="shortfall-label">Top up at least</span>
          <span className="shortfall-diff gradient-text">${shortfall}</span>
        </div>
      </div>

      {/* Deposit address */}
      <div className="deposit-card glass-card">
        <p className="deposit-label">Send funds to your Universal Account:</p>
        <div className="deposit-address-row">
          <code className="deposit-address">{depositAddress}</code>
          <button className="copy-btn" onClick={copyAddress} title="Copy address">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
        </div>
        <p className="deposit-hint">
          This is your EIP-7702 Universal Account address (same EOA across all EVM chains).
        </p>
      </div>

      {/* Supported chains */}
      <div className="chains-label">Supported chains &amp; tokens:</div>
      <div className="chains-grid">
        {CHAINS.map((chain) => (
          <div key={chain.id} className="chain-card">
            <div className="chain-header">
              <span className="chain-dot" style={{ background: chain.color, boxShadow: `0 0 6px ${chain.color}` }} />
              <span className="chain-name">{chain.name}</span>
            </div>
            <div className="chain-tokens">
              {chain.tokens.map((t) => (
                <span key={t} className="token-pill">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="topup-note">
        ℹ️ After sending, your balance updates automatically. Refresh the page to see the updated amount.
      </p>

      <style jsx>{`
        .topup-root {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .shortfall-banner {
          background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 12px;
          padding: 0.875rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .shortfall-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8125rem;
        }
        .shortfall-label { color: var(--text-muted); }
        .shortfall-need  { font-weight: 700; color: var(--text-primary); }
        .shortfall-have  { font-weight: 600; color: var(--color-warning); }
        .shortfall-divider {
          height: 1px;
          background: rgba(245, 158, 11, 0.2);
          margin: 0.25rem 0;
        }
        .shortfall-diff {
          font-size: 1.0625rem;
          font-weight: 800;
        }
        .deposit-card {
          padding: 1rem;
        }
        .deposit-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .deposit-address-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          margin-bottom: 0.5rem;
          overflow: hidden;
        }
        .deposit-address {
          flex: 1;
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          color: var(--color-accent-light);
          word-break: break-all;
        }
        .copy-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .copy-btn:hover { color: var(--text-primary); }
        .deposit-hint {
          font-size: 0.6875rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .chains-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .chains-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.625rem;
        }
        .chain-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 0.625rem 0.75rem;
        }
        .chain-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 0.375rem;
        }
        .chain-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .chain-name {
          font-size: 0.75rem;
          font-weight: 600;
        }
        .chain-tokens {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }
        .token-pill {
          font-size: 0.5625rem;
          font-weight: 600;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          padding: 1px 6px;
          color: var(--text-muted);
        }
        .topup-note {
          font-size: 0.6875rem;
          color: var(--text-muted);
          line-height: 1.5;
          padding: 0.625rem;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
