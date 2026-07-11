import { db } from '../src/lib/db';

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing
  await db.pass.deleteMany();
  await db.accessItem.deleteMany();

  // Seed access items
  const items = [
    {
      slug: 'unicard-launch-party',
      title: 'UniCard Launch Party',
      description:
        'Be part of the launch. Celebrate the first chain-abstracted checkout engine on Arbitrum. Open bar, networking, and live demos.',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
      priceUSDC: 2,
      chainItemId: 0,
      active: true,
    },
    {
      slug: 'web3-builders-summit',
      title: 'Web3 Builders Summit',
      description:
        'Two-day conference bringing together the best builders in DeFi, account abstraction, and consumer crypto. Keynotes + workshops.',
      imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop',
      priceUSDC: 1,
      chainItemId: null,
      active: true,
    },
    {
      slug: 'arbitrum-hackathon-uxmaxx',
      title: 'UXmaxx Hackathon by Encode',
      description:
        'The flagship Web3 UX hackathon. Build consumer dApps with embedded wallets, chain abstraction, and social login. Join the revolution.',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
      priceUSDC: 0.3,
      chainItemId: null,
      active: true,
    },
  ];

  for (const item of items) {
    const created = await db.accessItem.create({ data: item });
    console.log(`  ✅ Created: ${created.title} (${created.slug}) — $${created.priceUSDC} USDC`);
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
