import { describe, expect, it } from 'vitest';
import { TRACKS, compareAll, hypeCurve, simulate } from '../src/lib/simulator.js';

describe('simulate', () => {
  it('returns 24 months for every track', () => {
    for (const t of TRACKS) {
      const r = simulate(t.id, 15);
      expect(r.months).toHaveLength(24);
      expect(r.months[0].m).toBe(1);
      expect(r.months.at(-1).m).toBe(24);
    }
  });

  it('cumulative income is monotonically non-decreasing', () => {
    for (const t of TRACKS) {
      const r = simulate(t.id, 20);
      for (let i = 1; i < r.months.length; i++) {
        expect(r.months[i].cumulative).toBeGreaterThanOrEqual(r.months[i - 1].cumulative - 1);
      }
    }
  });

  it('never produces negative net income', () => {
    for (const t of TRACKS) {
      const r = simulate(t.id, 40);
      for (const m of r.months) expect(m.net).toBeGreaterThanOrEqual(0);
    }
  });

  it('scales with hours', () => {
    const low = simulate('freelance', 10);
    const high = simulate('freelance', 30);
    expect(high.total2y).toBeGreaterThan(low.total2y);
  });

  it('SaaS starts with zero months (build phase) — honesty by design', () => {
    const r = simulate('saas', 15);
    expect(r.months[0].net).toBe(0);
  });

  it('computes effective hourly as total / all hours', () => {
    const r = simulate('freelance', 15);
    expect(r.effectiveHourly).toBeCloseTo(r.total2y / r.totalHours, 0);
  });

  it('compareAll returns all tracks sorted by total', () => {
    const rows = compareAll(15);
    expect(rows).toHaveLength(TRACKS.length);
    for (let i = 1; i < rows.length; i++) expect(rows[i - 1].total2y).toBeGreaterThanOrEqual(rows[i].total2y);
  });

  it('hype curve is absurd (that is the point)', () => {
    const h = hypeCurve(15);
    expect(h.at(-1).hype).toBeGreaterThan(50000);
  });
});
