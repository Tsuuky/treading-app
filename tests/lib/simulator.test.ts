import { executeOrder, partialClose } from '../../lib/simulator';
import type { Order, PortfolioState } from '../../types/core';

test('executes market buy/sell and partial close helper', () => {
  const s: PortfolioState = { cash: 1000, equity: 1000, positions: [], openOrders: [], trades: [], equityCurve: [] };
  const buy: Order = { id: 'o1', userId: 'u', symbol: 'AAPL', side: 'buy', type: 'market', qty: 1, qtyMode: 'units', status: 'open', createdAt: Date.now() };
  const t1 = executeOrder(buy, 100, s, { feeBps: 0, slippageBps: 0 });
  expect(t1.price).toBe(100);
  const sell: Order = { ...buy, id: 'o2', side: 'sell' };
  const t2 = executeOrder(sell, 110, s, { feeBps: 0, slippageBps: 0 });
  expect(t2.realizedPnlDelta).toBe(10);
  expect(partialClose(10, 0.25)).toBe(2.5);
});
