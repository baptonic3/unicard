/**
 * sync-chain-items.mjs
 * Creates any missing AccessItems on-chain and patches chainItemId in the DB.
 * Run: node scripts/sync-chain-items.mjs
 */
import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envPath = resolve(__dirname, '../.env');
const envVars = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.split('=')[0].trim(), l.split('=').slice(1).join('=').trim()])
);

const CONTRACT_ADDRESS = envVars['NEXT_PUBLIC_ACCESS_PASS_CONTRACT'];
const RPC_URL = envVars['NEXT_PUBLIC_ARB_RPC_URL'] || 'https://arb1.arbitrum.io/rpc';
const PRIVATE_KEY = envVars['DEPLOYER_PRIVATE_KEY'];

if (!CONTRACT_ADDRESS || !PRIVATE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_ACCESS_PASS_CONTRACT or DEPLOYER_PRIVATE_KEY in .env');
  process.exit(1);
}

const ABI = [
  'function nextItemId() view returns (uint256)',
  'function items(uint256) view returns (address creator, string metadataURI, uint256 priceUSDC6, uint256 maxSupply, uint256 currentSupply, bool active)',
  'function createAccessItem(string metadataURI, uint256 priceUSDC6, uint256 maxSupply) returns (uint256)',
];

const db = new PrismaClient({ log: [] });
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

async function main() {
  const nextId = await contract.nextItemId();
  console.log(`📦 On-chain nextItemId: ${nextId} (${nextId} items exist: 0 to ${nextId - 1n})`);

  const dbItems = await db.accessItem.findMany({ orderBy: { createdAt: 'asc' } });
  console.log(`🗄  DB items: ${dbItems.length}`);
  dbItems.forEach(it => console.log(`   slug=${it.slug} chainItemId=${it.chainItemId} price=${it.priceUSDC}`));

  // For each DB item with no chainItemId, create on-chain and update DB
  for (const item of dbItems) {
    if (item.chainItemId != null) {
      console.log(`✅ ${item.slug} → already mapped to chainItemId=${item.chainItemId}`);
      continue;
    }

    const priceUSDC6 = BigInt(Math.round(item.priceUSDC * 1_000_000));
    const maxSupply = 1000n; // default unlimited supply

    console.log(`🔨 Creating on-chain item for "${item.title}" (price ${item.priceUSDC} USDC = ${priceUSDC6} raw)...`);
    const tx = await contract.createAccessItem(item.slug, priceUSDC6, maxSupply);
    const receipt = await tx.wait();
    console.log(`   TX: ${receipt.hash}`);

    // The new item ID is the old nextItemId before this call
    const newItemId = Number(nextId) + dbItems.filter(x => x.chainItemId == null).indexOf(item);

    await db.accessItem.update({
      where: { id: item.id },
      data: { chainItemId: newItemId },
    });
    console.log(`   ✅ chainItemId=${newItemId} saved to DB`);
  }

  // Re-query to confirm
  const updated = await db.accessItem.findMany({ orderBy: { createdAt: 'asc' } });
  console.log('\n📋 Final DB state:');
  updated.forEach(it => console.log(`   slug=${it.slug} chainItemId=${it.chainItemId}`));
  
  await db.$disconnect();
}

main().catch(err => { console.error('❌', err); process.exit(1); });
