// Client-only wrapper around all SDK-heavy providers.
// Loaded via dynamic(..., { ssr: false }) in _app.tsx so that
// @particle-network/universal-account-sdk (ESM-only) never enters
// the server-side bundle and triggers ERR_REQUIRE_ESM on Vercel.
import type { AppProps } from 'next/app';
import MagicProvider from '@/hooks/MagicProvider';
import { useMagic } from '@/hooks/MagicProvider';
import { UniversalAccountProvider } from '@/hooks/UniversalAccountProvider';

function ProvidersInner({ Component, pageProps, ...rest }: AppProps) {
  const { token, setToken } = useMagic();
  return (
    <UniversalAccountProvider>
      <Component {...pageProps} token={token} setToken={setToken} />
    </UniversalAccountProvider>
  );
}

export default function Providers(props: AppProps) {
  return (
    <MagicProvider>
      <ProvidersInner {...props} />
    </MagicProvider>
  );
}
