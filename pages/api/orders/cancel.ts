import type { NextApiRequest, NextApiResponse } from 'next';
import { getState } from '../../../lib/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { orderId } = req.body ?? {};
  const state = getState();
  state.openOrders = state.openOrders.filter((o) => o.id !== orderId);
  res.status(200).json({ ok: true });
}
