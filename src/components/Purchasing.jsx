import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { COUNTRIES, BIG_MAC, PPP_NOTE, localize, runwayMonths } from '../lib/purchasing.js';
import { fmt, Reveal, SectionHeading } from './ui.jsx';

const TONES = {
  lime: { c: '#a3e635', bg: 'bg-lime/[0.06]', bd: 'border-lime/25' },
  cyan: { c: '#22d3ee', bg: 'bg-cyan/[0.06]', bd: 'border-cyan/25' },
  amber: { c: '#fbbf24', bg: 'bg-amber-400/[0.06]', bd: 'border-amber-400/25' },
  red: { c: '#ef4444', bg: 'bg-red-500/[0.06]', bd: 'border-red-400/25' },
};

export default function Purchasing() {
  const [usd, setUsd] = useState(1000);
  const [countryId, setCountryId] = useState('MA');
  const country = COUNTRIES.find((c) => c.id === countryId);
  const res = useMemo(() => localize(usd, country), [usd, country]);
  const runway = useMemo(() => runwayMonths(usd, country), [usd, country]);
  const tone = TONES[res.tone];

  const ranked = useMemo(
    () =>
      COUNTRIES.map((c) => ({ ...c, mult: localize(usd, c).multipleOfMedian })).sort((a, b) => b.mult - a.mult),
    [usd]
  );
  const maxMult = ranked[0]?.mult || 1;

  return (
    <section id="purchasing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Purchasing Power · قيمة المال"
            tone="lime"
            title={
              <>
                «1000 دولار» <span className="ember-text">ليست رقماً واحداً.</span>
              </>
            }
            desc="أكثر خطأ في حسابات الربح من الإنترنت: مقارنة دخلك بعملة، لا بحياة. أسحب شريط الدخل واختر بلدك لترى ما يعنيه المبلغ فعلاً: كم ضعف متوسط الأجر؟ وكم شهر إيجار؟ وكم شهراً لبناء احتياطي أمان؟"
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <div className="glass-strong relative overflow-hidden rounded-2xl p-5">
              <div className="scan-line" />
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">monthly net income</div>
                  <div className="font-display mt-1 text-4xl font-bold text-white">
                    ${fmt(usd)}
                    <span className="ms-2 text-sm font-normal text-slate-500">شهرياً</span>
                  </div>
                </div>
                <div className="text-end">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">in {country.ar}</div>
                  <div className="font-display mt-1 text-2xl font-bold" style={{ color: tone.c }}>
                    {fmt(res.local)} <span className="text-sm font-normal text-slate-500">{country.cur}</span>
                  </div>
                </div>
              </div>

              <input
                type="range"
                min="100"
                max="10000"
                step="50"
                value={usd}
                onChange={(e) => setUsd(+e.target.value)}
                className="mt-5"
                aria-label="الدخل الشهري بالدولار"
              />

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  { k: 'مقارنة بمتوسط الأجر', v: `${Math.round(res.pctOfMedian)}%`, s: res.multipleOfMedian >= 1 ? 'أعلى من المتوسط' : 'أقل من المتوسط' },
                  { k: 'أشهر إيجار', v: fmt(res.monthsOfRent * 10) / 10, s: 'بسعر شقة غرفة واحدة' },
                  { k: 'احتياطي 3 أشهر', v: runway === Infinity ? '—' : `${runway}`, s: 'شهراً لتكوينه (ادخار 30%)' },
                  { k: 'متوسط الأجر', v: fmt(country.medianWage), s: country.cur + ' شهرياً (تقديري)' },
                ].map((x) => (
                  <div key={x.k} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                    <div className="text-[9.5px] text-slate-500">{x.k}</div>
                    <div className="mono mt-0.5 text-base font-bold text-white">{x.v}</div>
                    <div className="mt-0.5 text-[9px] leading-tight text-slate-600">{x.s}</div>
                  </div>
                ))}
              </div>

              <div className={`mt-4 rounded-xl border p-3.5 ${tone.bd} ${tone.bg}`}>
                <p className="text-[12.5px] leading-relaxed text-slate-200">{res.verdict}</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[13px] font-semibold text-white">${fmt(usd)} في 12 بلداً عربياً</div>
                <span className="mono text-[9.5px] uppercase tracking-wider text-slate-600">× median wage</span>
              </div>
              <div className="space-y-1">
                {ranked.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCountryId(c.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition ${
                      countryId === c.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="w-6 shrink-0 text-sm">{c.flag}</span>
                    <span className={`w-20 shrink-0 text-[11px] ${countryId === c.id ? 'text-white' : 'text-slate-400'}`}>
                      {c.ar}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            c.mult >= 3 ? '#a3e635' : c.mult >= 1.5 ? '#22d3ee' : c.mult >= 0.8 ? '#fbbf24' : '#ef4444',
                        }}
                        animate={{ width: `${Math.min(100, (c.mult / maxMult) * 100)}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <span className="mono w-12 shrink-0 text-end text-[10.5px] text-slate-400">
                      {Math.round(c.mult * 100)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="glass rounded-2xl p-4">
              <div className="mono mb-2.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">three facts</div>
              <div className="space-y-2.5">
                {BIG_MAC.map((b, i) => (
                  <div key={b.ar} className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="mono text-[9px] text-ember">0{i + 1}</span>
                      <span className="text-[11.5px] font-medium text-slate-200">{b.ar}</span>
                    </div>
                    <p className="mt-1 ps-5 text-[10.5px] leading-relaxed text-slate-500">{b.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-cyan/20 bg-cyan/[0.05] p-4">
              <div className="mono mb-1.5 text-[10px] uppercase tracking-[0.18em] text-cyan">the practical read</div>
              <p className="text-[11.5px] leading-relaxed text-slate-300">
                إذا كان هدفك 3000 درهم شهرياً، أنت لا تحتاج «مشروعاً عالمياً» — تحتاج عميلاً واحداً بسعر 300$ شهرياً.
                توقّف عن مقارنة نفسك بحسابات أجنبية تبيع بأرقام مختلفة، وقارن خطتك بسقف بلدك.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
              <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-slate-600">data honesty</div>
              <p className="text-[10.5px] leading-relaxed text-slate-500">{PPP_NOTE}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
