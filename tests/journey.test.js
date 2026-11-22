import { describe, expect, it } from 'vitest';
import { STAGES } from '../src/data/journey.js';

// كل معرف قسم موجود فعلاً في الصفحة
const REAL_SECTIONS = [
  'compass', 'premortem', 'vault', 'shield', 'scamlab', 'game', 'arena', 'simulator',
  'calc', 'purchasing', 'platforms', 'curriculum', 'roadmap', 'tracker', 'scripts',
  'review', 'cases', 'lexicon', 'share', 'plan', 'fuel', 'manifesto',
];

describe('journey map', () => {
  it('has five stages numbered in order', () => {
    expect(STAGES).toHaveLength(5);
    STAGES.forEach((s, i) => expect(s.n).toBe(String(i + 1).padStart(2, '0')));
  });

  it('every link points to a real section', () => {
    for (const s of STAGES) {
      for (const item of s.items) {
        expect(REAL_SECTIONS).toContain(item.id);
      }
    }
  });

  it('no section appears twice', () => {
    const all = STAGES.flatMap((s) => s.items.map((i) => i.id));
    expect(new Set(all).size).toBe(all.length);
  });

  it('every section in the app is reachable from the journey map', () => {
    const mapped = new Set(STAGES.flatMap((s) => s.items.map((i) => i.id)));
    for (const id of REAL_SECTIONS) expect(mapped.has(id)).toBe(true);
  });

  it('each stage has a why and a colour', () => {
    for (const s of STAGES) {
      expect(s.why.length).toBeGreaterThan(20);
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(s.items.length).toBeGreaterThanOrEqual(3);
    }
  });
});
