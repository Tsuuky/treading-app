export function computeBackoffMs(attempt: number, base = 500, cap = 15000) {
  const expo = Math.min(cap, base * 2 ** attempt);
  const jitter = Math.floor(Math.random() * 300);
  return expo + jitter;
}
