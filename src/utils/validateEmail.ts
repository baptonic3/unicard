// Standard-ish email shape check — intentionally permissive (matches the
// pattern used by most inline-validation references: catch obvious mistakes,
// don't reject valid-but-unusual addresses).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type EmailError = null | 'empty' | 'invalid';

export function validateEmail(value: string): EmailError {
  const trimmed = value.trim();
  if (!trimmed) return 'empty';
  if (!EMAIL_RE.test(trimmed)) return 'invalid';
  return null;
}

export const EMAIL_ERROR_COPY: Record<Exclude<EmailError, null>, string> = {
  empty: 'Enter your email to continue.',
  invalid: 'Enter a valid email address.',
};
