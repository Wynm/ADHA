import { describe, expect, it } from 'vitest';
import { HONEST_BASE, PARTS, SCAM_BASE } from '../src/data/scamLab.js';
import { RULES, scan } from '../src/lib/scamRules.js';
import { SCRIPTS } from '../src/data/scripts.js';

describe('scam lab', () => {
  it('every part maps to a real scanner rule', () => {
    const ids = new Set(RULES.map((r) => r.id));
    for (const p of PARTS) expect(ids.has(p.rule)).toBe(true);
  });

  it('each part alone triggers its own rule', () => {
    for (const p of PARTS) {
      const r = scan(`${SCAM_BASE} ${p.text}`);
      expect(r.hits.map((h) => h.id)).toContain(p.rule);
    }
  });

  it('all parts together maxes out the risk score', () => {
    const text = [SCAM_BASE, ...PARTS.map((p) => p.text)].join(' ');
    const r = scan(text);
    expect(r.score).toBe(100);
    expect(r.verdict.key).toBe('danger');
  });

  it('the honest rewriting scores low', () => {
    const r = scan(HONEST_BASE);
    expect(r.score).toBeLessThan(20);
  });

  it('more parts never lower the score', () => {
    let prev = -1;
    for (let n = 0; n <= PARTS.length; n++) {
      const r = scan([SCAM_BASE, ...PARTS.slice(0, n).map((p) => p.text)].join(' '));
      expect(r.score).toBeGreaterThanOrEqual(prev);
      prev = r.score;
    }
  });
});

describe('scripts', () => {
  it('has eight complete templates', () => {
    expect(SCRIPTS).toHaveLength(8);
    for (const s of SCRIPTS) {
      expect(s.body.length).toBeGreaterThan(80);
      expect(s.avoid.length).toBeGreaterThan(10);
      expect(s.why.length).toBeGreaterThan(20);
      expect(s.tag).toBeTruthy();
    }
  });

  it('placeholder markers are consistent', () => {
    for (const s of SCRIPTS) {
      const open = (s.body.match(/\[/g) || []).length;
      const close = (s.body.match(/\]/g) || []).length;
      expect(open).toBe(close);
    }
  });
});
