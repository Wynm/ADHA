import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FACTORS, evaluate } from '../lib/premortem.js';
import { usePersistentState } from '../lib/hooks.js';
import { Reveal, SectionHeading } from './ui.jsx';

export default function PreMortem() {
  const [answers, setAnswers] = usePersistentState('adha.premortem', {});
  const res = useMemo(() => evaluate(answers), [answers]);
  const answered = Object.keys(answers).length;

  const set = (id, k) => setAnswers((p) => ({ ...p, [id]: k }));

  return (
    <section id="premortem" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-96 max-w-4xl rounded-full bg-[radial-gradient(ellipse,rgba(239,68,68,0.07),transparent_70%)] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Pre-Mortem · تشريح الفشل"
            tone="ember"
            title={
              <>
                تخيّل أنك فشلت بعد ستة أشهر. <span className="ember-text">لماذا؟</span>
              </>
            }
            desc="أقوى سؤال في اتخاذ القرار ليس «كيف أنجح؟» بل «كيف أفشل؟». أجب عن خمسة عوامل، وسنخبرك بأمانة أين تكمن نقطة الانهيار المتوقعة — قبل أن تدفع ثمنها بالوقت."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-2.5">
            {FACTORS.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="rounded-2xl border border-white/[0.08] bg-panel/50 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                    {f.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[13.5px] font-semibold text-white">{f.ar}</span>
                      <span className="mono text-[9px] text-slate-600">weight {f.weight}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{f.desc}</p>
                    <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                      {f.options.map((o) => {
                        const sel = answers[f.id] === o.k;
                        return (
                          <button
                            key={o.k}
                            onClick={() => set(f.id, o.k)}
                            className={`rounded-lg border px-2.5 py-1.5 text-start text-[11px] transition ${
                              sel
                                ? 'border-ember/50 bg-ember/12 text-ember'
                                : 'border-white/[0.08] bg-white/[0.015] text-slate-400 hover:border-white/25 hover:text-white'
                            }`}
                          >
                            {o.ar}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass-strong overflow-hidden rounded-2xl p-5">
              <div className="mono mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                <span>survival index</span>
                <span>{answered}/5</span>
              </div>

              <div className="relative mx-auto grid h-36 w-36 place-items-center">
                <svg viewBox="0 0 120 120" className="absolute h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={res.complete ? res.mode.color : '#334155'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(res.pct / 100) * Math.PI * 100} ${Math.PI * 100}`}
                    animate={{ strokeDasharray: `${(res.pct / 100) * Math.PI * 100} ${Math.PI * 100}` }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
                <div className="text-center">
                  <div className="font-display mono text-3xl font-bold" style={{ color: res.complete ? res.mode.color : '#475569' }}>
                    {res.pct}
                  </div>
                  <div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-600">/ 100</div>
                </div>
              </div>

              {res.complete ? (
                <>
                  <div className="mt-2 text-center">
                    <div className="font-display text-lg font-bold" style={{ color: res.mode.color }}>
                      {res.mode.ar}
                    </div>
                    <div className="mono text-[9.5px] uppercase tracking-[0.2em] text-slate-600">
                      est. quit probability ≈ {res.mode.risk}
                    </div>
                  </div>
                  <p className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-[11.5px] leading-relaxed text-slate-300">
                    {res.mode.advice}
                  </p>

                  {res.gaps.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <div className="mono text-[9.5px] uppercase tracking-[0.2em] text-slate-600">weakest links</div>
                      {res.gaps.slice(0, 3).map((g) => (
                        <div key={g.id} className="flex items-center justify-between rounded-lg border border-red-400/20 bg-red-500/[0.06] px-2.5 py-1.5">
                          <span className="text-[11px] text-red-200">
                            {g.icon} {g.ar}
                          </span>
                          <span className="mono text-[9.5px] text-red-400/70">{Math.round(g.v * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 rounded-xl border border-lime/20 bg-lime/[0.05] p-3">
                    <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-lime">one move only</div>
                    <p className="text-[11.5px] leading-relaxed text-slate-200">
                      {res.gaps.length ? `لا تحاول إصلاح كل شيء. ارفع «${res.gaps[0].ar}» درجة واحدة هذا الشهر، وستتحرك كل الأرقام.` : 'اختر مساراً واحداً والتزم 90 يوماً. الخطر الوحيد الآن هو التشتت.'}
                    </p>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-center text-[11.5px] text-slate-500">
                  أجب على العوامل الخمسة لرؤية نقطة الانهيار المتوقعة…
                </p>
              )}
            </div>

            <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10.5px] leading-relaxed text-slate-500">
                الأوزان مبنية على أنماط توقف شائعة (وقت غير واقعي، غياب الدليل، نقص الشبكة)، وليست تنبؤاً علمياً. الغرض
                إجبارك على رؤية أضعف حلقة قبل أن تكتشفها بالطريقة المكلفة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
