import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

// POST /api/sessions
// Body: { itemSlug, successUrl, cancelUrl, webhookUrl?, metadata? }
// Returns: { sessionId, checkoutUrl }
//
// GET /api/sessions?id=xxx
// Returns: { session, item }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { itemSlug, successUrl, cancelUrl, webhookUrl, metadata } = req.body;

    if (!itemSlug || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required fields: itemSlug, successUrl, cancelUrl' });
    }

    const item = await db.accessItem.findUnique({ where: { slug: itemSlug } });
    if (!item || !item.active) {
      return res.status(404).json({ error: `Access item not found: ${itemSlug}` });
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    const session = await db.checkoutSession.create({
      data: {
        itemId: item.id,
        successUrl,
        cancelUrl,
        webhookUrl: webhookUrl ?? null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        expiresAt,
      },
    });

    // Derive host from request so this works on localhost, Vercel preview, and production
    const proto = req.headers['x-forwarded-proto'] ?? 'http';
    const host = req.headers['x-forwarded-host'] ?? req.headers.host ?? 'localhost:3000';
    const baseUrl = `${proto}://${host}`;
    const checkoutUrl = `${baseUrl}/checkout/${session.id}`;

    return res.status(201).json({ sessionId: session.id, checkoutUrl });
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing session id' });
    }

    const session = await db.checkoutSession.findUnique({
      where: { id },
      include: { item: true },
    });

    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Check expiry
    if (session.status === 'open' && new Date() > session.expiresAt) {
      await db.checkoutSession.update({ where: { id }, data: { status: 'expired' } });
      return res.status(410).json({ error: 'Session expired' });
    }

    return res.status(200).json({ session, item: session.item });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
