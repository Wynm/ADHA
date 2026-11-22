import { useState } from 'react';
import { motion } from 'framer-motion';
import { ANTI_PATTERNS, PHASES } from '../data/roadmap.js';
import { useStore } from '../lib/store.jsx';
import { Reveal, SectionHeading } from './ui.jsx';

export default function Roadmap() {
  const [openPhase, setOpenPhase] = useState(PHASES[0].id);
  const store = useStore();
  const done = store.tasks || {};
  const setDone = (v) => store.setKey('tasks', typeof v === 'function' ? v(done) : v);

  const toggle = (phaseId, d) => store.toggleTask(`${phaseId}:${d}`);

  const totalDone = Object.values(done).filter(Boolean).length;
  const totalTasks = PHASES.reduce((s, p) => s + p.tasks.length, 0);
  const pct = Math.round((totalDone / totalTasks) * 100);

  return (
    <section id="roadmap" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Roadmap · الخريطة"
            title={
              <>
                تسعون يوماً. <span className="ember-text">لا تسعون خطوة.</span>
              </>
            }
            desc="ثلاث مراحل فقط: أوقف النزيف، اصنع دليلاً، اقبض أول دولار. علّم المهام المنجزة — التقدّم يُحفظ في متصفحك، لأن هذا التزامك أنت لا إحصائياتنا."
          />
        </Reveal>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-ember via-amber-300 to-lime"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="mono shrink-0 text-[11px] text-slate-400">
              {totalDone}/{totalTasks} · {pct}%
            </span>
          </div>
          {totalDone > 0 && (
            <button
              onClick={() => setDone({})}
              className="mono rounded-lg border border-white/10 px-2.5 py-1 text-[10px] text-slate-500 hover:text-white"
            >
              reset
            </button>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {PHASES.map((p) => {
            const isOpen = openPhase === p.id;
            const phaseDone = p.tasks.filter((t) => done[`${p.id}:${t.d}`]).length;
            return (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border transition-colors"
                style={{ borderColor: isOpen ? `${p.color}44` : 'rgba(255,255,255,0.08)' }}
              >
                <button
                  onClick={() => setOpenPhase(isOpen ? null : p.id)}
                  className="flex w-full items-center gap-4 bg-panel/50 p-4 text-start transition hover:bg-white/[0.03] md:p-5"
                >
                  <div
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-sm font-bold"
                    style={{ borderColor: `${p.color}55`, color: p.color, background: `${p.color}12` }}
                  >
                    {phaseDone === p.tasks.length ? '✓' : p.days.split(' ')[1]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mono text-[9.5px] uppercase tracking-[0.2em] text-slate-500">{p.days}</div>
                    <h3 className="font-display mt-0.5 text-lg font-bold text-white">{p.title}</h3>
                    <p className="text-[12px] text-slate-500">{p.subtitle}</p>
                  </div>
                  <div className="hidden shrink-0 items-center gap-3 sm:flex">
                    <div className="mono text-[10.5px] text-slate-500">
                      {phaseDone}/{p.tasks.length}
                    </div>
                    <div className="h-1 w-20 overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${(phaseDone / p.tasks.length) * 100}%`, background: p.color }}
                      />
                    </div>
                  </div>
                  <span className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-white/[0.08] bg-ink/40 px-4 py-4 md:px-5"
                  >
                    <p className="mb-4 rounded-xl border-s-2 p-3 text-[12.5px] leading-relaxed text-slate-300" style={{ borderColor: p.color, background: `${p.color}0a` }}>
                      {p.promise}
                    </p>
                    <div className="space-y-1.5">
                      {p.tasks.map((t) => {
                        const key = `${p.id}:${t.d}`;
                        const isDone = !!done[key];
                        return (
                          <button
                            key={t.d}
                            onClick={() => toggle(p.id, t.d)}
                            className="group flex w-full items-start gap-3 rounded-xl border border-transparent p-2.5 text-start transition hover:border-white/10 hover:bg-white/[0.025]"
                          >
                            <span
                              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[10px] transition"
                              style={
                                isDone
                                  ? { borderColor: p.color, background: p.color, color: '#05060a' }
                                  : { borderColor: 'rgba(255,255,255,0.18)' }
                              }
                            >
                              {isDone ? '✓' : ''}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-baseline gap-2">
                                <span className="mono shrink-0 text-[9.5px] text-slate-600">D{t.d}</span>
                                <span className={`text-[13px] ${isDone ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                  {t.t}
                                </span>
                              </span>
                              <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-600">{t.hint}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 grid gap-2 border-t border-white/[0.08] pt-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-2.5">
                        <div className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">output</div>
                        <div className="mt-0.5 text-[11.5px] text-slate-300">{p.output}</div>
                      </div>
                      <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-2.5">
                        <div className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">success metric</div>
                        <div className="mt-0.5 text-[11.5px] text-slate-300">{p.metric}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-2xl border border-red-400/20 bg-red-500/[0.05] p-5">
            <div className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-red-300">anti-patterns · لا تدخل هنا</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {ANTI_PATTERNS.map((a) => (
                <div key={a.ar} className="rounded-xl border border-white/[0.08] bg-black/20 p-3">
                  <div className="text-[12.5px] font-medium text-slate-200">{a.ar}</div>
                  <div className="mt-1 text-[11px] leading-relaxed text-slate-500">{a.why}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
