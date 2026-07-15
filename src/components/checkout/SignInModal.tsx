import { useEffect, useId, useState } from 'react';
import Logo from '../landing/Logo';

function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Standard-ish email shape check — intentionally permissive (matches the
// pattern used by most inline-validation references: catch obvious mistakes,
// don't reject valid-but-unusual addresses).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EmailError = null | 'empty' | 'invalid';

function validateEmail(value: string): EmailError {
  const trimmed = value.trim();
  if (!trimmed) return 'empty';
  if (!EMAIL_RE.test(trimmed)) return 'invalid';
  return null;
}

const EMAIL_ERROR_COPY: Record<Exclude<EmailError, null>, string> = {
  empty: 'Enter your email to continue.',
  invalid: 'Enter a valid email address.',
};

interface SignInModalProps {
  /** From the checkout session's item — kept in sync with the purchase page. */
  itemTitle: string;
  itemDescription?: string;
  total: string; // e.g. "$5.20"
  thumbnailSrc?: string;
  /** Epoch ms when the reservation lapses — drives the live countdown. */
  expiresAt?: number;
  /** Force the expired state regardless of the countdown (e.g. server already knows). */
  expired?: boolean;
  /** Where "start over" sends the buyer (the merchant/event checkout page). */
  eventUrl?: string;
  /** Called with the validated email when the buyer submits. */
  onSubmit?: (email: string) => void | Promise<void>;
  /** Called when the buyer chooses Google sign-in. */
  onGoogleSignIn?: () => void | Promise<void>;
  /** True while the async sign-in (Magic OTP) is in flight. */
  submitting?: boolean;
  /** Error surfaced from the sign-in attempt (e.g. Magic failure). */
  submitError?: string | null;
}

/**
 * Sign-in-to-purchase modal (logged-out checkout).
 * Renders as a centered dialog on desktop and a bottom sheet on mobile.
 * Order per design: logo → title/subtitle → event summary card → email → pay → footer.
 * When `expired`, the hold has lapsed: the pay CTA is disabled and a recovery
 * notice guides the buyer back to the event page to start checkout again.
 */
export default function SignInModal({
  itemTitle,
  itemDescription,
  total,
  thumbnailSrc,
  expiresAt,
  expired = false,
  eventUrl = '#',
  onSubmit,
  onGoogleSignIn,
  submitting = false,
  submitError = null,
}: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const errorId = useId();

  // Live countdown. `now` stays null until mount so server and first client
  // render match (no hydration mismatch); the interval then ticks each second.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (expiresAt == null) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const secondsLeft =
    expiresAt != null && now != null ? Math.max(0, Math.floor((expiresAt - now) / 1000)) : null;
  const isExpired = expired || secondsLeft === 0;
  const statusText =
    secondsLeft != null ? `Pending payment · ${formatCountdown(secondsLeft)} left` : 'Pending payment';

  // Only surface an error once the buyer has interacted with the field —
  // either by leaving it (blur) or by trying to submit.
  const error = touched || submitAttempted ? validateEmail(email) : null;

  const handleSubmit = () => {
    const result = validateEmail(email);
    setSubmitAttempted(true);
    if (result) return;
    onSubmit?.(email.trim());
  };

  return (
    <div className="ci-modal" role="dialog" aria-modal="true" aria-label="Sign in to complete your purchase">
      <span className="ci-grabber" aria-hidden="true" />
      <Logo height={38} />

      <div className="ci-content">
        <div className="ci-head">
          <h2 className="ci-title">
            {isExpired ? 'Your reservation expired' : 'Sign in to complete your purchase'}
          </h2>
          <p className="ci-sub">
            {isExpired ? (
              'It was held for a limited time and has now expired.'
            ) : (
              <>
                Use your email — no wallet or seed phrase needed. <span className="ci-accent">UniCard</span> creates one
                for you.
              </>
            )}
          </p>
        </div>

        <div className={`ci-summary${isExpired ? ' is-expired' : ''}`}>
          <div
            className="ci-thumb"
            style={thumbnailSrc ? { backgroundImage: `url(${thumbnailSrc})` } : undefined}
            aria-hidden="true"
          />
          <div className="ci-mid">
            <p className={isExpired ? 'ci-status-expired' : 'ci-status'}>
              {isExpired ? 'Reservation expired' : statusText}
            </p>
            <p className="ci-event">{itemTitle}</p>
            {itemDescription && <p className="ci-meta">{itemDescription}</p>}
          </div>
          <div className="ci-total">
            <p className="ci-total-label">Total</p>
            <p className="ci-total-value">{total}</p>
          </div>
        </div>

        {isExpired ? (
          <>
            <div className="ci-notice" role="alert">
              <span className="ci-notice-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="16.5" r="1.1" fill="currentColor" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <p className="ci-notice-text">
                Reservations are held for a limited time and can't be extended. No charge was made — to continue, go back
                to the purchase page and start checkout again.
              </p>
            </div>

            <button type="button" className="ci-pay" disabled aria-disabled="true">
              Reservation expired
            </button>

            <a className="ci-recover" href={eventUrl}>
              ← Back to the purchase page to start over
            </a>
          </>
        ) : (
          <>
            <div className="ci-field">
              <label className={`ci-input${error || submitError ? ' has-error' : ''}`}>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  aria-invalid={error || submitError ? 'true' : 'false'}
                  aria-describedby={error || submitError ? errorId : undefined}
                  value={email}
                  disabled={submitting}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // Clear a stale error the moment the buyer starts fixing it.
                    if (submitAttempted) setSubmitAttempted(false);
                  }}
                  onBlur={() => setTouched(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit();
                  }}
                />
              </label>
              {(error || submitError) && (
                <p className="ci-field-error" id={errorId} role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 7.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="1" fill="currentColor" />
                  </svg>
                  {error ? EMAIL_ERROR_COPY[error] : submitError}
                </p>
              )}
            </div>

            <button
              type="button"
              className={`ci-pay${submitting ? ' is-loading' : ''}`}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="ci-spinner" aria-hidden="true" />
                  Sending code…
                </>
              ) : (
                'Sign in with Email'
              )}
            </button>

            <div className="ci-or">
              <span className="ci-or-line" />
              <span className="ci-or-text">or</span>
              <span className="ci-or-line" />
            </div>

            <button
              type="button"
              className="ci-google"
              onClick={onGoogleSignIn}
              disabled={submitting}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <span className="ci-divider" aria-hidden="true" />
        <p className="ci-footer">
          Powered by <span className="ci-accent">Magic</span> × <span className="ci-accent">Particle Network</span>
        </p>
      </div>

      <style jsx>{`
        .ci-modal {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          width: 424px;
          max-width: 100%;
          padding: 28px 28px 26px;
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 24px;
          box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.28);
        }
        .ci-grabber {
          display: none;
        }
        .ci-content {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 16px;
          width: 100%;
        }
        .ci-head {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: center;
        }
        .ci-title {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
          line-height: 1.25;
          color: #0e0e0e;
        }
        .ci-sub {
          margin: 0;
          font-size: 14px;
          line-height: 1.45;
          color: #71717b;
        }
        .ci-accent {
          color: #0fa97d;
        }
        .ci-summary {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px 14px 14px 12px;
          background: #f4f4f5;
          border-radius: 16px;
        }
        .ci-thumb {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background-color: #1b2b26;
          background-image: linear-gradient(135deg, #081712 0%, #0e2b20 55%, #063a2b 100%);
          background-size: cover;
          background-position: center;
        }
        .ci-mid {
          display: flex;
          flex: 1 0 0;
          min-width: 0;
          flex-direction: column;
          gap: 6px;
          overflow: hidden;
        }
        .ci-status {
          margin: 0;
          font-size: 11px;
          font-weight: 500;
          color: #0fa97d;
          white-space: nowrap;
        }
        .ci-status-expired {
          margin: 0;
          font-size: 11px;
          font-weight: 600;
          color: #e5484d;
          white-space: nowrap;
        }
        .ci-summary.is-expired {
          opacity: 0.75;
        }
        .ci-event {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.2;
          color: #0e0e0e;
        }
        .ci-meta {
          margin: 0;
          font-size: 12px;
          line-height: 1.35;
          color: #71717b;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .ci-total {
          display: flex;
          flex-shrink: 0;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          text-align: right;
          white-space: nowrap;
        }
        .ci-total-label {
          margin: 0;
          font-size: 11px;
          font-weight: 500;
          color: #71717b;
        }
        .ci-total-value {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #0e0e0e;
        }
        .ci-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }
        .ci-input {
          display: flex;
          align-items: center;
          height: 50px;
          padding: 0 16px;
          background: #fff;
          border: 1px solid #e4e4e7;
          border-radius: 12px;
          transition: border-color 0.15s ease;
        }
        .ci-input.has-error {
          border-color: #e5484d;
        }
        .ci-input input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-family: inherit;
          font-size: 15px;
          color: #0e0e0e;
        }
        .ci-input input::placeholder {
          color: #a1a1aa;
        }
        .ci-field-error {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
          font-size: 12.5px;
          line-height: 1.3;
          color: #e5484d;
        }
        .ci-field-error svg {
          flex-shrink: 0;
        }
        .ci-pay {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 50px;
          width: 100%;
          border: none;
          border-radius: 12px;
          background: #00f3ab;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          color: #062018;
          cursor: pointer;
          transition: filter 0.15s ease;
        }
        .ci-pay:hover {
          filter: brightness(0.96);
        }
        .ci-pay:disabled {
          background: #e4e4e7;
          color: #a1a1aa;
          cursor: not-allowed;
          filter: none;
        }
        /* keep the mint look while the OTP request is in flight */
        .ci-pay.is-loading:disabled {
          background: #00f3ab;
          color: #062018;
          cursor: progress;
          opacity: 0.85;
        }
        .ci-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(6, 32, 24, 0.25);
          border-top-color: #062018;
          border-radius: 50%;
          animation: ci-spin 0.7s linear infinite;
        }
        @keyframes ci-spin {
          to {
            transform: rotate(360deg);
          }
        }
        .ci-or {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }
        .ci-or-line {
          flex: 1;
          height: 1px;
          background: #e4e4e7;
        }
        .ci-or-text {
          font-size: 13px;
          color: #71717b;
        }
        .ci-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 48px;
          width: 100%;
          border: 1px solid #e4e4e7;
          border-radius: 12px;
          background: #fff;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          color: #0e0e0e;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .ci-google:hover {
          background: #fafafa;
        }
        .ci-google:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .ci-notice {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 12px 14px;
          background: #fef2f2;
          border: 1px solid #f7d4d4;
          border-radius: 12px;
        }
        .ci-notice-icon {
          flex-shrink: 0;
          color: #e5484d;
          margin-top: 1px;
        }
        .ci-notice-text {
          margin: 0;
          font-size: 13px;
          line-height: 1.45;
          color: #7a2e2e;
        }
        .ci-recover {
          display: block;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: #0fa97d;
          text-decoration: none;
        }
        .ci-recover:hover {
          text-decoration: underline;
        }
        .ci-divider {
          height: 1px;
          width: 100%;
          background: #e4e4e7;
        }
        .ci-footer {
          margin: 0;
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          color: #71717b;
        }

        @media (max-width: 767px) {
          .ci-modal {
            width: 100%;
            gap: 20px;
            padding: 14px 20px 24px;
            border: none;
            border-radius: 24px 24px 0 0;
          }
          .ci-grabber {
            display: block;
            width: 40px;
            height: 4px;
            border-radius: 999px;
            background: #e4e4e7;
          }
        }
      `}</style>
    </div>
  );
}
