import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { computeIndex } from '../lib/index-score.js';
import { useStore } from '../lib/store.jsx';
import { usePersistentState } from '../lib/hooks.js';
import { downloadPlan } from '../lib/plan.js';
import { Reveal, SectionHeading } from './ui.jsx';

function Radar({ dimensions, color }) {
  const size = 260;
  const c = size / 2;
  const R = 96;
  const n = dimensions.length;
  const pt = (i, r) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  };

  const poly = dimensions.map((d, i) => pt(i, (Math.max(4, d.value) / 100) * R).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
      {rings.map((r) => (
        <polygon
          key={r}
          points={dimensions.map((_, i) => pt(i, r * R).join(',')).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {dimensions.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />;
      })}

      <motion.polygon
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: `${c}px ${c}px` }}
        points={poly}
        fill={`${color}22`}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {dimensions.map((d, i) => {
        const [x, y] = pt(i, (Math.max(4, d.value) / 100) * R);
        return <circle key={d.id} cx={x} cy={y} r="3.5" fill={color} />;
      })}

      {dimensions.map((d, i) => {
        const [x, y] = pt(i, R + 24);
        return (
          <text
            key={d.id}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="mono"
            fontSize="9.5"
            fill={d.value >= 60 ? '#e2e8f0' : '#64748b'}
          >
            {d.short}
          </text>
        );
      })}
    </svg>
  );
}

export default function DecisionCard() {
  const s = useStore();
  const [pm] = usePersistentState('adha.premortem', {});
  const [assets] = usePersistentState('adha.assets', {});
  const [reviews] = usePersistentState('adha.reviews', []);
  const [curriculum] = usePersistentState('adha.curriculum', {});

  const res = useMemo(
    () =>
      computeIndex({
        compass: s.compass,
        tasks: s.tasks,
        streak: s.streak,
        hours: s.hours,
        goal: s.goal,
        premortem: pm,
        assets,
        reviews,
        curriculum,
      }),
    [s.compass, s.tasks, s.streak, s.hours, s.goal, pm, assets, reviews, curriculum]
  );

  return (
    <section id="decision" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[400px] max-w-4xl rounded-full bg-[radial-gradient(ellipse,rgba(255,107,26,0.09),transparent_70%)] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Decision Card · بطاقة القرار"
            title={
              <>
                كل ما فعلته في مكان واحد. <span className="ember-text">ومؤشر واحد.</span>
              </>
            }
            desc="ستة أبعاد، كل بُعد محسوب من قسم واحد تعرفه. لا رقم غامض: أنقر على أي بُعد لترى من أين جاء. هذه ليست درجة ذكاء ولا مقياس نجاح — إنها خريطة لما أنجزته وما زال ناقصاً، وثلاث خطوات تالية مرتّبة."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_420px]">
          <div className="glass-strong relative overflow-hidden rounded-2xl p-5">
            <div className="scan-line" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">adha index</div>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="font-display text-5xl font-bold" style={{ color: res.level.color }}>
                    {res.index}
                  </span>
                  <span className="text-[12px] text-slate-500">/ 100</span>
                  <span
                    className="rounded-full border px-2.5 py-0.5 text-[11px]"
                    style={{ borderColor: `${res.level.color}55`, color: res.level.color, background: `${res.level.color}12` }}
                  >
                    {res.level.ar}
                  </span>
                </div>
              </div>
              <button onClick={() => downloadPlan(s)} className="btn btn-ghost px-4 py-2 text-[11.5px]">
                ⤓ نزّل خطتي
              </button>
            </div>

            <p className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-[12px] leading-relaxed text-slate-300">
              {res.level.read}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {res.dimensions.map((d) => (
                <motion.a
                  key={d.id}
                  href={`#${d.id === 'awareness' ? 'premortem' : d.id === 'assets' ? 'vault' : d.id === 'clarity' ? 'compass' : d.id === 'plan' ? 'calc' : d.id === 'execution' ? 'roadmap' : 'tracker'}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5 transition hover:border-ember/30 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {d.icon} {d.short}
                    </span>
                    <span className="mono text-[11px] font-bold text-white">{d.value}</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: d.value >= 60 ? '#a3e635' : d.value >= 30 ? '#fbbf24' : '#ef4444' }}
                      animate={{ width: `${d.value}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="mono mt-1 text-[8.5px] text-slate-600">{d.source}</div>
                </motion.a>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-ember/25 bg-ember/[0.06] p-3.5">
              <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-ember">do this next</div>
              <p className="text-[12px] leading-relaxed text-slate-200">{res.level.action}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="glass rounded-2xl p-4">
              <div className="mb-1 h-[250px] w-full">
                <Radar dimensions={res.dimensions} color={res.level.color} />
              </div>
              <p className="mono text-center text-[9px] text-slate-600">
                // radar · six dimensions · recalculated live
              </p>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="mono mb-2.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                three next moves
              </div>
              <div className="space-y-1.5">
                {res.actions.length === 0 ? (
                  <p className="py-3 text-center text-[11.5px] text-lime">
                    لا ثغرات أساسية متبقية. الخطوة التالية: ارفع السعر ووثّق القالب.
                  </p>
                ) : (
                  res.actions.map((a, i) => (
                    <a
                      key={a.ar}
                      href={a.href}
                      className="flex items-start gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5 transition hover:border-lime/30 hover:bg-lime/[0.05]"
                    >
                      <span className="mono mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-lime/30 text-[9px] text-lime">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11.5px] text-slate-200">{a.ar}</span>
                        <span className="block text-[10px] leading-relaxed text-slate-500">{a.why}</span>
                      </span>
                      <span className="text-slate-600">→</span>
                    </a>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10.5px] leading-relaxed text-slate-500">
                <span className="text-slate-300">كيف يُحسب المؤشر؟</span> مجموع مرجّح للأبعاد الستة (أصول 22، تنفيذ 20،
                اتجاه 18، وعي 16، خطة 14، استمرار 10). الأوزان مكتوبة في{' '}
                <span className="mono text-slate-400">src/lib/index-score.js</span> ويمكنك تعديلها.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
