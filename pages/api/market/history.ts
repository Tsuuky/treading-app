import type { NextApiRequest, NextApiResponse } from 'next';
import { getDailyHistory } from '../../../lib/dataProvider';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbol = String(req.query.symbol ?? 'AAPL').toUpperCase();
  const bars = await getDailyHistory(symbol);
  res.status(200).json({ symbol, bars });
}
