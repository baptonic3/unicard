import Logo from './Logo';
import { ExternalIcon } from './icons';
import { DEMO_PATH, GITHUB_URL, PRESENTATION_URL } from './links';

export default function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <Logo height={26} />
          <p className="lp-footer-note">Powered by Particle Network × Magic</p>
          <p className="lp-footer-note">Non-custodial · Your keys, your account.</p>
        </div>

        <div className="lp-footer-col">
          <h4 className="lp-footer-head">Product</h4>
          <div className="lp-footer-grid">
            <a href="#how-it-works" className="lp-footer-link">How it works</a>
            <a href={DEMO_PATH} target="_blank" rel="noopener noreferrer" className="lp-footer-link lp-footer-ext">
              Demo <ExternalIcon size={11} />
            </a>
            <a href="#faq" className="lp-footer-link">FAQ</a>
            <a href={PRESENTATION_URL} target="_blank" rel="noopener noreferrer" className="lp-footer-link lp-footer-ext">
              Presentation <ExternalIcon size={11} />
            </a>
          </div>
        </div>

        <div className="lp-footer-col">
          <h4 className="lp-footer-head">Developers</h4>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="lp-footer-link lp-footer-ext">
            GitHub <ExternalIcon size={11} />
          </a>
        </div>

      </div>

      <div className="lp-footer-bottom">
        <span>© 2026 UniCard</span>
        <span>Built for seamless Web3 experience</span>
      </div>

      <style jsx>{`
        .lp-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          padding: 56px 20px 36px;
          border-top: 1px solid var(--lp-border);
          background: var(--lp-bg);
        }
        .lp-footer-inner {
          display: flex;
          justify-content: space-between;
          gap: 48px;
          width: min(1040px, 100%);
        }
        .lp-footer-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          max-width: 300px;
        }
        .lp-footer-note {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          color: var(--lp-muted);
        }
        .lp-footer-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .lp-footer-grid {
          display: grid;
          grid-template-columns: repeat(2, auto);
          gap: 12px 40px;
        }
        .lp-footer-head {
          margin: 0 0 2px;
          font-size: 14px;
          font-weight: 500;
          color: var(--lp-fg);
        }
        .lp-footer :global(.lp-footer-link) {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: var(--lp-muted);
          text-decoration: none;
        }
        .lp-footer :global(.lp-footer-link:hover) {
          color: var(--lp-fg);
        }
        .lp-footer-bottom {
          display: flex;
          justify-content: space-between;
          width: min(1040px, 100%);
          font-size: 12px;
          color: var(--lp-muted);
        }
        @media (max-width: 767px) {
          .lp-footer-inner {
            flex-direction: column;
            gap: 32px;
          }
          .lp-footer-bottom {
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>
    </footer>
  );
}
