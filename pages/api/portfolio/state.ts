import type { NextApiRequest, NextApiResponse } from 'next';
import { computeKPIs } from '../../../lib/kpis';
import { getState } from '../../../lib/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const state = getState();
  const kpis = computeKPIs(state);
  res.status(200).json({ state, kpis });
}
