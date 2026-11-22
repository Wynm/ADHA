import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ASSETS, ASSET_LEVELS, ASSET_TRUTHS, scoreAssets } from '../lib/assets.js';
import { usePersistentState } from '../lib/hooks.js';
import { Reveal, SectionHeading } from './ui.jsx';

export default function AssetVault() {
  const [levels, setLevels] = usePersistentState('adha.assets', {});
  const res = useMemo(() => scoreAssets(levels), [levels]);

  const set = (id, v) => setLevels((p) => ({ ...p, [id]: v }));

  return (
    <section id="vault" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-[420px] max-w-4xl rounded-full bg-[radial-gradient(ellipse,rgba(163,230,53,0.07),transparent_70%)] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Asset Vault · خزانة الأصول"
            tone="lime"
            title={
              <>
                الدخل نتيجة. <span className="ember-text">الأصول سبب.</span>
              </>
            }
            desc="ثمانية أصول يملكها كل من ينجح في العمل عبر الإنترنت — أو يفتقدها كل من يتوقف. قيّم نفسك بصدق في كل أصل، وستعرف بالضبط ما هي الخطوة التالية، لا الخطوات العشر."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-2">
            {ASSETS.map((a, i) => {
              const v = levels[a.id] ?? 0;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="rounded-xl border border-white/[0.08] bg-panel/50 p-3.5"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-sm">
                      {a.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-[12.5px] font-semibold text-white">{a.ar}</span>
                        <span className="mono text-[9px] text-slate-600">weight {a.weight}</span>
                      </div>
                      <p className="mt-0.5 text-[10.5px] leading-relaxed text-slate-500">{a.desc}</p>

                      <div className="mt-2 grid gap-1 sm:grid-cols-2">
                        {ASSET_LEVELS.map((lvl) => {
                          const sel = v === lvl.v;
                          return (
                            <button
                              key={lvl.v}
                              onClick={() => set(a.id, lvl.v)}
                              className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-start text-[10.5px] transition ${
                                sel
                                  ? 'border-lime/50 bg-lime/10 text-lime'
                                  : 'border-white/[0.07] bg-white/[0.012] text-slate-500 hover:border-white/25 hover:text-slate-300'
                              }`}
                            >
                              <span className="mono shrink-0 text-[10px]">{lvl.short}</span>
                              <span className="truncate">{a.levels[lvl.v]}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: v === 3 ? '#a3e635' : v === 2 ? '#22d3ee' : v === 1 ? '#fbbf24' : '#475569' }}
                          animate={{ width: `${(v / 3) * 100}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass-strong overflow-hidden rounded-2xl p-5">
              <div className="mono mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                <span>vault score</span>
                <span>
                  {res.earned}/{res.total}
                </span>
              </div>

              <div className="relative mx-auto grid h-32 w-32 place-items-center">
                <svg viewBox="0 0 120 120" className="absolute h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#a3e635"
                    strokeWidth="9"
                    strokeLinecap="round"
                    animate={{ strokeDasharray: `${(res.pct / 100) * Math.PI * 100} ${Math.PI * 100}` }}
                    transition={{ duration: 0.7 }}
                  />
                </svg>
                <div className="text-center">
                  <div className="font-display mono text-3xl font-bold text-lime">{res.pct}</div>
                  <div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-600">/ 100</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-2">
                  <div className="text-[9px] text-slate-600">أقوى أصل</div>
                  <div className="mt-0.5 text-[11px] text-slate-200">
                    {res.strongest?.icon} {res.strongest?.ar}
                  </div>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-2">
                  <div className="text-[9px] text-slate-600">أصول مكتملة</div>
                  <div className="mt-0.5 mono text-[11px] text-slate-200">
                    {ASSETS.filter((a) => (levels[a.id] ?? 0) === 3).length}/{ASSETS.length}
                  </div>
                </div>
              </div>

              {res.top && (
                <div className="mt-3 rounded-xl border border-ember/25 bg-ember/[0.07] p-3">
                  <div className="mono mb-1 text-[9px] uppercase tracking-[0.18em] text-ember">the one gap to close</div>
                  <div className="text-[12px] font-semibold text-white">
                    {res.top.icon} {res.top.ar}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-300">{res.top.next}</p>
                </div>
              )}

              {res.gaps.length > 1 && (
                <div className="mt-3 space-y-1">
                  <div className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">then, in order</div>
                  {res.gaps.slice(1, 4).map((g) => (
                    <div key={g.id} className="flex items-center justify-between rounded-md border border-white/[0.06] px-2 py-1">
                      <span className="text-[10.5px] text-slate-400">
                        {g.icon} {g.ar}
                      </span>
                      <span className="mono text-[9px] text-slate-600">{Math.round((g.v / 3) * 100)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 glass rounded-2xl p-4">
              <div className="mono mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">four truths</div>
              <div className="space-y-2">
                {ASSET_TRUTHS.map((t) => (
                  <div key={t.ar}>
                    <div className="text-[11.5px] font-medium text-slate-200">· {t.ar}</div>
                    <div className="text-[10.5px] leading-relaxed text-slate-500">{t.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
