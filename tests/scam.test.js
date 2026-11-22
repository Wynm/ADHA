import { describe, expect, it } from 'vitest';
import { PRESETS, RULES, scan, verdictFor } from '../src/lib/scamRules.js';

describe('scan · scam pattern engine', () => {
  it('flags a classic ponzi pitch as severe', () => {
    const r = scan(PRESETS.find((p) => p.id === 'ponzi').text);
    expect(r.score).toBeGreaterThanOrEqual(70);
    expect(r.verdict.key).toBe('danger');
    expect(r.hits.map((h) => h.id)).toContain('daily-return');
  });

  it('flags a disguised MLM pitch', () => {
    const r = scan(PRESETS.find((p) => p.id === 'mlm').text);
    expect(r.score).toBeGreaterThanOrEqual(45);
    expect(r.hits.map((h) => h.id)).toContain('downline');
  });

  it('does not flag an honest freelance brief', () => {
    const r = scan(PRESETS.find((p) => p.id === 'legit').text);
    expect(r.score).toBeLessThan(20);
    expect(r.hits).toHaveLength(0);
  });

  it('returns empty result for short input', () => {
    const r = scan('أهلاً');
    expect(r.empty).toBe(true);
  });

  it('keeps score inside 0..100 no matter how many patterns hit', () => {
    const everything = RULES.flatMap((r) => r.patterns.map((p) => p.source)).join(' ') + ' مضمون ربح 3% يومياً';
    const r = scan(everything);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });

  it('negative signals reduce the score', () => {
    const base = 'ربح يومي ثابت 3% يومياً، فرصة استثمارية.';
    const withContract = base + ' الدفع عبر عقد مكتوب وفاتورة، والعمل برمجة.';
    expect(scan(withContract).score).toBeLessThan(scan(base).score);
  });

  it('maps verdicts monotonically', () => {
    expect(verdictFor(90).key).toBe('danger');
    expect(verdictFor(50).key).toBe('warn');
    expect(verdictFor(25).key).toBe('caution');
    expect(verdictFor(2).key).toBe('ok');
  });
});
