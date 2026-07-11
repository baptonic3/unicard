import { useEffect, useRef } from 'react';

export type TxStep =
  | 'idle'
  | 'building'       // creating transaction
  | 'signing'        // user approves (7702 inline + rootHash)
  | 'routing'        // cross-chain routing in flight
  | 'confirming'     // waiting for Arbitrum settlement
  | 'issuing'        // recording pass on-chain / DB
  | 'done'
  | 'error';

const STEPS: { id: TxStep; label: string; sub: string }[] = [
  { id: 'building',   label: 'Building transaction',     sub: 'Calculating cross-chain route & fees' },
  { id: 'signing',    label: 'Sign to authorize',        sub: 'Approve EIP-7702 delegation & payment' },
  { id: 'routing',    label: 'Routing cross-chain',      sub: 'Particle UA moving funds across chains' },
  { id: 'confirming', label: 'Settling on Arbitrum',     sub: 'Waiting for on-chain confirmation' },
  { id: 'issuing',    label: 'Issuing your pass',        sub: 'Recording access pass on Arbitrum' },
];

const ORDER: TxStep[] = ['building', 'signing', 'routing', 'confirming', 'issuing', 'done'];

function stepIndex(s: TxStep) {
  return ORDER.indexOf(s);
}

interface TransactionStepsProps {
  step: TxStep;
  errorMsg?: string;
  onCancel?: () => void;
}

export default function TransactionSteps({ step, errorMsg, onCancel }: TransactionStepsProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Trap focus inside overlay
  useEffect(() => {
    overlayRef.current?.focus();
  }, [step]);

  if (step === 'idle') return null;

  const currentIdx = stepIndex(step);
  const isDone = step === 'done';
  const isError = step === 'error';

  return (
    <div className="tx-overlay" ref={overlayRef} tabIndex={-1} aria-modal="true" role="dialog">
      <div className="tx-modal glass-card">
        {/* Animated background orb */}
        <div className={`tx-bg-orb ${isDone ? 'orb-done' : isError ? 'orb-error' : 'orb-active'}`} />

        {/* Header */}
        <div className="tx-header">
          {isDone ? (
            <div className="tx-success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#grad-done)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="grad-done" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" />
                <polyline points="8 12 11 15 16 9" />
              </svg>
            </div>
          ) : isError ? (
            <div className="tx-error-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
          ) : (
            <div className="tx-spinner">
              <svg width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="url(#grad-spin)" strokeWidth="3"
                  strokeLinecap="round" strokeDasharray="60 35" />
                <defs>
                  <linearGradient id="grad-spin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}

          <h3 className="tx-title">
            {isDone ? '🎉 Purchase Complete!' : isError ? 'Transaction Failed' : 'Processing Payment'}
          </h3>
          <p className="tx-subtitle">
            {isDone
              ? 'Your access pass is confirmed on Arbitrum One.'
              : isError
              ? errorMsg || 'Something went wrong. Please try again.'
              : 'Please keep this window open…'}
          </p>
        </div>

        {/* Step list */}
        {!isDone && !isError && (
          <div className="tx-steps">
            {STEPS.map((s, i) => {
              const sIdx = stepIndex(s.id);
              const isCurrent = s.id === step;
              const isComplete = currentIdx > sIdx;
              const isPending = currentIdx < sIdx;

              return (
                <div
                  key={s.id}
                  className={`tx-step ${isCurrent ? 'step-current' : isComplete ? 'step-done' : 'step-pending'}`}
                >
                  <div className="step-indicator">
                    {isComplete ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="7 13 10 16 17 9" />
                      </svg>
                    ) : isCurrent ? (
                      <div className="step-dot-pulse" />
                    ) : (
                      <div className="step-dot-idle" />
                    )}
                  </div>
                  <div className="step-text">
                    <span className="step-label">{s.label}</span>
                    {isCurrent && <span className="step-sub">{s.sub}</span>}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`step-connector ${isComplete ? 'connector-done' : 'connector-idle'}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Error retry / cancel */}
        {(isError || (onCancel && !isDone)) && (
          <div className="tx-actions">
            {onCancel && (
              <button className="btn-ghost tx-cancel-btn" onClick={onCancel}>
                {isError ? 'Close' : 'Cancel'}
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .tx-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }
        .tx-modal {
          position: relative;
          width: 100%;
          max-width: 420px;
          padding: 2rem;
          overflow: hidden;
          outline: none;
        }
        .tx-bg-orb {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          filter: blur(50px);
          pointer-events: none;
          transition: background 0.5s;
        }
        .orb-active { background: radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%); }
        .orb-done   { background: radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%); animation: orb-pulse 2s infinite; }
        .orb-error  { background: radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%); }
        @keyframes orb-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .tx-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 1.75rem;
          position: relative;
        }
        .tx-spinner {
          margin-bottom: 1rem;
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .tx-success-icon, .tx-error-icon { margin-bottom: 1rem; }
        .tx-title {
          font-size: 1.125rem;
          font-weight: 800;
          margin-bottom: 0.375rem;
        }
        .tx-subtitle {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        /* Steps */
        .tx-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }
        .tx-step {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.625rem 0;
          position: relative;
        }
        .step-indicator {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .step-dot-pulse {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color-primary);
          box-shadow: 0 0 8px var(--color-primary);
          animation: pulse-glow 1.2s ease-in-out infinite;
        }
        .step-dot-idle {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--glass-border);
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 4px var(--color-primary); }
          50% { box-shadow: 0 0 14px var(--color-primary); }
        }
        .step-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .step-label {
          font-size: 0.875rem;
          font-weight: 600;
        }
        .step-sub {
          font-size: 0.75rem;
          color: var(--text-secondary);
          animation: fade-in 0.3s ease;
        }
        @keyframes fade-in { from { opacity: 0; transform: translateY(2px); } }
        .step-current .step-label { color: var(--text-primary); }
        .step-done    .step-label { color: var(--color-success); }
        .step-pending .step-label { color: var(--text-muted); }
        .step-connector {
          position: absolute;
          left: 10px;
          top: calc(22px + 0.625rem);
          bottom: -0.625rem;
          width: 2px;
          border-radius: 1px;
        }
        .connector-done { background: var(--color-success); }
        .connector-idle { background: var(--glass-border); }
        /* Actions */
        .tx-actions {
          display: flex;
          justify-content: center;
          margin-top: 1.25rem;
        }
        .tx-cancel-btn {
          font-size: 0.875rem;
          padding: 0.5rem 1.5rem;
          border-radius: 10px;
          border: 1px solid var(--glass-border);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .tx-cancel-btn:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
