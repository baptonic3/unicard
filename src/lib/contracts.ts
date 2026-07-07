import { Contract, JsonRpcProvider, Wallet, ethers } from 'ethers';

// ═══════════════════════════════════════════════════
// UniCardAccess — Contract Integration
// ═══════════════════════════════════════════════════
// Deployed on Arbitrum One (42161)

export const ARBITRUM_CHAIN_ID = 42161;
export const USDC_ARBITRUM_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

// Contract address 
export const getContractAddress = (): string => {
  const addr = process.env.NEXT_PUBLIC_ACCESS_PASS_CONTRACT;
  if (!addr) throw new Error('NEXT_PUBLIC_ACCESS_PASS_CONTRACT not set in .env');
  return addr;
};

// ABI 
export const UNICARD_ACCESS_ABI = [
  // ---- Write Functions ----
  {
    type: 'function',
    name: 'createAccessItem',
    inputs: [
      { name: 'metadataURI', type: 'string' },
      { name: 'priceUSDC6', type: 'uint256' },
      { name: 'maxSupply', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'issuePass',
    inputs: [
      { name: 'itemId', type: 'uint256' },
      { name: 'buyer', type: 'address' },
      { name: 'particleTxId', type: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'usePass',
    inputs: [{ name: 'passId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'deactivateItem',
    inputs: [{ name: 'itemId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },

  // ---- Read Functions ----
  {
    type: 'function',
    name: 'items',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'creator', type: 'address' },
      { name: 'metadataURI', type: 'string' },
      { name: 'priceUSDC6', type: 'uint256' },
      { name: 'maxSupply', type: 'uint256' },
      { name: 'currentSupply', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'passes',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'itemId', type: 'uint256' },
      { name: 'buyer', type: 'address' },
      { name: 'particleTxId', type: 'string' },
      { name: 'issuedAt', type: 'uint256' },
      { name: 'used', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasPass',
    inputs: [
      { name: 'buyer', type: 'address' },
      { name: 'itemId', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPassByBuyerItem',
    inputs: [
      { name: 'buyer', type: 'address' },
      { name: 'itemId', type: 'uint256' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'itemId', type: 'uint256' },
          { name: 'buyer', type: 'address' },
          { name: 'particleTxId', type: 'string' },
          { name: 'issuedAt', type: 'uint256' },
          { name: 'used', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nextItemId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nextPassId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },

  // ---- Events ----
  {
    type: 'event',
    name: 'AccessItemCreated',
    inputs: [
      { name: 'itemId', type: 'uint256', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'metadataURI', type: 'string', indexed: false },
      { name: 'priceUSDC6', type: 'uint256', indexed: false },
      { name: 'maxSupply', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'PassIssued',
    inputs: [
      { name: 'passId', type: 'uint256', indexed: true },
      { name: 'itemId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'particleTxId', type: 'string', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'PassUsed',
    inputs: [{ name: 'passId', type: 'uint256', indexed: true }],
  },
  {
    type: 'event',
    name: 'ItemDeactivated',
    inputs: [{ name: 'itemId', type: 'uint256', indexed: true }],
  },

  // ---- Custom Errors ----
  { type: 'error', name: 'NotOwner', inputs: [] },
  { type: 'error', name: 'ItemNotActive', inputs: [] },
  { type: 'error', name: 'SupplyMaxedOut', inputs: [] },
  { type: 'error', name: 'PassAlreadyIssued', inputs: [] },
  { type: 'error', name: 'PassAlreadyUsed', inputs: [] },
  { type: 'error', name: 'PassDoesNotExist', inputs: [] },
] as const;

// ═══════════════════════════════════════════════════
// Contract Helpers
// ═══════════════════════════════════════════════════

/** Read-only provider for Arbitrum */
export function getArbProvider(): JsonRpcProvider {
  return new JsonRpcProvider(
    process.env.NEXT_PUBLIC_ARB_RPC_URL || 'https://arb1.arbitrum.io/rpc',
  );
}

/** Read-only contract instance */
export function getReadContract(): Contract {
  return new Contract(getContractAddress(), UNICARD_ACCESS_ABI, getArbProvider());
}

/** Write contract instance (server-side only — requires DEPLOYER_PRIVATE_KEY) */
export function getWriteContract(): Contract {
  const pk = process.env.DEPLOYER_PRIVATE_KEY;
  if (!pk) throw new Error('DEPLOYER_PRIVATE_KEY not set');
  const wallet = new Wallet(pk, getArbProvider());
  return new Contract(getContractAddress(), UNICARD_ACCESS_ABI, wallet);
}

/** Issue a pass on Arbitrum after Particle payment is confirmed */
export async function issuePassOnChain(
  itemId: number,
  buyer: string,
  particleTxId: string,
): Promise<{ txHash: string; passId: number }> {
  const contract = getWriteContract();
  const tx = await contract.issuePass(itemId, buyer, particleTxId);
  const receipt = await tx.wait();

  // Parse PassIssued event from receipt
  const iface = new ethers.Interface(UNICARD_ACCESS_ABI);
  const passIssuedLog = receipt.logs
    .map((log: any) => {
      try {
        return iface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((parsed: any) => parsed?.name === 'PassIssued');

  const passId = passIssuedLog ? Number(passIssuedLog.args.passId) : -1;

  return { txHash: receipt.hash, passId };
}

/** Check if a buyer already has a pass for an item */
export async function checkHasPass(buyer: string, itemId: number): Promise<boolean> {
  const contract = getReadContract();
  return contract.hasPass(buyer, itemId);
}

/** Get item details from on-chain */
export async function getItemOnChain(itemId: number) {
  const contract = getReadContract();
  const [creator, metadataURI, priceUSDC6, maxSupply, currentSupply, active] = await contract.items(itemId);
  return {
    itemId,
    creator,
    metadataURI,
    priceUSDC6: Number(priceUSDC6),
    priceUSD: Number(priceUSDC6) / 1_000000,
    maxSupply: Number(maxSupply),
    currentSupply: Number(currentSupply),
    remainingSupply: Number(maxSupply) - Number(currentSupply),
    active,
  };
}

// ═══════════════════════════════════════════════════
// External Links
// ═══════════════════════════════════════════════════

export function arbiscanTxUrl(txHash: string): string {
  return `https://arbiscan.io/tx/${txHash}`;
}

export function arbiscanContractUrl(): string {
  return `https://arbiscan.io/address/${getContractAddress()}`;
}

export function universalXActivityUrl(particleTxId: string): string {
  return `https://universalx.app/activity/details?id=${particleTxId}`;
}
