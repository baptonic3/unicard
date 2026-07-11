import Link from 'next/link';

export interface AccessItemData {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  priceUSDC: number;
  chainItemId?: number | null;
  active: boolean;
}

interface AccessCardProps {
  item: AccessItemData;
}

const AccessCard = ({ item }: AccessCardProps) => {
  return (
    <Link href={`/access/${item.slug}`} className="access-card-link">
      <article className="access-card glass-card">
        {/* Image */}
        <div className="card-image-wrap">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="card-image"
              loading="lazy"
            />
          ) : (
            <div className="card-image-placeholder">
              <span>🎫</span>
            </div>
          )}
          <div className="card-price-badge">
            <span className="price-amount">${item.priceUSDC.toFixed(2)}</span>
            <span className="price-currency">USDC</span>
          </div>
        </div>

        {/* Body */}
        <div className="card-body">
          <h3 className="card-title">{item.title}</h3>
          <p className="card-description">{item.description}</p>

          <div className="card-footer">
            <div className="card-chain-badge">
              <span className="chain-dot" />
              Arbitrum One
            </div>
            <div className="card-cta">
              Get Pass →
            </div>
          </div>
        </div>
      </article>

      <style jsx>{`
        .access-card-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .access-card {
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .access-card:hover .card-cta {
          color: var(--color-primary-light);
        }
        .card-image-wrap {
          position: relative;
          height: 180px;
          overflow: hidden;
          border-radius: 12px 12px 0 0;
          flex-shrink: 0;
        }
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .access-card:hover .card-image {
          transform: scale(1.05);
        }
        .card-image-placeholder {
          width: 100%;
          height: 100%;
          background: var(--gradient-card);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
        }
        .card-price-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 4px 10px;
          display: flex;
          align-items: baseline;
          gap: 3px;
        }
        .price-amount {
          font-weight: 700;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }
        .price-currency {
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--color-accent-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          flex: 1;
        }
        .card-title {
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.3;
          color: var(--text-primary);
        }
        .card-description {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--glass-border);
        }
        .card-chain-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.6875rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .chain-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-accent);
          display: inline-block;
          box-shadow: 0 0 6px var(--color-accent);
        }
        .card-cta {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: color 0.2s;
        }
      `}</style>
    </Link>
  );
};

export default AccessCard;
