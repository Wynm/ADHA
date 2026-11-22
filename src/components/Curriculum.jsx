import { useState } from 'react';
import { motion } from 'framer-motion';
import { CURRICULUM_RULES, TRACKS_CURRICULUM, WEEKS } from '../data/curriculum.js';
import { usePersistentState } from '../lib/hooks.js';
import { Reveal, SectionHeading } from './ui.jsx';

export default function Curriculum() {
  const [track, setTrack] = useState('web');
  const [open, setOpen] = useState(1);
  const [done, setDone] = usePersistentState('adha.curriculum', {});
  const total = WEEKS.length;
  const completed = WEEKS.filter((w) => (done[`${track}:${w.w}`] || []).length === w.tasks.length).length;

  const toggle = (w, i) => {
    const key = `${track}:${w}`;
    const arr = done[key] || [];
    const next = arr.includes(i) ? arr.filter((x) => x !== i) : [...arr, i];
    setDone((p) => ({ ...p, [key]: next }));
  };

  return (
    <section id="curriculum" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Curriculum · مسار التعلّم"
            tone="cyan"
            title={
              <>
                ثمانية أسابيع. <span className="ember-text">صفر دولارات.</span>
              </>
            }
            desc="لا حاجة إلى كورس مدفوع في أول شهرين. هذا مسار مبني على قاعدة واحدة: كل أسبوع له مخرج يمكن عرضه على شخص آخر. اختر مسارك، وعلّم ما أنجزته — التقدّم يُحفظ على جهازك."
          />
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {TRACKS_CURRICULUM.map((t) => (
            <button
              key={t.id}
              onClick={() => setTrack(t.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] transition ${
                track === t.id
                  ? 'border-cyan/50 bg-cyan/15 text-cyan'
                  : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
              }`}
            >
              <span>{t.emoji}</span>
              {t.ar}
            </button>
          ))}
          <span className="mono ms-auto text-[10.5px] text-slate-600">
            {completed}/{total} weeks complete
          </span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-2">
            {WEEKS.map((w) => {
              const arr = done[`${track}:${w.w}`] || [];
              const isOpen = open === w.w;
              const complete = arr.length === w.tasks.length;
              return (
                <div
                  key={w.w}
                  className={`overflow-hidden rounded-xl border transition ${
                    complete
                      ? 'border-lime/30 bg-lime/[0.04]'
                      : isOpen
                        ? 'border-cyan/30 bg-panel/60'
                        : 'border-white/[0.08] bg-panel/35'
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : w.w)}
                    className="flex w-full items-center gap-3 p-3.5 text-start"
                  >
                    <span
                      className={`mono grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-[11px] ${
                        complete ? 'border-lime/50 bg-lime/15 text-lime' : 'border-white/12 text-slate-400'
                      }`}
                    >
                      {complete ? '✓' : `W${w.w}`}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12.5px] font-semibold text-white">{w.title}</span>
                      <span className="block text-[10.5px] text-slate-500">{w.goal}</span>
                    </span>
                    <span className="mono hidden shrink-0 text-[9.5px] text-slate-600 sm:block">
                      {arr.length}/{w.tasks.length}
                    </span>
                    <span className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
                  </button>

                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-white/[0.07] px-3.5 py-3">
                      <div className="mb-2 rounded-lg border-s-2 border-cyan/50 bg-cyan/[0.05] px-2.5 py-1.5 text-[11.5px] text-slate-300">
                        <span className="mono text-[9px] uppercase tracking-wider text-cyan">this week · </span>
                        {w[track]}
                      </div>
                      <div className="space-y-1">
                        {w.tasks.map((t, i) => {
                          const isDone = arr.includes(i);
                          return (
                            <button
                              key={t}
                              onClick={() => toggle(w.w, i)}
                              className="flex w-full items-start gap-2 rounded-md px-1.5 py-1.5 text-start transition hover:bg-white/[0.03]"
                            >
                              <span
                                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border text-[9px] ${
                                  isDone ? 'border-lime bg-lime text-ink' : 'border-white/20'
                                }`}
                              >
                                {isDone ? '✓' : ''}
                              </span>
                              <span className={`text-[11.5px] ${isDone ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                {t}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5">
                        <span className="mono text-[9px] uppercase tracking-wider text-slate-600">output · </span>
                        <span className="text-[11px] text-slate-300">{w.output}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
            <div className="glass rounded-2xl p-4">
              <div className="mono mb-2.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">four rules</div>
              <div className="space-y-2">
                {CURRICULUM_RULES.map((r) => (
                  <div key={r.ar} className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5">
                    <div className="text-[11.5px] font-medium text-slate-200">{r.ar}</div>
                    <div className="mt-0.5 text-[10.5px] leading-relaxed text-slate-500">{r.d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-ember/25 bg-ember/[0.06] p-4">
              <div className="mono mb-1.5 text-[10px] uppercase tracking-[0.18em] text-ember">the math</div>
              <p className="text-[11.5px] leading-relaxed text-slate-300">
                8 أسابيع × 14 ساعة = <span className="mono text-white">112 ساعة</span>. هذا أقل من 3 أسابيع عمل بدوام
                كامل — وهو ما يفصل بين «أتابع محتوى» و«أملك مهارة تدفع».
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10.5px] leading-relaxed text-slate-500">
                المسار مرن: يمكنك استبدال مهام الأسبوع بمهام من مجالك، بشرط أن يبقى المخرج قابلاً للعرض على شخص آخر.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
