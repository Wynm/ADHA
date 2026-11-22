import { describe, expect, it } from 'vitest';
import { RANKS, ROUNDS } from '../src/data/game.js';

describe('scam-vs-work game', () => {
  it('has 16 rounds with balanced answers', () => {
    expect(ROUNDS).toHaveLength(16);
    const scams = ROUNDS.filter((r) => r.scam).length;
    expect(scams).toBeGreaterThanOrEqual(7);
    expect(scams).toBeLessThanOrEqual(10);
  });

  it('no more than 35% of the rounds are marked hard', () => {
    expect(ROUNDS.filter((r) => r.hard).length / ROUNDS.length).toBeLessThanOrEqual(0.35);
  });

  it('every round has a tell, a lesson and unique id', () => {
    const ids = new Set();
    for (const r of ROUNDS) {
      expect(r.id).not.toBe('');
      expect(ids.has(r.id)).toBe(false);
      ids.add(r.id);
      expect(r.tell.length).toBeGreaterThan(30);
      expect(r.lesson.length).toBeGreaterThan(10);
      expect(typeof r.scam).toBe('boolean');
    }
  });

  it('ranks cover the full 0..12 range in order', () => {
    let prev = -1;
    for (const r of RANKS) {
      expect(r.max).toBeGreaterThan(prev);
      prev = r.max;
    }
    expect(RANKS.at(-1).max).toBe(ROUNDS.length);
  });

  it('every score maps to a rank', () => {
    for (let s = 0; s <= ROUNDS.length; s++) {
      expect(RANKS.find((r) => s <= r.max)).toBeDefined();
    }
  });
});
