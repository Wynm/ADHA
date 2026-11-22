import { describe, expect, it } from 'vitest';
import { ARCADE } from '../src/data/opportunities.js';
import { PHASES } from '../src/data/roadmap.js';
import { CASES } from '../src/data/cases.js';
import { LEXICON } from '../src/data/lexicon.js';
import { FAQ } from '../src/data/faq.js';
import { SCRIPTS } from '../src/data/scripts.js';

/**
 * حرس المحتوى: القواعد التي تجعل المشروع جديراً بالثقة.
 * أي نص يخترقها يُفشل البناء — لا مراجعة بشرية متأخرة.
 */

const ALL_TEXT = [
  ...ARCADE.flatMap((a) => [a.ar, a.arDesc, a.proof, ...(a.skills || [])]),
  ...PHASES.flatMap((p) => [p.title, p.subtitle, p.promise, p.metric, p.output, ...p.tasks.map((t) => t.t + ' ' + t.hint)]),
  ...CASES.flatMap((c) => [c.situation, c.lesson, ...c.plan.map((p) => p.t), ...c.breaks]),
  ...LEXICON.flatMap((l) => [l.ar, l.d]),
  ...FAQ.flatMap((f) => [f.q, f.a]),
  ...SCRIPTS.flatMap((s) => [s.body, s.why, s.avoid]),
].join('\n');

const FORBIDDEN = [
  { re: /اربح\s*\d+\s*(دولار|\$)/u, why: 'وعد دخل صريح' },
  { re: /ربح\s*(سريع|مضمون|خيالي)/u, why: 'وعد ربح مضمون أو سريع' },
  { re: /(دخل|ربح)\s*غير\s*محدود/iu, why: 'وعد غير واقعي' },
  { re: /اضمن\s*لك/u, why: 'ضمان شخصي' },
];

describe('content guardrails', () => {
  it('contains no income guarantees or hype phrasing', () => {
    for (const f of FORBIDDEN) {
      expect(f.re.test(ALL_TEXT), `ممنوع: ${f.why}`).toBe(false);
    }
  });

  it('mentions risk / honesty concepts across the content', () => {
    const concepts = ['مخاطر', 'عقد', 'دليل', 'وهم'];
    for (const c of concepts) expect(ALL_TEXT).toContain(c);
  });

  it('every arena entry declares a risk level, time-to-first-dollar and proof', () => {
    for (const a of ARCADE) {
      expect(['low', 'medium', 'high']).toContain(a.risk);
      expect(a.timeToFirstDollar.length).toBeGreaterThan(2);
      expect(a.proof.length).toBeGreaterThan(10);
    }
  });

  it('every roadmap phase has a measurable success metric', () => {
    for (const p of PHASES) {
      expect(p.metric.length).toBeGreaterThan(10);
      expect(p.output.length).toBeGreaterThan(5);
    }
  });

  it('lexicon has no duplicates and at least 30 terms', () => {
    expect(LEXICON.length).toBeGreaterThanOrEqual(30);
    const terms = LEXICON.map((l) => l.t.toLowerCase());
    expect(new Set(terms).size).toBe(terms.length);
  });

  it('FAQ answers are substantive (no one-liners)', () => {
    for (const f of FAQ) {
      expect(f.a.length).toBeGreaterThan(80);
      expect(f.q.length).toBeGreaterThan(10);
    }
  });
});
