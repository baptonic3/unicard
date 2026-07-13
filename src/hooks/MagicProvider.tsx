import { EVMExtension } from '@magic-ext/evm';
import { OAuthExtension } from '@magic-ext/oauth2';
import { Magic as MagicBase } from 'magic-sdk';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState, Dispatch, SetStateAction } from 'react';
import { getToken } from '@/utils/common';

export type Magic = MagicBase<[EVMExtension, OAuthExtension]>;

type MagicContextType = {
  magic: Magic | null;
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
  token: '',
  setToken: () => {},
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: ReactNode }) => {
  const [magic, setMagic] = useState<Magic | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(getToken());
  }, []);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
      const magic = new MagicBase(process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, {
        extensions: [
          new EVMExtension([
            // Arbitrum One — the delegation and settlement chain
            {
              rpcUrl: process.env.NEXT_PUBLIC_ARB_RPC_URL || 'https://arb1.arbitrum.io/rpc',
              chainId: 42161,
              default: true,
            },
          ]),
          new OAuthExtension(),
        ],
      });

      setMagic(magic);
    }
  }, []);

  const value = useMemo(() => ({ magic, token, setToken }), [magic, token]);

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
