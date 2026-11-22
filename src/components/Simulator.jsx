import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { HOURS_PRESETS, TRACKS, compareAll, hypeCurve, simulate } from '../lib/simulator.js';
import { fmt, Reveal, SectionHeading } from './ui.jsx';

const COLORS = ['#ff6b1a', '#22d3ee', '#a3e635', '#c084fc'];

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-[11px] shadow-xl">
      <div className="mono mb-1 text-[10px] uppercase tracking-wider text-slate-500">month {label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-slate-400">{p.name}</span>
          <span className="mono font-bold" style={{ color: p.color }}>
            ${fmt(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Simulator() {
  const [trackId, setTrackId] = useState('freelance');
  const [hours, setHours] = useState(15);
  const [view, setView] = useState('cumulative');
  const [showHype, setShowHype] = useState(false);

  const result = useMemo(() => simulate(trackId, hours), [trackId, hours]);
  const comparison = useMemo(() => compareAll(hours), [hours]);
  const hype = useMemo(() => hypeCurve(hours), [hours]);
  const track = TRACKS.find((t) => t.id === trackId);

  const chartData = result.months.map((m, i) => ({
    m: m.m,
    monthly: m.net,
    cumulative: m.cumulative,
    hype: hype[i]?.hype,
  }));

  return (
    <section id="simulator" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-[520px] max-w-5xl rounded-full bg-[radial-gradient(ellipse,rgba(34,211,238,0.09),transparent_70%)] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Simulator · المحاكي"
            tone="cyan"
            title={
              <>
                اختبر <span className="ember-text">سنتين</span> قبل أن تعيش أسبوعاً.
              </>
            }
            desc="هذا محاكي دخل، لا خدعة تسويقية. كل معادلة معلنة أدناه. اختر مساراً وعدد ساعات، وشاهد المنحنى — بما في ذلك الأشهر التي يكون فيها الدخل صفراً، وهي الأشهر التي يخفيها الجميع."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[350px_1fr]">
          {/* ── controls ── */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4">
              <div className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">01 · choose a track</div>
              <div className="space-y-1.5">
                {TRACKS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTrackId(t.id)}
                    className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-start transition ${
                      trackId === t.id
                        ? 'border-cyan/40 bg-cyan/10'
                        : 'border-white/[0.08] bg-white/[0.015] hover:border-white/20'
                    }`}
                  >
                    <span className="text-base leading-none">{t.emoji}</span>
                    <span className="flex-1">
                      <span className="block text-[12.5px] font-semibold text-white">{t.ar}</span>
                      <span className="mono block text-[9.5px] uppercase tracking-wider text-slate-500">{t.en}</span>
                    </span>
                    <span className={`mt-1 h-2 w-2 rounded-full ${trackId === t.id ? 'bg-cyan' : 'bg-white/15'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="mono mb-3 flex items-baseline justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                <span>02 · hours / week</span>
                <span className="mono text-base font-bold normal-case tracking-normal text-white">{hours}h</span>
              </div>
              <input
                aria-label="ساعات أسبوعياً"
                type="range"
                min="4"
                max="50"
                step="1"
                value={hours}
                onChange={(e) => setHours(+e.target.value)}
              />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {HOURS_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setHours(p.hours)}
                    className={`rounded-lg border px-2 py-1 text-[10.5px] transition ${
                      hours === p.hours
                        ? 'border-cyan/40 bg-cyan/10 text-cyan'
                        : 'border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.ar}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">03 · total hours</div>
              <div className="font-display text-3xl font-bold text-white">
                {fmt(result.totalHours)}
                <span className="ms-1 text-sm font-normal text-slate-500">ساعة / سنتين</span>
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-slate-500">
                هذا هو الثمن الحقيقي. لو لم تُعجبك النتيجة، الحل ليس مساراً جديداً — بل ساعات أكثر أو مهارة أعلى.
              </p>
              <button
                onClick={() => setShowHype((v) => !v)}
                className={`mt-3 w-full rounded-lg border px-3 py-2 text-[11px] transition ${
                  showHype
                    ? 'border-red-400/40 bg-red-500/10 text-red-200'
                    : 'border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {showHype ? '✕ أخفِ منحنى الوعود' : '👁 قارن بمنحنى الوعود الوهمية'}
              </button>
            </div>
          </div>

          {/* ── results ── */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { k: 'دخل الشهر 24', v: `$${fmt(result.month24)}`, s: 'شهرياً في نهاية السنتين', c: 'text-lime' },
                {
                  k: 'أول شهر ≥ 150$',
                  v: result.breakevenMonth ? `#${result.breakevenMonth}` : '—',
                  s: 'الشهر الذي يبدأ فيه المعنى',
                  c: 'text-cyan',
                },
                { k: 'الإجمالي (24 شهر)', v: `$${fmt(result.total2y)}`, s: 'صافي بعد الرسوم', c: 'text-white' },
                { k: 'سعر ساعتك الفعلي', v: `$${result.effectiveHourly}`, s: 'الدخل ÷ كل الساعات', c: 'text-amber-300' },
              ].map((x) => (
                <motion.div
                  key={x.k}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-xl border border-white/[0.08] bg-panel/70 p-3"
                >
                  <div className="text-[10px] text-slate-500">{x.k}</div>
                  <div className={`font-display mono mt-0.5 text-lg font-bold ${x.c}`}>{x.v}</div>
                  <div className="mt-0.5 text-[9.5px] leading-tight text-slate-600">{x.s}</div>
                </motion.div>
              ))}
            </div>

            <div className="glass-strong rounded-2xl p-4 md:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-[13px] font-semibold text-white">
                    {track.emoji} {track.ar}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">{track.blurb}</p>
                </div>
                <div className="flex gap-1 rounded-lg border border-white/10 p-0.5">
                  {[
                    { id: 'cumulative', ar: 'تراكمي' },
                    { id: 'monthly', ar: 'شهري' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setView(v.id)}
                      className={`rounded-md px-2.5 py-1 text-[11px] transition ${
                        view === v.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      {v.ar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[300px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gCum" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.42} />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gMon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff6b1a" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#ff6b1a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="m"
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                      tickFormatter={(v) => `${v}m`}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : v)}
                    />
                    <Tooltip content={<Tip />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
                    {result.breakevenMonth && (
                      <ReferenceLine
                        x={result.breakevenMonth}
                        stroke="#a3e635"
                        strokeDasharray="4 4"
                        label={{ value: 'first real $', fill: '#a3e635', fontSize: 9, position: 'top' }}
                      />
                    )}
                    {showHype && (
                      <Line
                        type="monotone"
                        dataKey="hype"
                        name="الوعود الوهمية"
                        stroke="#ef4444"
                        strokeDasharray="5 4"
                        strokeWidth={1.6}
                        dot={false}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey={view}
                      name={view === 'cumulative' ? 'تراكمي' : 'شهري'}
                      stroke={view === 'cumulative' ? '#22d3ee' : '#ff6b1a'}
                      strokeWidth={2}
                      fill={view === 'cumulative' ? 'url(#gCum)' : 'url(#gMon)'}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {showHype && (
                <div className="mt-2 rounded-lg border border-red-400/25 bg-red-500/[0.07] p-2.5 text-[11px] leading-relaxed text-red-200">
                  الخط الأحمر المقطّع هو ما يبيعه «خبراء» الربح السريع: نمو 45% شهرياً. رياضياً،هذا يعني{' '}
                  <span className="mono font-bold">${fmt(hype.at(-1)?.hype)}</span> شهرياً بعد سنتين من 40$. لا أحد
                  يحقّق ذلك — لأن هذا ليس نمواً، هذا خيال مرسوم بمعادلة.
                </div>
              )}

              <div className="mt-2 grid gap-2 border-t border-white/[0.08] pt-3 sm:grid-cols-3">
                <div className="text-[11px] leading-relaxed text-slate-500">
                  <span className="text-slate-300">السقف:</span> {track.ceiling}
                </div>
                <div className="text-[11px] leading-relaxed text-slate-500">
                  <span className="text-slate-300">المخاطرة:</span> {track.risk} ·{' '}
                  <span className="text-slate-300">الرسوم:</span> {Math.round(track.fees * 100)}%
                </div>
                <div className="text-[11px] leading-relaxed text-slate-500">
                  <span className="text-slate-300">ذروة شهرية:</span> ${fmt(result.peakMonth.net)} (شهر {result.peakMonth.m})
                </div>
              </div>
            </div>

            {/* comparison */}
            <div className="glass rounded-2xl p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[13px] font-semibold text-white">نفس الساعات · أربعة مسارات</div>
                <span className="mono text-[10px] uppercase tracking-wider text-slate-600">24 months · net</span>
              </div>
              <div className="h-[210px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="m"
                      type="number"
                      domain={[1, 24]}
                      ticks={[1, 6, 12, 18, 24]}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                      tickFormatter={(v) => `${v}m`}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : v)}
                    />
                    <Tooltip content={<Tip />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
                    {TRACKS.map((t, i) => {
                      const r = simulate(t.id, hours);
                      return (
                        <Line
                          key={t.id}
                          data={r.months.map((m) => ({ m: m.m, 'التراكمي': m.cumulative }))}
                          dataKey="التراكمي"
                          name={t.ar}
                          type="monotone"
                          stroke={COLORS[i]}
                          strokeWidth={1.8}
                          dot={false}
                          activeDot={{ r: 3 }}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {comparison.map((c) => {
                  const idx = TRACKS.findIndex((t) => t.id === c.id);
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.015] px-2.5 py-1.5"
                    >
                      <div className="flex items-center gap-2 text-[11.5px] text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: COLORS[idx] }} />
                        {c.emoji} {c.ar}
                      </div>
                      <div className="mono text-[11px] text-slate-400">
                        ${fmt(c.total2y)} <span className="text-slate-600">/ ${c.effectiveHourly}h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                اقرأ هذا السطر ببطء: العمل الحرّ يتقدّم أولاً، و الـ SaaS يتجاوزه لاحقاً — لكنه يتطلب أشهراً بلا دخل.
                اختيارك بين المسارين ليس عن المال فقط، بل عن <span className="text-slate-300">قدرتك على الانتظار</span>.
              </p>
            </div>

            <details className="group rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
              <summary className="mono cursor-pointer list-none text-[10.5px] uppercase tracking-[0.2em] text-slate-500 group-open:text-cyan">
                ▸ how these numbers are computed · كيف حُسبت
              </summary>
              <div className="mono mt-3 space-y-1.5 text-[10.5px] leading-relaxed text-slate-500" dir="ltr">
                <p>freelance(net) = price(t) × hours × utilization(t) × 4.345 × (1 − fees)</p>
                <p>saas(net) = mrrCap × (1 − e^−0.105t)^1.15 − support(t)</p>
                <p>content(net) = views(t) × view→buyer × ARPU + ads − fees</p>
                <p>product(net) = units(t) × price + launch(m=2) + relaunch(every 4m) − fees</p>
                <p className="pt-1 text-slate-600">
                  // نماذج محافظة بقصد. الواقع يمكن أن يكون أفضل أو أسوأ. الأرقام تتغيّر، المنطق لا.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
