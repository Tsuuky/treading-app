import type { NextApiRequest, NextApiResponse } from 'next';

type JournalEntry = { tradeId: string; notes: string; emotionTag: string; planRespected: boolean; setupType: string; updatedAt: number };
const journal = new Map<string, JournalEntry>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { tradeId, notes, emotionTag, planRespected, setupType } = req.body ?? {};
  journal.set(tradeId, { tradeId, notes, emotionTag, planRespected, setupType, updatedAt: Date.now() });
  res.status(200).json({ ok: true, entry: journal.get(tradeId) });
}
