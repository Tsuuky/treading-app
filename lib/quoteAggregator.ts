import { getQuotes } from './dataProvider';

const pending = new Map<string, { resolve: (v: number) => void; reject: (e: unknown) => void }[]>();
let timer: NodeJS.Timeout | null = null;

export function queueQuote(symbol: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const arr = pending.get(symbol) ?? [];
    arr.push({ resolve, reject });
    pending.set(symbol, arr);
    if (!timer) timer = setTimeout(flush, 100);
  });
}

async function flush() {
  const symbols = Array.from(pending.keys());
  const local = new Map(pending);
  pending.clear();
  timer = null;
  try {
    const quotes = await getQuotes(symbols);
    for (const s of symbols) {
      const waiters = local.get(s) ?? [];
      for (const w of waiters) w.resolve(quotes[s]);
    }
  } catch (e) {
    for (const ws of local.values()) for (const w of ws) w.reject(e);
  }
}
