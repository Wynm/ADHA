import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PRESETS, RULES, scan } from '../lib/scamRules.js';
import { Reveal, SectionHeading } from './ui.jsx';

function Gauge({ score, color }) {
  const R = 54;
  const C = 2 * Math.PI * R;
  const dash = (score / 100) * C;
  return (
    <div className="relative grid place-items-center">
      <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
        <motion.circle
          cx="70"
          cy="70"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          initial={{ strokeDasharray: `0 ${C}` }}
          animate={{ strokeDasharray: `${dash} ${C}` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display mono text-3xl font-bold" style={{ color }}>
          {score}
        </div>
        <div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-500">risk</div>
      </div>
    </div>
  );
}

export default function Shield() {
  const [text, setText] = useState('');
  const [scanned, setScanned] = useState(false);

  const res = useMemo(() => scan(text), [text]);
  const active = scanned && !res.empty;

  const run = (value) => {
    setText(value);
    setScanned(true);
  };

  const charTone =
    text.length === 0
      ? 'border-white/10'
      : res.score >= 45
        ? 'border-red-400/40'
        : res.score >= 20
          ? 'border-amber-400/40'
          : 'border-lime/30';

  return (
    <section id="shield" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Shield · الماسح"
            tone="lime"
            title={
              <>
                الصق العرض المشبوه. <span className="ember-text">وسنشرّحه.</span>
              </>
            }
            desc="لا يمكن لأحد أن يحميك من كل شيء، لكن 10 أنماط لغوية تتكرر في معظم مخططات الاحتيال. محركنا يكتشفها ويعرض الوزن والسبب — لا حكماً غامضاً. يعمل بالكامل في متصفحك، ولا يُرسل نصك إلى أي خادم."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_400px]">
          {/* ── input ── */}
          <div className="space-y-3">
            <div className={`glass-strong overflow-hidden rounded-2xl border transition-colors ${charTone}`}>
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">offer.input</span>
                <div className="flex items-center gap-2">
                  <span className="mono text-[10px] text-slate-600">{text.length} chars</span>
                  {text && (
                    <button
                      onClick={() => {
                        setText('');
                        setScanned(false);
                      }}
                      className="mono rounded border border-white/10 px-2 py-0.5 text-[10px] text-slate-400 hover:text-white"
                    >
                      clear
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setScanned(false);
                }}
                rows={6}
                dir="auto"
                placeholder="مثال: فرصة استثمارية مضمونة، ربح 3% يومياً بدون خبرة…"
                className="w-full resize-none bg-transparent px-4 py-4 text-[13.5px] leading-relaxed text-slate-200 outline-none placeholder:text-slate-600"
              />
              <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.08] px-4 py-3">
                <button onClick={() => run(text)} disabled={text.trim().length < 8} className="btn btn-primary px-5 py-2 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-40">
                  تحليل الآن
                </button>
                <span className="mono text-[10px] text-slate-600">// أو جرّب عيّنة:</span>
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => run(p.text)}
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-lime/40 hover:text-lime"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* rules legend */}
            <div className="glass rounded-2xl p-4">
              <div className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                detection rules · {RULES.length} patterns
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {RULES.map((r) => {
                  const hit = active && res.hits.some((h) => h.id === r.id);
                  return (
                    <div
                      key={r.id}
                      className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-[11px] transition ${
                        hit
                          ? 'border-red-400/35 bg-red-500/10 text-red-200'
                          : 'border-white/[0.06] bg-white/[0.012] text-slate-500'
                      }`}
                    >
                      <span className="truncate">{r.label}</span>
                      <span className="mono shrink-0 ps-2 text-[9.5px] text-slate-600">+{r.weight}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── output ── */}
          <div className="space-y-3">
            <div className="glass-strong relative overflow-hidden rounded-2xl p-5">
              {active && <div className="scan-line" />}
              <AnimatePresence mode="wait">
                {!active ? (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-10 text-center">
                    <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full border border-white/10 text-2xl">🛡️</div>
                    <p className="text-[13px] text-slate-400">بانتظار نص للتحليل…</p>
                    <p className="mono mt-1 text-[10px] text-slate-600">no data leaves your browser</p>
                  </motion.div>
                ) : (
                  <motion.div key="res" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="flex flex-col items-center">
                      <Gauge score={res.score} color={res.verdict.color} />
                      <div className="mt-1 text-center">
                        <div className="font-display text-lg font-bold" style={{ color: res.verdict.color }}>
                          {res.verdict.ar}
                        </div>
                        <div className="mono text-[9.5px] uppercase tracking-[0.2em] text-slate-600">{res.verdict.en}</div>
                      </div>
                      <p className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-[11.5px] leading-relaxed text-slate-300">
                        {res.verdict.advice}
                      </p>
                    </div>

                    {res.hits.length > 0 && (
                      <div className="mt-4 space-y-1.5">
                        <div className="mono text-[9.5px] uppercase tracking-[0.2em] text-slate-600">flags detected</div>
                        {res.hits.map((h) => (
                          <details key={h.id} className="group rounded-lg border border-red-400/20 bg-red-500/[0.06] p-2.5">
                            <summary className="flex cursor-pointer list-none items-center justify-between text-[11.5px] text-red-200">
                              <span>{h.label}</span>
                              <span className="mono text-[9.5px] text-red-400/70">+{Math.round(h.weight * Math.min(1.5, 0.75 + h.matches * 0.25))}</span>
                            </summary>
                            <p className="mt-2 border-t border-red-400/15 pt-2 text-[11px] leading-relaxed text-slate-400">
                              {h.why}
                            </p>
                          </details>
                        ))}
                      </div>
                    )}

                    {res.credits.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <div className="mono text-[9.5px] uppercase tracking-[0.2em] text-slate-600">positive signals</div>
                        {res.credits.map((c) => (
                          <div key={c.id} className="flex items-center justify-between rounded-lg border border-lime/20 bg-lime/[0.05] px-2.5 py-1.5 text-[11px] text-lime">
                            <span>{c.label}</span>
                            <span className="mono text-[9.5px] opacity-70">{c.weight}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="mono mt-4 border-t border-white/[0.08] pt-3 text-[9.5px] leading-relaxed text-slate-600">
                      score = Σ(weights) clamped 0–100 · هذا مؤشر نمطي وليس حكماً قضائياً.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
              <div className="mono mb-1.5 text-[10px] uppercase tracking-[0.18em] text-amber-300">before you send money</div>
              <ul className="space-y-1.5 text-[11.5px] leading-relaxed text-slate-300">
                <li>· اطلب العقد مكتوباً. الرفض = الجواب.</li>
                <li>· ابحث عن اسم الشخص + كلمة "scam" بالإنكليزية.</li>
                <li>· أي «سحب» يحتاج رسوماً إضافية ليس سحباً.</li>
                <li>· لا تُودِع مالاً في منصة لا تفهم كيف تُولّد دخلاً.</li>
                <li>· إن شعرت بأن الوقت يُضغط عليك، فأنت في المكان الخطأ.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
