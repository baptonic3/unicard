import Link from 'next/link';
import { CREATE_WALLET_PATH, DEMO_PATH } from './links';

export default function CtaBanner() {
  return (
    <section className="lp-cta">
      <div className="lp-cta-card">
        <h2 className="lp-cta-title">Ready to try UniCard?</h2>
        <p className="lp-cta-sub">
          One balance, every chain. Create your wallet in seconds — or see it in action first.
        </p>
        <div className="lp-cta-buttons">
          <Link href={CREATE_WALLET_PATH} className="lp-btn lp-btn-primary">Create wallet</Link>
          <Link href={DEMO_PATH} className="lp-btn lp-btn-ghost">Try a demo</Link>
        </div>
      </div>

      <style jsx>{`
        .lp-cta {
          display: flex;
          justify-content: center;
          padding: 0 20px 96px;
        }
        .lp-cta-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: min(1120px, 100%);
          padding: 72px 40px;
          border-radius: 24px;
          background: var(--lp-dark-gradient);
        }
        .lp-cta-title {
          margin: 0;
          font-size: 34px;
          font-weight: 600;
          letter-spacing: -0.015em;
          text-align: center;
          color: #fff;
        }
        .lp-cta-sub {
          margin: 0;
          max-width: 520px;
          font-size: 15px;
          line-height: 1.6;
          text-align: center;
          color: rgba(255, 255, 255, 0.65);
        }
        .lp-cta-buttons {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }
        @media (max-width: 767px) {
          .lp-cta {
            padding-bottom: 56px;
          }
          .lp-cta-card {
            padding: 48px 24px;
            border-radius: 20px;
          }
          .lp-cta-title {
            font-size: 26px;
          }
          .lp-cta-buttons {
            flex-direction: column;
            width: 100%;
          }
          .lp-cta-buttons :global(.lp-btn) {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
