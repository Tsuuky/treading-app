import handler from '../../pages/api/backtest/run';
import { createMocks } from 'node-mocks-http';

test('backtest route works', async () => {
  const { req, res } = createMocks({ method: 'POST', body: { symbol: 'AAPL', strategy: 'ma_crossover' } });
  await handler(req as never, res as never);
  expect(res._getStatusCode()).toBe(200);
});
