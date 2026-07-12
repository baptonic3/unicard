import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import MagicProvider from '@/hooks/MagicProvider';
import { useMagic } from '@/hooks/MagicProvider';
import { UniversalAccountProvider } from '@/hooks/UniversalAccountProvider';
import Header from '@/components/Header';

// Inner component so it can consume MagicContext (token/setToken)
function AppInner({ Component, pageProps }: AppProps) {
  const { token, setToken } = useMagic();
  return (
    <UniversalAccountProvider>
      {/* <Header token={token} setToken={setToken} /> */}
      <Component {...pageProps} token={token} setToken={setToken} />
    </UniversalAccountProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <MagicProvider>
      <AppInner {...props} />
    </MagicProvider>
  );
}
