import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HONEST_BASE, PARTS, SCAM_BASE } from '../data/scamLab.js';
import { RULES, scan } from '../lib/scamRules.js';
import { Reveal, SectionHeading } from './ui.jsx';

export default function ScamLab() {
  const [on, setOn] = useState(['guarantee', 'daily']);
  const [honest, setHonest] = useState(false);

  const active = PARTS.filter((p) => on.includes(p.id));
  const text = useMemo(() => {
    const parts = honest ? [HONEST_BASE] : [SCAM_BASE, ...active.map((p) => p.text)];
    return parts.join(' ');
  }, [active, honest]);

  const res = useMemo(() => scan(text), [text]);
  const toggle = (id) => setOn((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section id="scamlab" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Scam Lab · مختبر الاحتيال"
            tone="ember"
            title={
              <>
                ابنِ العرض المزيّف بنفسك. <span className="ember-text">لن تنخدع به بعدها.</span>
              </>
            }
            desc="أفضل حماية من الاحتيال ليست قائمة تحذيرات — بل أن تصنع الفخ بيدك مرة واحدة. أضف مكوّناً، شاهد الدرجة ترتفع، واقرأ القاعدة التي كشفته. ثم اضغط «اجعلها صادقة» وفرق الدرجة سيُعلّمك ما لا تتعلمه من مقال."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[420px_1fr]">
          <div className="glass rounded-2xl p-4">
            <div className="mono mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <span>components</span>
              <span>{on.length}/10</span>
            </div>
            <div className="space-y-1.5">
              {PARTS.map((p) => {
                const isOn = on.includes(p.id) && !honest;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setHonest(false);
                      toggle(p.id);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-start transition ${
                      isOn
                        ? 'border-red-400/40 bg-red-500/10 text-red-100'
                        : 'border-white/[0.08] bg-white/[0.015] text-slate-400 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <span
                      className={`grid h-4 w-4 shrink-0 place-items-center rounded border text-[9px] ${
                        isOn ? 'border-red-400 bg-red-400/30' : 'border-white/20'
                      }`}
                    >
                      {isOn ? '✓' : ''}
                    </span>
                    <span className="flex-1 text-[11.5px]">{p.ar}</span>
                    <span className="mono shrink-0 text-[8.5px] text-slate-600">{p.rule}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setHonest(false);
                  setOn(PARTS.map((p) => p.id));
                }}
                className="flex-1 rounded-lg border border-red-400/30 bg-red-500/10 px-2 py-1.5 text-[10.5px] text-red-200 transition hover:bg-red-500/20"
              >
                استخدم كل الأجزاء
              </button>
              <button
                onClick={() => {
                  setHonest(true);
                  setOn([]);
                }}
                className="flex-1 rounded-lg border border-lime/30 bg-lime/10 px-2 py-1.5 text-[10.5px] text-lime transition hover:bg-lime/20"
              >
                اجعلها صادقة
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className={`glass-strong relative overflow-hidden rounded-2xl p-4 transition-colors ${res.score >= 45 ? 'border-red-400/30' : 'border-lime/30'}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">generated offer</span>
                <span className="mono text-[10px] text-slate-600">{text.length} chars</span>
              </div>
              <p className="min-h-[76px] text-[13px] leading-[2] text-slate-200" dir="auto">
                {text}
              </p>

              <div className="mt-3 border-t border-white/[0.08] pt-3">
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-500">درجة الخطر كما يقرأها الماسح</span>
                  <span className="mono text-lg font-bold" style={{ color: res.verdict.color }}>
                    {res.score}/100
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: res.verdict.color }}
                    animate={{ width: `${res.score}%` }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
                <div className="mt-1.5 text-[11px] font-medium" style={{ color: res.verdict.color }}>
                  {res.verdict.ar}
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="mono mb-2.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                rules fired · القواعد المُطلقة
              </div>
              <AnimatePresence mode="popLayout">
                {res.hits.length === 0 ? (
                  <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11.5px] text-lime">
                    لا قاعدة انطلقت. لو كان كل عرض في السوق بهذا الوضوح، لما احتجنا هذا القسم.
                  </motion.p>
                ) : (
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {res.hits.map((h) => (
                      <motion.div
                        key={h.id}
                        layout
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-lg border border-red-400/20 bg-red-500/[0.06] px-2.5 py-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-red-200">{h.label}</span>
                          <span className="mono text-[9px] text-red-400/70">+{h.weight}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-slate-600">what you learned</div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  الاحتيال ليس جملة واحدة، بل <span className="text-slate-200">تركيبة</span>: وعد + إلحاح + شرط دفع +
                  مجتمع مغلق. كل عنصر بمفرده قد يكون مشروعاً، والتركيبة هي الإشارة.
                </p>
              </div>
              <div className="rounded-xl border border-lime/20 bg-lime/[0.04] p-3">
                <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-lime">honest framing is boring</div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  لاحظ: الصياغة الصادقة تبدو أقل إثارة. <span className="text-slate-200">هذا بالضبط</span> سبب انخداع
                  الناس بالعروض المثيرة — لا لأنهم أغبياء، بل لأن الصدق يبدو مُمِلاً.
                </p>
              </div>
            </div>

            <details className="rounded-xl border border-white/[0.08] bg-white/[0.015] p-3">
              <summary className="mono cursor-pointer list-none text-[10px] uppercase tracking-[0.2em] text-slate-500">
                ▸ {RULES.length} rules used by the scanner
              </summary>
              <div className="mt-2 grid gap-1 sm:grid-cols-2">
                {RULES.map((r) => (
                  <div key={r.id} className="flex items-baseline justify-between gap-2 border-b border-white/[0.05] py-1 text-[10.5px]">
                    <span className="text-slate-400">{r.label}</span>
                    <span className="mono shrink-0 text-slate-600">+{r.weight}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
