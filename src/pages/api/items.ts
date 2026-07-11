import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const items = await db.accessItem.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        imageUrl: true,
        priceUSDC: true,
        chainItemId: true,
        active: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ items });
  } catch (err) {
    console.error('GET /api/items error:', err);
    return res.status(500).json({ error: 'Failed to fetch items' });
  }
}
