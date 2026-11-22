import { motion } from 'framer-motion';
import { FUEL_NOT_GOAL, PRINCIPLES } from '../data/opportunities.js';
import { Reveal, SectionHeading } from './ui.jsx';

export default function Fuel() {
  return (
    <section id="fuel" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Fuel vs. Asset · الوقود لا الهدف"
            tone="lime"
            title={
              <>
                بعض العمل يدفع فاتورتك، <span className="ember-text">ولا يبني شيئاً.</span>
              </>
            }
            desc="لا يوجد عيب أخلاقي في أي عمل شريف. لكن هناك فرقاً هائلاً بين ما يشتري وقتك اليوم، وما يبني قيمةً تُدفع لك غداً. هذه القائمة ليست حكماً على أحد — إنها خريطة قرار لنفسك."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="space-y-2.5">
            <div className="mono mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-red-300">
              <span className="h-px w-6 bg-red-400/50" /> fuel only
            </div>
            {FUEL_NOT_GOAL.map((f, i) => (
              <motion.div
                key={f.ar}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="rounded-xl border border-white/[0.08] bg-panel/40 p-4"
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-red-400/30 text-[10px] text-red-300">
                    !
                  </span>
                  <div>
                    <div className="text-[13.5px] font-medium text-slate-200">{f.ar}</div>
                    <div className="mt-1 text-[11.5px] leading-relaxed text-slate-500">{f.why}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2.5">
            <div className="mono mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-lime">
              <span className="h-px w-6 bg-lime/50" /> compound assets
            </div>
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.ar}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-l from-lime/[0.05] to-transparent p-4"
              >
                <span className="font-display pointer-events-none absolute -end-1 -top-3 text-5xl font-bold text-white/[0.04]">
                  {p.icon}
                </span>
                <div className="text-[13.5px] font-semibold text-white">{p.ar}</div>
                <div className="mt-1 text-[11.5px] leading-relaxed text-slate-400">{p.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-panel/40 p-5 sm:grid-cols-3">
            {[
              { n: '01', t: 'اسأل: ماذا يتبقى بعد نهاية الدفع؟', d: 'عميل؟ مهارة؟ ملف أعمال؟ أم فقط نهاية الأسبوع؟' },
              { n: '02', t: 'اسأل: هل يمكن تكراره؟', d: 'العمل الذي لا يُكرَّر هو وظيفة مؤقتة بغطاء آخر.' },
              { n: '03', t: 'اسأل: هل يزيد سعري السوقي؟', d: 'كل ساعة يجب أن ترفع سعر ساعتك القادمة.' },
            ].map((x) => (
              <div key={x.n} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                <div className="mono mb-1.5 text-[10px] text-ember">{x.n}</div>
                <div className="text-[12.5px] font-medium text-slate-200">{x.t}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-slate-500">{x.d}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
