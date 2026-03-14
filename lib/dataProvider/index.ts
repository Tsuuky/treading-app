import type { OHLCV } from '../../types/core';
import { getCache, setCache } from '../../utils/cache';
import { getBucket } from '../../utils/rateLimiter';

const MODE = process.env.MODE ?? 'MOCK';

const mockQuotes: Record<string, number> = {
  AAPL: 204.2,
  MSFT: 431.1,
  BTCUSDT: 69350,
  ETHUSDT: 3550,
};

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Provider error ${res.status}`);
  return res.json();
}

export async function getQuotes(symbols: string[]) {
  const key = `quote:${symbols.sort().join(',')}`;
  const ttl = Number(process.env.CACHE_TTL_QUOTE_SECONDS ?? 15);
  const cached = getCache<Record<string, number>>(key);
  if (cached) return cached;

  if (MODE !== 'LIVE') {
    const output: Record<string, number> = {};
    for (const s of symbols) output[s] = mockQuotes[s] ?? 100;
    setCache(key, output, ttl);
    return output;
  }

  const providerBucket = getBucket('provider:coingecko', Number(process.env.RATE_LIMIT_PROVIDER_CAP ?? 20), Number(process.env.RATE_LIMIT_PROVIDER_REFILL ?? 1));
  if (!providerBucket.consume()) throw new Error('Rate limited provider');

  const result: Record<string, number> = {};
  const crypto = symbols.filter((s) => s.endsWith('USDT'));
  const stocks = symbols.filter((s) => !s.endsWith('USDT'));

  if (crypto.length) {
    const ids = crypto.map((s) => (s.startsWith('BTC') ? 'bitcoin' : 'ethereum')).join(',');
    const cg = await fetchJSON(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
    for (const s of crypto) result[s] = s.startsWith('BTC') ? cg.bitcoin?.usd : cg.ethereum?.usd;
  }

  for (const s of stocks) {
    const av = await fetchJSON(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${s}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`);
    result[s] = Number(av?.['Global Quote']?.['05. price'] ?? mockQuotes[s] ?? 100);
  }

  setCache(key, result, ttl);
  return result;
}

export async function getDailyHistory(symbol: string): Promise<OHLCV[]> {
  const key = `daily:${symbol}`;
  const ttl = Number(process.env.CACHE_TTL_DAILY_SECONDS ?? 300);
  const cached = getCache<OHLCV[]>(key);
  if (cached) return cached;

  if (MODE !== 'LIVE') {
    const data = (await import(`../../data/mock/${symbol}.json`).catch(() => import('../../data/mock/AAPL.json'))).default as OHLCV[];
    setCache(key, data, ttl);
    return data;
  }

  if (symbol.endsWith('USDT')) {
    const base = symbol.replace('USDT', '').toLowerCase();
    const pair = base === 'btc' ? 'bitcoin' : 'ethereum';
    const cg = await fetchJSON(`https://api.coingecko.com/api/v3/coins/${pair}/ohlc?vs_currency=usd&days=30`);
    const normalized = cg.map((x: [number, number, number, number, number]) => ({ ts: x[0], o: x[1], h: x[2], l: x[3], c: x[4], v: 0, tz: 'UTC' as const }));
    setCache(key, normalized, ttl);
    return normalized;
  }

  const av = await fetchJSON(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`);
  const series = av['Time Series (Daily)'] ?? {};
  const normalized: OHLCV[] = Object.entries(series).slice(0, 60).map(([d, v]: [string, Record<string, string>]) => ({
    ts: Date.parse(`${d}T00:00:00Z`),
    o: Number(v['1. open']),
    h: Number(v['2. high']),
    l: Number(v['3. low']),
    c: Number(v['4. close']),
    v: Number(v['6. volume']),
    tz: 'UTC',
  }));
  setCache(key, normalized, ttl);
  return normalized;
}
