import { motion } from 'framer-motion';
import { Reveal, SectionTag } from './ui.jsx';

const LINES = [
  { ar: 'لن أدفع لأبدأ.', note: 'العمل يدفع لي.' },
  { ar: 'لن أصدّق ضماناً.', note: 'أصدّق عقداً.' },
  { ar: 'لن أبيع صديقاً مقابل عمولة.', note: 'العلاقة أغلى من الرقم.' },
  { ar: 'لن أشتري كورساً قبل أن أُنجز مجاناً.', note: 'الالتزام يسبق الاستثمار.' },
  { ar: 'سأقيس ساعاتي.', note: 'ما لا يُقاس لا يُدار.' },
  { ar: 'سأرفض الفرصة السهلة.', note: 'السهولة عادةً ليست لي.' },
  { ar: 'سأبني شيئاً واحداً حتى النهاية.', note: 'الانتشار ليس تقدماً.' },
];

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,107,26,0.07),transparent_65%)]" />
      <div className="relative mx-auto max-w-4xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <SectionTag>Manifesto · البيان</SectionTag>
            <h2 className="font-display mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              سبعة أسطر
              <br />
              <span className="ember-text">تُغيّر شكل قراراتك.</span>
            </h2>
            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-slate-400">
              ليس شعاراً تسويقياً. اقرأها بصوت مرتفع مرة واحدة. إن لم توافق على سطر منها، فأنت لست جمهور هذا المشروع — وهذا
              جيد أيضاً.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 space-y-1">
          {LINES.map((l, i) => (
            <motion.div
              key={l.ar}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="group flex items-baseline gap-4 border-b border-white/[0.08] py-4 transition-colors hover:border-ember/30"
            >
              <span className="mono shrink-0 text-[11px] text-slate-600">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display flex-1 text-lg font-semibold text-slate-100 transition-colors group-hover:text-white sm:text-xl">
                {l.ar}
              </span>
              <span className="hidden shrink-0 text-[11.5px] text-slate-500 sm:block">{l.note}</span>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 text-center md:p-8">
            <p className="font-display text-lg font-semibold leading-relaxed text-white sm:text-xl">
              «الربح من الإنترنت ليس سراً.
              <br />
              <span className="text-ember">هو فقط أبطأ مما يبيعونك.</span>»
            </p>
            <p className="mono mt-3 text-[10px] uppercase tracking-[0.24em] text-slate-600">— adha · principle zero</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
