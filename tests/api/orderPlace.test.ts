import handler from '../../pages/api/orders/place';
import { createMocks } from 'node-mocks-http';

test('order place route works', async () => {
  const { req, res } = createMocks({ method: 'POST', body: { symbol: 'AAPL', side: 'buy', type: 'market', qty: 1, qtyMode: 'units' } });
  await handler(req as never, res as never);
  expect(res._getStatusCode()).toBe(200);
});
