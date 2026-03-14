import type { NextApiRequest, NextApiResponse } from 'next';
import { resetState } from '../../../lib/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  resetState();
  res.status(200).json({ ok: true });
}
