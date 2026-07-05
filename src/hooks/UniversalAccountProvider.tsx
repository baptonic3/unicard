import {
  UniversalAccount,
  UNIVERSAL_ACCOUNT_VERSION,
  type IAssetsResponse,
} from '@particle-network/universal-account-sdk';
import { BrowserProvider, getBytes, Signature } from 'ethers';
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMagic } from './MagicProvider';

// UniCard settles on Arbitrum One
const ARBITRUM_CHAIN_ID = 42161;

// EIP-7702: zero address clears delegation (reverts to plain EOA)
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

type AccountInfo = {
  ownerAddress: string;
  evmSmartAccount: string;
  solanaSmartAccount: string;
};

type UAContextType = {
  universalAccount: UniversalAccount | null;
  accountInfo: AccountInfo;
  primaryAssets: IAssetsResponse | null;
  isDelegated: boolean;
  refreshBalance: () => Promise<void>;
  ensureDelegated: () => Promise<void>;
  undelegate: () => Promise<void>;
  signAndSend: (transaction: { rootHash: string } & Record<string, any>) => Promise<{ transactionId: string }>;
  loading: boolean;
};

const UAContext = createContext<UAContextType>({
  universalAccount: null,
  accountInfo: { ownerAddress: '', evmSmartAccount: '', solanaSmartAccount: '' },
  primaryAssets: null,
  isDelegated: false,
  refreshBalance: async () => {},
  ensureDelegated: async () => {},
  undelegate: async () => {},
  signAndSend: async () => ({ transactionId: '' }),
  loading: false,
});

export const useUniversalAccount = () => useContext(UAContext);

export const UniversalAccountProvider = ({ children }: { children: ReactNode }) => {
  const { magic } = useMagic();
  const [universalAccount, setUniversalAccount] = useState<UniversalAccount | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    ownerAddress: '',
    evmSmartAccount: '',
    solanaSmartAccount: '',
  });
  const [primaryAssets, setPrimaryAssets] = useState<IAssetsResponse | null>(null);
  const [isDelegated, setIsDelegated] = useState(false);
  const [loading, setLoading] = useState(false);

  const userAddress = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

  // Initialize UA when user logs in
  useEffect(() => {
    if (!userAddress) {
      setUniversalAccount(null);
      return;
    }

    console.log('🔷 Initializing Universal Account for:', userAddress);

    const ua = new UniversalAccount({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
      projectClientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
      projectAppUuid: process.env.NEXT_PUBLIC_APP_ID!,
      smartAccountOptions: {
        useEIP7702: true,
        name: 'UNIVERSAL',
        version: UNIVERSAL_ACCOUNT_VERSION,
        ownerAddress: userAddress,
      },
      tradeConfig: {
        slippageBps: 100, // 1% slippage tolerance
      },
    });

    setUniversalAccount(ua);
  }, [userAddress]);

  // Check delegation status on Arbitrum
  const refreshDelegationStatus = useCallback(async () => {
    if (!universalAccount) return;
    try {
      const deployments = await universalAccount.getEIP7702Deployments();
      const arb = deployments.find((d: any) => d.chainId === ARBITRUM_CHAIN_ID);
      const delegated = (arb as any)?.isDelegated ?? false;
      setIsDelegated(delegated);
      console.log('🔷 Delegation status on Arbitrum:', delegated ? '✅ Active' : '❌ Not delegated');
    } catch (err) {
      console.error('Failed to check delegation status:', err);
    }
  }, [universalAccount]);

  // Fetch account data on init
  useEffect(() => {
    if (!universalAccount || !userAddress) return;

    const fetchAccountData = async () => {
      setLoading(true);
      try {
        const options = await universalAccount.getSmartAccountOptions();
        setAccountInfo({
          ownerAddress: userAddress,
          evmSmartAccount: options.smartAccountAddress || '',
          solanaSmartAccount: options.solanaSmartAccountAddress || '',
        });
        console.log('🔷 UA Smart Account:', options.smartAccountAddress);

        await refreshDelegationStatus();

        const assets = await universalAccount.getPrimaryAssets();
        setPrimaryAssets(assets);
        console.log('🔷 Primary Assets:', assets);
      } catch (err) {
        console.error('Failed to fetch UA data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [universalAccount, userAddress, refreshDelegationStatus]);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!universalAccount) return;
    try {
      const assets = await universalAccount.getPrimaryAssets();
      setPrimaryAssets(assets);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  }, [universalAccount]);

  // Sign EIP-7702 authorization via Magic
  const signEip7702Auth = useCallback(
    async (contractAddress: string, chainId: number, nonce?: number) => {
      if (!magic) throw new Error('Magic not ready');
      return magic.wallet.sign7702Authorization({
        contractAddress,
        chainId,
        ...(nonce !== undefined && { nonce }),
      });
    },
    [magic],
  );

  // Submit a Type-4 (EIP-7702) delegation tx on Arbitrum
  const submit7702Delegation = useCallback(
    async (resolveTarget: (auth: any) => string) => {
      if (!universalAccount || !magic || !userAddress) {
        throw new Error('Universal Account or wallet not ready');
      }

      console.log('🔷 Switching Magic to Arbitrum...');
      await magic.evm.switchChain(ARBITRUM_CHAIN_ID);

      const [auth] = await universalAccount.getEIP7702Auth([ARBITRUM_CHAIN_ID]);
      console.log('🔷 Got EIP-7702 auth params:', auth);

      const authorization = await signEip7702Auth(
        resolveTarget(auth),
        ARBITRUM_CHAIN_ID,
        auth.nonce + 1 // EOA sends its own tx, so nonce + 1
      );
      console.log('🔷 Signed 7702 authorization');

      await magic.wallet.send7702Transaction({
        to: userAddress,
        data: '0x',
        authorizationList: [authorization],
      });
      console.log('🔷 Type-4 delegation tx sent!');

      await refreshDelegationStatus();
    },
    [universalAccount, magic, userAddress, signEip7702Auth, refreshDelegationStatus],
  );

  // Pre-delegate EOA on Arbitrum → upgrade to Universal Account
  const ensureDelegated = useCallback(async () => {
    if (!universalAccount) {
      throw new Error('Universal Account not ready');
    }

    const deployments = await universalAccount.getEIP7702Deployments();
    const arb = deployments.find((d: any) => d.chainId === ARBITRUM_CHAIN_ID);
    if (!arb || (arb as any).isDelegated) {
      await refreshDelegationStatus();
      return; // Already delegated
    }

    console.log('🔷 Delegating EOA on Arbitrum...');
    await submit7702Delegation((auth) => auth.address);
  }, [universalAccount, refreshDelegationStatus, submit7702Delegation]);

  // Revert EOA on Arbitrum to plain EOA (delegate to zero address)
  const undelegate = useCallback(async () => {
    if (!universalAccount) {
      throw new Error('Universal Account not ready');
    }

    const deployments = await universalAccount.getEIP7702Deployments();
    const arb = deployments.find((d: any) => d.chainId === ARBITRUM_CHAIN_ID);
    if (!arb || !(arb as any).isDelegated) {
      await refreshDelegationStatus();
      return; // Already not delegated
    }

    console.log('🔷 Undelegating EOA on Arbitrum...');
    await submit7702Delegation(() => ZERO_ADDRESS);
  }, [universalAccount, refreshDelegationStatus, submit7702Delegation]);

  // Sign rootHash + handle inline 7702 authorizations + broadcast
  const signAndSend = useCallback(
    async (transaction: { rootHash: string; userOps?: any[] } & Record<string, any>) => {
      if (!universalAccount || !magic || !userAddress) {
        throw new Error('Universal Account or wallet not ready');
      }

      // Handle inline 7702 auth for any undelegated chains
      type EIP7702Authorization = { userOpHash: string; signature: string };
      const authorizations: EIP7702Authorization[] = [];
      const nonceMap = new Map<number, string>();

      if (transaction.userOps) {
        for (const userOp of transaction.userOps) {
          if (userOp.eip7702Auth && !userOp.eip7702Delegated) {
            let signatureSerialized = nonceMap.get(userOp.eip7702Auth.nonce);

            if (!signatureSerialized) {
              const authorization = await signEip7702Auth(
                userOp.eip7702Auth.address,
                userOp.eip7702Auth.chainId || userOp.chainId,
                userOp.eip7702Auth.nonce,
              );

              const sig = Signature.from({
                r: authorization.r,
                s: authorization.s,
                v: authorization.v,
              });
              signatureSerialized = sig.serialized;
              nonceMap.set(userOp.eip7702Auth.nonce, signatureSerialized);
            }

            if (signatureSerialized) {
              authorizations.push({
                userOpHash: userOp.userOpHash,
                signature: signatureSerialized,
              });
            }
          }
        }
      }

      // Sign the rootHash with Magic's BrowserProvider
      const provider = new BrowserProvider((magic as any).rpcProvider);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(getBytes(transaction.rootHash));

      console.log('🔷 Sending transaction via UA SDK...');
      const result = await universalAccount.sendTransaction(
        transaction as any,
        signature,
        authorizations.length > 0 ? authorizations : undefined,
      );

      console.log('🔷 Transaction sent! ID:', result.transactionId);
      return result;
    },
    [universalAccount, magic, userAddress, signEip7702Auth],
  );

  const value = useMemo(
    () => ({
      universalAccount,
      accountInfo,
      primaryAssets,
      isDelegated,
      refreshBalance,
      ensureDelegated,
      undelegate,
      signAndSend,
      loading,
    }),
    [universalAccount, accountInfo, primaryAssets, isDelegated, refreshBalance, ensureDelegated, undelegate, signAndSend, loading],
  );

  return <UAContext.Provider value={value}>{children}</UAContext.Provider>;
};
