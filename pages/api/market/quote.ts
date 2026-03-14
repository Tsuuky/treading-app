import type { NextApiRequest, NextApiResponse } from 'next';
import { queueQuote } from '../../../lib/quoteAggregator';
import { getBucket } from '../../../utils/rateLimiter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientBucket = getBucket(`client:${req.socket.remoteAddress}:quote`, Number(process.env.RATE_LIMIT_CLIENT_CAP ?? 30), Number(process.env.RATE_LIMIT_CLIENT_REFILL ?? 1));
  const routeBucket = getBucket('route:quote', Number(process.env.RATE_LIMIT_ROUTE_CAP ?? 100), Number(process.env.RATE_LIMIT_ROUTE_REFILL ?? 3));
  if (!clientBucket.consume() || !routeBucket.consume()) return res.status(429).json({ error: 'Too many requests' });

  const symbolsRaw = String(req.query.symbols ?? 'BTCUSDT,ETHUSDT,AAPL');
  const symbols = symbolsRaw.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
  const entries = await Promise.all(symbols.map(async (s) => [s, await queueQuote(s)] as const));
  res.status(200).json({ quotes: Object.fromEntries(entries), symbolsCount: symbols.length });
}
