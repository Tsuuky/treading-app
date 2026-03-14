import type { NextApiRequest, NextApiResponse } from 'next';
import { parseAuthCookie } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = parseAuthCookie(req.headers.cookie);
  if (!user) return res.status(401).json({ user: null });
  res.status(200).json({ user });
}
