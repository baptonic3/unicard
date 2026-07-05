import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import MagicProvider from '@/hooks/MagicProvider';
import { UniversalAccountProvider } from '@/hooks/UniversalAccountProvider';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { getToken } from '@/utils/common';

export default function App({ Component, pageProps }: AppProps) {
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(getToken());
  }, []);

  return (
    <MagicProvider>
      <UniversalAccountProvider>
        <Header token={token} setToken={setToken} />
        <Component {...pageProps} token={token} setToken={setToken} />
      </UniversalAccountProvider>
    </MagicProvider>
  );
}
