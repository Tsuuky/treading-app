import type { NextApiRequest, NextApiResponse } from 'next';
import { getQuotes } from '../../../lib/dataProvider';
import { computeBackoffMs } from '../../../utils/backoff';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbols = String(req.query.symbols ?? 'BTCUSDT,ETHUSDT').split(',').map((s) => s.toUpperCase());
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  let attempt = 0;
  const tick = async () => {
    try {
      const quotes = await getQuotes(symbols);
      res.write(`data: ${JSON.stringify({ ts: Date.now(), quotes })}\n\n`);
      attempt = 0;
    } catch {
      attempt += 1;
      res.write(`event: warn\ndata: ${JSON.stringify({ error: 'poll_backoff', waitMs: computeBackoffMs(attempt) })}\n\n`);
    }
  };

  const interval = setInterval(tick, 2500);
  req.on('close', () => clearInterval(interval));
}
