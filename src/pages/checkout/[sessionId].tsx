import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { db } from '@/lib/db';
import { AccessItemData } from '@/components/AccessCard';

// Load the entire checkout UI client-side only.
// This prevents @particle-network/universal-account-sdk (ESM-only) from being
// bundled into the server render, which would cause ERR_REQUIRE_ESM on Vercel.
const CheckoutPageContent = dynamic(
  () => import('@/components/CheckoutPageContent'),
  { ssr: false }
);

interface CheckoutPageProps {
  session: {
    id: string;
    successUrl: string;
    cancelUrl: string;
    status: string;
    expiresAt: string;
  };
  item: AccessItemData;
}

export default function CheckoutPage({ session, item }: CheckoutPageProps) {
  return <CheckoutPageContent session={session} item={item} />;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const sessionId = params?.sessionId as string;

  try {
    const session = await db.checkoutSession.findUnique({
      where: { id: sessionId },
      include: { item: true },
    });

    if (!session) return { notFound: true };

    if (session.status === 'open' && new Date() > session.expiresAt) {
      await db.checkoutSession.update({ where: { id: sessionId }, data: { status: 'expired' } });
    }

    const item: AccessItemData = {
      id: session.item.id,
      slug: session.item.slug,
      title: session.item.title,
      description: session.item.description,
      imageUrl: session.item.imageUrl ?? null,
      priceUSDC: session.item.priceUSDC,
      chainItemId: session.item.chainItemId ?? null,
      active: session.item.active,
    };

    return {
      props: {
        session: {
          id: session.id,
          successUrl: session.successUrl,
          cancelUrl: session.cancelUrl,
          status: session.status,
          expiresAt: session.expiresAt.toISOString(),
        },
        item,
      },
    };
  } catch (err: any) {
    console.error('[checkout][getServerSideProps] FATAL ERROR:', err?.message ?? err);
    throw err;
  }
};
