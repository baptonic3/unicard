import { EVMExtension } from '@magic-ext/evm';
import { Magic as MagicBase } from 'magic-sdk';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Magic = MagicBase<[EVMExtension]>;

type MagicContextType = {
  magic: Magic | null;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: ReactNode }) => {
  const [magic, setMagic] = useState<Magic | null>(null);

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
        ],
      });

      setMagic(magic);
    }
  }, []);

  const value = useMemo(() => ({ magic }), [magic]);

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
