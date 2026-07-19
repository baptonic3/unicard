import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

// Load SDK-heavy providers client-side only to prevent ERR_REQUIRE_ESM
// from @particle-network/universal-account-sdk during SSR on Vercel.
const Providers = dynamic(() => import('@/components/Providers'), { ssr: false });

export default function App(props: AppProps) {
  return <Providers {...props} />;
}
