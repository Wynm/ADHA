import { useState } from 'react';
import { motion } from 'framer-motion';
import { CASES, CASE_LESSONS } from '../data/cases.js';
import { fmt, Reveal, SectionHeading } from './ui.jsx';

export default function Cases() {
  const [active, setActive] = useState(CASES[0].id);
  const c = CASES.find((x) => x.id === active);

  return (
    <section id="cases" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Case Files · حالات"
            tone="cyan"
            title={
              <>
                ثلاثة أشخاص. <span className="ember-text">نفس المنهج.</span>
              </>
            }
            desc="لا أرقام خيالية ولا قصص «ربحت 10 آلاف دولار في شهر». ثلاث بدايات مختلفة، بوقت مختلف، وخطة مكتوبة شهراً بشهر — مع الجزء الذي لا يذكره أحد: ما الذي يمكن أن يكسرها."
          />
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2">
          {CASES.map((x) => (
            <button
              key={x.id}
              onClick={() => setActive(x.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] transition ${
                active === x.id
                  ? 'border-cyan/50 bg-cyan/15 text-cyan'
                  : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
              }`}
            >
              <span>{x.emoji}</span>
              {x.tag}
            </button>
          ))}
        </div>

        <motion.div key={c.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="glass-strong rounded-2xl p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  {c.emoji} {c.name}
                </h3>
                <p className="mono mt-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  {c.tag} · {c.city}
                </p>
              </div>
              <div className="flex gap-1.5">
                {[
                  { k: 'ساعات', v: `${c.start.hours}h/أسبوع` },
                  { k: 'رأس مال', v: c.start.capital === 0 ? 'صفر' : `$${c.start.capital}` },
                ].map((x) => (
                  <div key={x.k} className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-center">
                    <div className="text-[9px] text-slate-600">{x.k}</div>
                    <div className="mono text-[10.5px] font-bold text-slate-200">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 rounded-xl border-s-2 border-cyan/50 bg-cyan/[0.05] p-3 text-[12.5px] leading-relaxed text-slate-300">
              {c.situation}
            </p>

            <div className="mt-4 space-y-1.5">
              <div className="mono mb-2 text-[9.5px] uppercase tracking-[0.2em] text-slate-600">12-month plan</div>
              {c.plan.map((p, i) => (
                <div key={p.m} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.015] px-2.5 py-2">
                  <span className="mono w-12 shrink-0 text-[10px] text-slate-500">M{p.m}</span>
                  <span className="flex-1 text-[11.5px] leading-snug text-slate-300">{p.t}</span>
                  <span className={`mono w-16 shrink-0 text-end text-[10.5px] ${p.income > 0 ? 'text-lime' : 'text-slate-600'}`}>
                    {p.income > 0 ? `$${fmt(p.income)}` : '—'}
                  </span>
                  <div className="hidden h-1 w-14 overflow-hidden rounded-full bg-white/10 sm:block">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (p.income / 2300) * 100)}%` }}
                      transition={{ delay: i * 0.05, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-ember to-amber-300"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { k: 'أول دولار', v: c.numbers.firstDollar },
                { k: 'الشهر 12', v: `$${fmt(c.numbers.month12)}` },
                { k: 'ساعات (سنة)', v: `${fmt(c.numbers.totalHours)}h` },
                { k: 'سعر الساعة', v: `$${c.numbers.effectiveHourly}` },
              ].map((x) => (
                <div key={x.k} className="rounded-lg border border-white/[0.08] bg-panel/60 px-2 py-1.5">
                  <div className="text-[9px] text-slate-600">{x.k}</div>
                  <div className="mono text-[11.5px] font-bold text-white">{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.05] p-5">
              <div className="mono mb-2.5 text-[10px] uppercase tracking-[0.2em] text-red-300">what breaks it · ما يكسر الخطة</div>
              <ul className="space-y-2">
                {c.breaks.map((b) => (
                  <li key={b} className="flex gap-2 text-[12px] leading-relaxed text-slate-300">
                    <span className="mt-0.5 text-red-400">✕</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-lime/25 bg-lime/[0.05] p-5">
              <div className="mono mb-2 text-[10px] uppercase tracking-[0.2em] text-lime">the one lesson</div>
              <p className="text-[13.5px] leading-relaxed text-slate-100">{c.lesson}</p>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="mono mb-2.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">cross-case signals</div>
              <div className="space-y-2">
                {CASE_LESSONS.map((l) => (
                  <div key={l.ar}>
                    <div className="text-[12px] font-medium text-slate-200">· {l.ar}</div>
                    <div className="text-[11px] leading-relaxed text-slate-500">{l.d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10.5px] leading-relaxed text-slate-500">
                هذه الحالات <span className="text-slate-300">تركيبية</span> — بُنيت من أنماط شائعة، لا من أشخاص حقيقيين.
                الأرقام نماذج، والغرض منها تعليم بنية القرار لا التنبؤ بما سيحدث لك.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
