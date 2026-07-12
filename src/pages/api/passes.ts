import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { address } = req.query;
  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'address query param required' });
  }

  try {
    const passes = await db.pass.findMany({
      where: { buyerAddress: address },
      include: { item: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ passes });
  } catch (err) {
    console.error('[api/passes] error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
