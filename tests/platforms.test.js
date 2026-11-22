import { describe, expect, it } from 'vitest';
import { PLATFORMS, netFrom, priceNeededFor } from '../src/data/platforms.js';

describe('platforms economics', () => {
  it('direct client keeps 100%', () => {
    const direct = PLATFORMS.find((p) => p.id === 'direct');
    expect(netFrom(500, direct)).toBeCloseTo(500, 5);
  });

  it('every platform with fees keeps less than gross price', () => {
    for (const p of PLATFORMS.filter((x) => x.fee + x.payoutFee > 0)) {
      expect(netFrom(500, p)).toBeLessThan(500);
    }
  });

  it('higher fee means less net', () => {
    const fiverr = PLATFORMS.find((p) => p.id === 'fiverr');
    const mostaql = PLATFORMS.find((p) => p.id === 'mostaql');
    expect(netFrom(500, fiverr)).toBeLessThan(netFrom(500, mostaql));
  });

  it('never returns negative net', () => {
    for (const p of PLATFORMS) expect(netFrom(0, p)).toBeGreaterThanOrEqual(0);
  });

  it('gross-up price actually reaches the desired net', () => {
    for (const p of PLATFORMS) {
      if (p.fee === 0 && p.payoutFee === 0) continue;
      const needed = priceNeededFor(100, p);
      expect(netFrom(needed, p)).toBeGreaterThanOrEqual(99);
      expect(needed).toBeGreaterThan(100);
    }
  });
});
