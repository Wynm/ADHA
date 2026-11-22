import { describe, expect, it } from 'vitest';
import { FACTORS, FAILURE_MODES, evaluate } from '../src/lib/premortem.js';

const best = Object.fromEntries(FACTORS.map((f) => [f.id, 0]));
const worst = Object.fromEntries(FACTORS.map((f) => [f.id, 3]));

describe('premortem', () => {
  it('scores the strongest profile near 100', () => {
    const r = evaluate(best);
    expect(r.pct).toBe(100);
    expect(r.gaps).toHaveLength(0);
    expect(r.mode.key).toBe('veteran');
  });

  it('scores the weakest profile at 0', () => {
    const r = evaluate(worst);
    expect(r.pct).toBe(0);
    expect(r.mode.key).toBe('fragile');
    expect(r.gaps.length).toBe(FACTORS.length);
  });

  it('reports incomplete answers', () => {
    expect(evaluate({ hours: 0 }).complete).toBe(false);
    expect(evaluate(best).complete).toBe(true);
  });

  it('is monotonic between adjacent options', () => {
    let prev = -1;
    for (let k = 3; k >= 0; k--) {
      const r = evaluate({ ...best, hours: k });
      expect(r.pct).toBeGreaterThan(prev);
      prev = r.pct;
    }
  });

  it('failure modes cover the whole 0..100 range without gaps', () => {
    for (let i = 0; i <= 100; i++) {
      const m = FAILURE_MODES.find((x) => i >= x.min && i <= x.max);
      expect(m).toBeDefined();
    }
  });

  it('weights sum to 100', () => {
    expect(FACTORS.reduce((s, f) => s + f.weight, 0)).toBe(100);
  });
});
