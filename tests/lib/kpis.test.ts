import { computeKPIs } from '../../lib/kpis';

test('compute basic KPIs', () => {
  const k = computeKPIs({
    cash: 100,
    equity: 110,
    positions: [],
    openOrders: [],
    trades: [
      { id: '1', orderId: 'o1', symbol: 'AAPL', side: 'buy', qty: 1, price: 100, fees: 1, slippage: 0, timestamp: 1, realizedPnlDelta: 5 },
      { id: '2', orderId: 'o2', symbol: 'AAPL', side: 'sell', qty: 1, price: 90, fees: 1, slippage: 0, timestamp: 2, realizedPnlDelta: -3 },
    ],
    equityCurve: [{ ts: 1, equity: 100 }, { ts: 2, equity: 110 }],
  });
  expect(k.winrate).toBeGreaterThan(0);
  expect(k.profitFactor).toBeGreaterThan(1);
});
