import { TokenBucket } from '../../utils/rateLimiter';

describe('TokenBucket', () => {
  test('consumes tokens and blocks when empty', () => {
    const b = new TokenBucket(2, 0);
    expect(b.consume()).toBe(true);
    expect(b.consume()).toBe(true);
    expect(b.consume()).toBe(false);
  });
});
