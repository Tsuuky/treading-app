import handler from '../../pages/api/market/quote';
import { createMocks } from 'node-mocks-http';

test('quote route returns batch', async () => {
  const { req, res } = createMocks({ method: 'GET', query: { symbols: 'AAPL,BTCUSDT' } });
  await handler(req as never, res as never);
  expect(res._getStatusCode()).toBe(200);
});
