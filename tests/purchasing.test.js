import { describe, expect, it } from 'vitest';
import { COUNTRIES, localize, runwayMonths } from '../src/lib/purchasing.js';

describe('purchasing power', () => {
  it('has 12 countries with sane fields', () => {
    expect(COUNTRIES).toHaveLength(12);
    for (const c of COUNTRIES) {
      expect(c.rate).toBeGreaterThan(0);
      expect(c.medianWage).toBeGreaterThan(0);
      expect(c.rent1br).toBeGreaterThan(0);
      expect(c.rent1br).toBeLessThan(c.medianWage * 1.2);
    }
  });

  it('converts to local currency correctly', () => {
    const ma = COUNTRIES.find((c) => c.id === 'MA');
    expect(localize(1000, ma).local).toBeCloseTo(1000 * ma.rate, 0);
  });

  it('multiple of median grows with income', () => {
    const c = COUNTRIES[0];
    expect(localize(2000, c).multipleOfMedian).toBeGreaterThan(localize(1000, c).multipleOfMedian);
  });

  it('assigns a tone for every possible ratio', () => {
    const c = COUNTRIES[0];
    for (const usd of [50, 200, 500, 1000, 3000, 10000]) {
      expect(['lime', 'cyan', 'amber', 'red']).toContain(localize(usd, c).tone);
    }
  });

  it('runway decreases as income grows', () => {
    const c = COUNTRIES[0];
    expect(runwayMonths(2000, c)).toBeLessThan(runwayMonths(500, c));
  });
});
