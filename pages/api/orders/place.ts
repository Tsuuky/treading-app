import type { NextApiRequest, NextApiResponse } from 'next';
import { getQuotes } from '../../../lib/dataProvider';
import { executeOrder } from '../../../lib/simulator';
import { addOrder, addTrade, getState } from '../../../lib/store';
import type { Order } from '../../../types/core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const order = { ...req.body, id: crypto.randomUUID(), createdAt: Date.now(), status: 'open', userId: 'u1' } as Order;
  addOrder(order);
  const quotes = await getQuotes([order.symbol]);
  const state = getState();
  const trade = executeOrder(order, quotes[order.symbol], state, { feeBps: Number(process.env.FEE_BPS ?? 5), slippageBps: Number(process.env.SLIPPAGE_BPS ?? 8) });
  order.status = 'filled';
  state.openOrders = state.openOrders.filter((o) => o.id !== order.id);
  addTrade(trade);
  res.status(200).json({ order, trade, state });
}
