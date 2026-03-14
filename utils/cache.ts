/*
PSEUDOCODE LRU + REDIS OPTIONAL
- get: memory first; if miss and REDIS_URL exists, read redis
- set: write memory with ttl; mirror to redis SETEX
- mutex key avoids thundering herd for same cache key
*/

type Entry<T> = { value: T; expiresAt: number };
const lru = new Map<string, Entry<unknown>>();
const MAX = 500;

function touch(key: string, val: Entry<unknown>) {
  lru.delete(key);
  lru.set(key, val);
  if (lru.size > MAX) {
    const oldest = lru.keys().next().value;
    lru.delete(oldest);
  }
}

export function getCache<T>(key: string): T | null {
  const entry = lru.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    lru.delete(key);
    return null;
  }
  touch(key, entry);
  return entry.value as T;
}

export function setCache<T>(key: string, value: T, ttlSec: number) {
  touch(key, { value, expiresAt: Date.now() + ttlSec * 1000 });
}
