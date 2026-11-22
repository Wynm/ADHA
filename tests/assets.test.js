import { describe, expect, it } from 'vitest';
import { ASSETS, ASSET_LEVELS, scoreAssets } from '../src/lib/assets.js';
import { WEEKS, CURRICULUM_RULES } from '../src/data/curriculum.js';

describe('asset vault', () => {
  it('has 8 assets with weights summing to 100', () => {
    expect(ASSETS).toHaveLength(8);
    expect(ASSETS.reduce((s, a) => s + a.weight, 0)).toBe(100);
  });

  it('every asset has 4 levels and a next step', () => {
    for (const a of ASSETS) {
      expect(a.levels).toHaveLength(4);
      expect(a.next.length).toBeGreaterThan(20);
      expect(a.levels.length).toBe(ASSET_LEVELS.length);
    }
  });

  it('empty vault scores 0 and lists every asset as a gap', () => {
    const r = scoreAssets({});
    expect(r.pct).toBe(0);
    expect(r.gaps).toHaveLength(ASSETS.length);
  });

  it('full vault scores 100 with no gaps', () => {
    const full = Object.fromEntries(ASSETS.map((a) => [a.id, 3]));
    const r = scoreAssets(full);
    expect(r.pct).toBe(100);
    expect(r.gaps).toHaveLength(0);
  });

  it('gaps are sorted by deficit', () => {
    const r = scoreAssets({ skill: 1, client: 2 });
    for (let i = 1; i < r.gaps.length; i++) {
      expect(r.gaps[i - 1].deficit).toBeGreaterThanOrEqual(r.gaps[i].deficit);
    }
  });

  it('raising any single asset never lowers the score', () => {
    let prev = -1;
    for (let v = 0; v <= 3; v++) {
      const r = scoreAssets({ skill: v });
      expect(r.pct).toBeGreaterThanOrEqual(prev);
      prev = r.pct;
    }
  });
});

describe('curriculum', () => {
  it('has 8 weeks each with 3 tasks, a goal, an output and 3 track variants', () => {
    expect(WEEKS).toHaveLength(8);
    for (const w of WEEKS) {
      expect(w.tasks).toHaveLength(3);
      expect(w.output.length).toBeGreaterThan(5);
      expect(w.goal.length).toBeGreaterThan(10);
      for (const t of ['web', 'design', 'content']) expect(w[t].length).toBeGreaterThan(10);
    }
  });

  it('week numbers are sequential starting at 1', () => {
    WEEKS.forEach((w, i) => expect(w.w).toBe(i + 1));
  });

  it('ships four learning rules', () => {
    expect(CURRICULUM_RULES).toHaveLength(4);
  });
});
