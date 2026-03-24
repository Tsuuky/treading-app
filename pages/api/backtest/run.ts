import type { NextApiRequest, NextApiResponse } from 'next';
import { getDailyHistory } from '../../../lib/dataProvider';

function sma(values: number[], period: number, idx: number) {
  if (idx + 1 < period) return null;
  const window = values.slice(idx - period + 1, idx + 1);
  return window.reduce((a, b) => a + b, 0) / period;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { symbol = 'AAPL', strategy = 'ma_crossover', fast = 5, slow = 20 } = req.body ?? {};
  const bars = await getDailyHistory(symbol);
  const closes = bars.map((b) => b.c);
  let cash = 10000;
  let qty = 0;

  for (let i = 0; i < bars.length; i++) {
    const f = sma(closes, fast, i);
    const s = sma(closes, slow, i);
    if (f == null || s == null) continue;
    if (strategy === 'ma_crossover' && f > s && qty === 0) {
      qty = cash / closes[i];
      cash = 0;
    } else if (strategy === 'ma_crossover' && f < s && qty > 0) {
      cash = qty * closes[i];
      qty = 0;
    }
  }

  const finalEquity = cash + qty * closes.at(-1)!;
  res.status(200).json({ strategy, symbol, bars: bars.length, finalEquity, returnPct: (finalEquity - 10000) / 10000 });
}
