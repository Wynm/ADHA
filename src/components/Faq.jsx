import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FAQ, FAQ_TAGS } from '../data/faq.js';
import { Reveal, SectionHeading } from './ui.jsx';

export default function Faq() {
  const [tag, setTag] = useState('الكل');
  const [open, setOpen] = useState(0);

  const items = useMemo(
    () => FAQ.map((x, i) => ({ ...x, i })).filter((x) => tag === 'الكل' || x.tag === tag),
    [tag]
  );

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="FAQ · أسئلة الزائر"
            align="center"
            title={
              <>
                الأسئلة التي <span className="ember-text">تُطرح في أول دقيقة.</span>
              </>
            }
            desc="عشر إجابات صريحة — بلا مراوغة تسويقية. إن كان سؤالك غير موجود، فالمستودع مفتوح والمسائل مفتوحة."
          />
        </Reveal>

        <div className="mt-8 flex flex-wrap justify-center gap-1.5">
          {FAQ_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`rounded-full border px-3 py-1 text-[11px] transition ${
                tag === t
                  ? 'border-ember/50 bg-ember/15 text-ember'
                  : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-1.5">
          {items.map((x) => {
            const isOpen = open === x.i;
            return (
              <div
                key={x.q}
                className={`overflow-hidden rounded-xl border transition ${
                  isOpen ? 'border-ember/30 bg-panel/60' : 'border-white/[0.08] bg-panel/30'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : x.i)}
                  className="flex w-full items-start gap-3 p-4 text-start"
                >
                  <span
                    className={`mono mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border text-[11px] transition ${
                      isOpen ? 'border-ember/50 text-ember' : 'border-white/15 text-slate-500'
                    }`}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13px] font-medium text-slate-100">{x.q}</span>
                    <span className="mono mt-0.5 block text-[9px] uppercase tracking-[0.16em] text-slate-600">{x.tag}</span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="px-4 pb-4 ps-12 text-[12.5px] leading-[1.95] text-slate-400">{x.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:flex-row">
            <p className="text-[12px] leading-relaxed text-slate-400">
              لم تجد سؤالك؟ افتح issue على المستودع — الأسئلة الجيدة تصبح قسماً في التطبيق.
            </p>
            <a
              href="https://github.com/Wynm/ADHA/issues"
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-ghost shrink-0 px-4 py-2 text-[12px]"
            >
              اسأل على GitHub ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
