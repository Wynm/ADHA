import { describe, expect, it } from 'vitest';
import { DIMENSIONS, INDEX_LEVELS, computeIndex } from '../src/lib/index-score.js';

const FULL = {
  compass: { q1: 'build', q2: 'mid', q3: 'cash', q4: 'rejection' },
  tasks: Object.fromEntries(Array.from({ length: 21 }, (_, i) => [`phase-1:${i}`, true])),
  streak: Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`2026-11-${String(i + 1).padStart(2, '0')}`, true])),
  hours: 15,
  goal: 3000,
  premortem: { hours: 0, skill: 0, money: 0, evidence: 0, network: 0 },
  assets: Object.fromEntries(['skill', 'proof', 'offer', 'audience', 'client', 'system', 'network', 'buffer'].map((k) => [k, 3])),
  reviews: Array.from({ length: 12 }, () => ({ date: '2026-11-01' })),
  curriculum: Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`web:${i + 1}`, [0, 1, 2]])),
};

const EMPTY = {};

describe('decision index', () => {
  it('has six dimensions and five levels covering 0..100', () => {
    expect(DIMENSIONS).toHaveLength(6);
    let prev = -1;
    for (const l of INDEX_LEVELS) {
      expect(l.max).toBeGreaterThan(prev);
      prev = l.max;
    }
    expect(INDEX_LEVELS.at(-1).max).toBe(100);
  });

  it('empty state scores very low and returns 3 actions', () => {
    const r = computeIndex(EMPTY);
    expect(r.index).toBeLessThanOrEqual(5);
    expect(r.level.key).toBe('start');
    expect(r.actions).toHaveLength(3);
  });

  it('full state scores high and lands in the top level', () => {
    const r = computeIndex(FULL);
    expect(r.index).toBeGreaterThanOrEqual(90);
    expect(r.level.key).toBe('compounding');
  });

  it('every dimension is bounded 0..100', () => {
    for (const input of [EMPTY, FULL, { compass: { q1: 'a' } }]) {
      const r = computeIndex(input);
      for (const d of r.dimensions) {
        expect(d.value).toBeGreaterThanOrEqual(0);
        expect(d.value).toBeLessThanOrEqual(100);
      }
    }
  });

  it('is monotonic when a dimension improves', () => {
    const base = computeIndex({ ...EMPTY, compass: { q1: 'build' } });
    const better = computeIndex({ ...EMPTY, compass: { q1: 'build', q2: 'mid', q3: 'cash', q4: 'rejection' } });
    expect(better.index).toBeGreaterThan(base.index);
  });

  it('actions are unique and point to real anchors', () => {
    const r = computeIndex(EMPTY);
    const hrefs = r.actions.map((a) => a.href);
    expect(new Set(r.actions.map((a) => a.ar)).size).toBe(hrefs.length);
    for (const h of hrefs) expect(h.startsWith('#')).toBe(true);
  });
});
