/*
PSEUDOCODE TOKEN BUCKET
- bucket has capacity, refillRatePerSec, tokens, lastRefillTs
- on consume(n):
  1) elapsed = now-lastRefillTs; tokens=min(capacity, tokens + elapsed*refillRate)
  2) if tokens<n => reject
  3) else tokens -= n; allow
*/
export class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(private capacity: number, private refillRatePerSec: number) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  consume(cost = 1) {
    const now = Date.now();
    const elapsedSec = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRatePerSec);
    this.lastRefill = now;
    if (this.tokens < cost) return false;
    this.tokens -= cost;
    return true;
  }
}

const buckets = new Map<string, TokenBucket>();

export function getBucket(key: string, cap: number, refill: number) {
  if (!buckets.has(key)) buckets.set(key, new TokenBucket(cap, refill));
  return buckets.get(key)!;
}
