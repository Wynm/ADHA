import { describe, expect, it } from 'vitest';
import { PHASES } from '../src/data/roadmap.js';
import { ARCADE } from '../src/data/opportunities.js';
import { buildPlan, guessPath } from '../src/lib/plan.js';
import { DEFAULT_STATE } from '../src/lib/store.jsx';

const FULL = {
  ...DEFAULT_STATE,
  compass: { q1: 'build', q2: 'mid', q3: 'cash', q4: 'rejection' },
  tasks: { 'phase-1:1': true, 'phase-2:33': true },
};

describe('buildPlan', () => {
  const md = buildPlan(FULL);

  it('produces a markdown document with all six sections', () => {
    expect(md).toMatch(/^# خطة ADHA/);
    for (const h of ['## 1 · البوصلة', '## 2 · الهدف المالي', '## 3 · النموذج الزمني', '## 4 · خريطة 90 يوماً', '## 5 · قائمة المراجعة', '## 6 · المسارات الثمانية']) {
      expect(md).toContain(h);
    }
  });

  it('contains every roadmap task', () => {
    const total = PHASES.reduce((s, p) => s + p.tasks.length, 0);
    const checkedLines = md.match(/^- \[[ x]\] \*\*يوم/gm) || [];
    expect(checkedLines).toHaveLength(total);
  });

  it('marks completed tasks', () => {
    expect(md).toContain('- [x] **يوم 1**');
    expect(md).not.toContain('- [x] **يوم 3**');
  });

  it('includes all arena rows', () => {
    const rows = md.split('\n').filter((l) => l.startsWith('| ') && !l.includes('---') && !l.includes('المسار'));
    expect(rows.length).toBeGreaterThanOrEqual(ARCADE.length);
  });

  it('never claims a guaranteed income', () => {
    expect(md).toContain('ليست نصيحة مالية');
  });

  it('works with an empty state', () => {
    const empty = buildPlan(DEFAULT_STATE);
    expect(empty).toContain('لم تكتمل أسئلة البوصلة');
  });
});

describe('guessPath', () => {
  it('sends a beginner with little time to learning', () => {
    expect(guessPath({ q1: 'nothing', q2: 'low', q3: 'cash', q4: 'silence' })).toBe('learn');
  });
  it('sends a builder wanting an asset to a product', () => {
    expect(guessPath({ q1: 'build', q2: 'high', q3: 'asset', q4: 'boring' })).toBe('product');
  });
  it('sends a talker to content', () => {
    expect(guessPath({ q1: 'talk', q2: 'mid', q3: 'audience', q4: 'silence' })).toBe('content');
  });
  it('always returns a known key', () => {
    const keys = ['freelance', 'service', 'product', 'content', 'learn'];
    for (const q1 of ['build', 'talk', 'make', 'nothing'])
      for (const q2 of ['low', 'mid', 'high', 'full'])
        for (const q3 of ['cash', 'proof', 'audience', 'asset'])
          for (const q4 of ['rejection', 'silence', 'boring', 'uncertain'])
            expect(keys).toContain(guessPath({ q1, q2, q3, q4 }));
  });
});
