import { AccessItemData } from '@/components/AccessCard';

interface CheckoutPreviewProps {
  item: AccessItemData;
  referrer?: string; // display name of the referring seller site
}

const CheckoutPreview = ({ item, referrer }: CheckoutPreviewProps) => {
  return (
    <div className="checkout-preview fade-in">
      {/* Referrer pill */}
      {referrer && (
        <div className="referrer-pill">
          <span className="referrer-dot" />
          Redirected from <strong>{referrer}</strong>
        </div>
      )}

      {/* Item image */}
      <div className="preview-image-wrap">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.title} className="preview-image" />
        ) : (
          <div className="preview-image-placeholder">🎫</div>
        )}
        {/* Price badge overlay */}
        <div className="preview-price-badge">
          ${item.priceUSDC.toFixed(2)} <span className="preview-price-unit">USDC</span>
        </div>
      </div>

      {/* Item info */}
      <div className="preview-info">
        <h2 className="preview-title">{item.title}</h2>
        <p className="preview-desc">{item.description}</p>

        <div className="preview-rows">
          <div className="preview-row">
            <span className="preview-label">Settlement</span>
            <span className="preview-value chain-value">
              <span className="pulse-dot" />
              Arbitrum One
            </span>
          </div>
          <div className="preview-row">
            <span className="preview-label">Accepted payment</span>
            <span className="preview-value">Any chain, any asset</span>
          </div>
          {item.chainItemId != null && (
            <div className="preview-row">
              <span className="preview-label">On-chain ID</span>
              <span className="preview-value mono">#{item.chainItemId}</span>
            </div>
          )}
        </div>

        {/* Trust row */}
        <div className="preview-trust">
          {[
            { label: 'Non-custodial', sub: 'Your keys, your pass' },
            { label: 'On-chain proof', sub: 'Arbiscan receipt' },
            { label: 'Cross-chain', sub: 'Pay from any network' },
          ].map((t) => (
            <div key={t.label} className="trust-badge">
              <span className="trust-label">{t.label}</span>
              <span className="trust-sub">{t.sub}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .checkout-preview {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .referrer-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 0.75rem;
          color: var(--color-accent-light);
          width: fit-content;
        }
        .referrer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent);
          box-shadow: 0 0 6px var(--color-accent);
          flex-shrink: 0;
        }
        .preview-image-wrap {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          height: 260px;
        }
        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preview-image-placeholder {
          width: 100%;
          height: 100%;
          background: var(--gradient-card);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
        }
        .preview-price-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(10, 10, 15, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 6px 12px;
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .preview-price-unit {
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--color-accent-light);
          vertical-align: middle;
          margin-left: 2px;
        }
        .preview-info {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 1.5rem;
        }
        .preview-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
        .preview-desc {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
        .preview-rows {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--glass-border);
          margin-bottom: 1.25rem;
        }
        .preview-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.625rem 0;
          border-bottom: 1px solid var(--glass-border);
          font-size: 0.8125rem;
        }
        .preview-row:last-child {
          border-bottom: none;
        }
        .preview-label {
          color: var(--text-muted);
          font-weight: 500;
        }
        .preview-value {
          font-weight: 600;
        }
        .chain-value {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-accent-light);
        }
        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-accent);
          box-shadow: 0 0 6px var(--color-accent);
          display: inline-block;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .mono {
          font-family: 'Fira Code', monospace;
          font-size: 0.8125rem;
        }
        .preview-trust {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        .trust-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 3px;
          padding: 0.625rem 0.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
        }
        .trust-label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .trust-sub {
          font-size: 0.625rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default CheckoutPreview;
