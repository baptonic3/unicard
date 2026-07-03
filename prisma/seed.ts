import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed a demo access item
  const demoItem = await prisma.accessItem.upsert({
    where: { slug: 'uxmaxx-demo-night' },
    update: {},
    create: {
      slug: 'uxmaxx-demo-night',
      title: 'UXmaxx Demo Night',
      description:
        'Exclusive access to the UXmaxx Hackathon Demo Night on July 17, 2026. Experience the future of chain-abstracted UX — live demos, networking, and prizes.',
      imageUrl: null, // Will be replaced with generated image
      priceUSDC: 0.5,
      active: true,
    },
  });

  console.log('✅ Seeded demo item:', demoItem);

  // Optionally seed a second item for variety
  const workshopItem = await prisma.accessItem.upsert({
    where: { slug: 'particle-workshop' },
    update: {},
    create: {
      slug: 'particle-workshop',
      title: 'Particle UA Workshop',
      description:
        'Hands-on workshop: build cross-chain dApps with Particle Universal Accounts and EIP-7702. Learn from the Particle dev team.',
      imageUrl: null,
      priceUSDC: 0.25,
      active: true,
    },
  });

  console.log('✅ Seeded workshop item:', workshopItem);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
