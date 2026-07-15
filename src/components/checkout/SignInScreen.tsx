import { ReactNode } from 'react';
import Logo from '../landing/Logo';

/**
 * Logged-out checkout layout: a dimmed, shimmering wallet skeleton behind a
 * scrim, with the sign-in modal (passed as children) on top. Centered dialog
 * on desktop; bottom sheet on mobile. Shared by the real checkout page and the
 * design-preview route so the two never drift.
 */
export default function SignInScreen({ children }: { children: ReactNode }) {
  return (
    <div className="sis">
      <div className="sis-backdrop" aria-hidden="true">
        <header className="sis-nav">
          <Logo height={28} />
          <nav className="sis-nav-links">
            <span className="sis-pill">Wallet</span>
            <span>Transactions history</span>
            <span>Settings</span>
            <span>Docs</span>
          </nav>
          <div className="sis-nav-sk">
            <span className="sis-sk" style={{ width: 140 }} />
            <span className="sis-sk" style={{ width: 100 }} />
            <span className="sis-sk sis-sk-round" />
          </div>
        </header>

        <div className="sis-body">
          <span className="sis-sk" style={{ width: 210, height: 26 }} />
          <span className="sis-sk" style={{ width: 140, height: 12, marginTop: 12 }} />
          <div className="sis-card">
            <div className="sis-card-thumb" />
            <div className="sis-card-lines">
              <span className="sis-sk" style={{ width: 120, height: 12 }} />
              <span className="sis-sk" style={{ width: 260, height: 30, marginTop: 12 }} />
              <span className="sis-sk" style={{ width: 200, height: 12, marginTop: 12 }} />
            </div>
          </div>

          {/* form / top-up section */}
          <div className="sis-block">
            <div className="sis-block-col">
              <span className="sis-sk" style={{ width: 110, height: 12 }} />
              <span className="sis-sk" style={{ width: 200, height: 34 }} />
              <span className="sis-sk" style={{ width: 90, height: 12 }} />
            </div>
            <div className="sis-block-actions">
              <span className="sis-sk" style={{ width: 116, height: 40 }} />
              <span className="sis-sk" style={{ width: 100, height: 40 }} />
            </div>
          </div>

          {/* transactions list */}
          <div className="sis-block sis-block-list">
            <span className="sis-sk" style={{ width: 130, height: 14 }} />
            {[
              { line1: 200, line2: 120 },
              { line1: 160, line2: 100 },
            ].map((row, i) => (
              <div className="sis-row" key={i}>
                <span className="sis-sk sis-sk-round" style={{ width: 26, height: 26 }} />
                <div className="sis-row-lines">
                  <span className="sis-sk" style={{ width: row.line1, height: 11 }} />
                  <span className="sis-sk" style={{ width: row.line2, height: 9 }} />
                </div>
                <span className="sis-sk" style={{ width: 54, height: 11 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sis-scrim">{children}</div>

      <style jsx>{`
        .sis {
          position: relative;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #fafafa;
          overflow: hidden;
        }
        .sis-backdrop {
          position: absolute;
          inset: 0;
        }
        .sis-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          padding: 0 40px;
          background: #fff;
          border-bottom: 1px solid #ececef;
        }
        .sis-nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 14px;
          color: #71717b;
        }
        .sis-pill {
          padding: 6px 14px;
          border-radius: 999px;
          background: #f4f4f5;
          color: #0e0e0e;
        }
        .sis-nav-sk {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sis-sk {
          display: block;
          height: 28px;
          border-radius: 8px;
          background: linear-gradient(100deg, #ececef 30%, #f6f6f7 48%, #ececef 66%);
          background-size: 300% 100%;
          animation: sis-shimmer 1.6s ease-in-out infinite;
        }
        @keyframes sis-shimmer {
          0% {
            background-position: 150% 0;
          }
          100% {
            background-position: -50% 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sis-sk {
            animation: none;
            background: #ececef;
          }
        }
        .sis-sk-round {
          width: 28px;
          height: 28px;
          border-radius: 999px;
        }
        .sis-body {
          display: flex;
          flex-direction: column;
          padding: 40px;
          max-width: 1040px;
          margin: 0 auto;
        }
        .sis-card {
          display: flex;
          gap: 24px;
          padding: 24px;
          margin-top: 24px;
          background: #fff;
          border: 1px solid #ececef;
          border-radius: 16px;
        }
        .sis-card-thumb {
          width: 220px;
          height: 220px;
          border-radius: 12px;
          background: linear-gradient(135deg, #081712 0%, #0e2b20 55%, #063a2b 100%);
          flex-shrink: 0;
        }
        .sis-card-lines {
          display: flex;
          flex-direction: column;
        }
        .sis-block {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-top: 24px;
          padding: 28px;
          background: #fff;
          border: 1px solid #ececef;
          border-radius: 16px;
        }
        .sis-block-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .sis-block-actions {
          display: flex;
          gap: 12px;
        }
        .sis-block-list {
          flex-direction: column;
          gap: 20px;
        }
        .sis-row {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
        }
        .sis-row-lines {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 6px;
        }
        .sis-scrim {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(9, 9, 11, 0.55);
        }
        @media (max-width: 767px) {
          .sis-nav {
            padding: 0 20px;
          }
          .sis-nav-links {
            display: none;
          }
          .sis-body {
            padding: 20px;
          }
          .sis-card-thumb {
            width: 84px;
            height: 84px;
          }
          .sis-scrim {
            align-items: flex-end;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
