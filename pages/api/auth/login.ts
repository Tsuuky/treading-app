import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyUser } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, password } = req.body ?? {};
  const user = await verifyUser(username, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.setHeader('Set-Cookie', 'pt_session=mock-u1; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400');
  return res.status(200).json({ user, educationalOnly: true });
}
