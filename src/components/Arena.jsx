import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ARCADE, RISK } from '../data/opportunities.js';
import { Reveal, SectionHeading } from './ui.jsx';

const FILTERS = [
  { id: 'all', ar: 'الكل' },
  { id: 'low', ar: 'مخاطرة منخفضة' },
  { id: 'medium', ar: 'مخاطرة متوسطة' },
  { id: 'high', ar: 'مخاطرة مرتفعة' },
];

function Card({ item, index, onOpen }) {
  const risk = RISK[item.risk];
  return (
    <motion.button
      layout
      onClick={() => onOpen(item)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.06 }}
      className="tilt-card group relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel/60 p-5 text-start backdrop-blur-sm"
    >
      <div
        className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: `radial-gradient(circle, ${risk.color}66, transparent 70%)` }}
      />
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-xl">
          {item.emoji}
        </span>
        <div className="flex flex-col items-end gap-1.5">
          <span className="chip" style={{ borderColor: `${risk.color}44`, color: risk.color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: risk.color }} />
            {risk.ar}
          </span>
          <span className="mono text-[10px] text-slate-600">#{String(index + 1).padStart(2, '0')}</span>
        </div>
      </div>

      <h3 className="mt-4 text-[15px] font-semibold leading-snug text-white">{item.ar}</h3>
      <p className="mono mt-0.5 text-[10px] uppercase tracking-wider text-slate-600">{item.en}</p>

      <p className="mt-3 line-clamp-3 flex-1 text-[12.5px] leading-relaxed text-slate-400">{item.arDesc}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-3.5">
        <div>
          <div className="text-[10px] text-slate-600">أول دولار</div>
          <div className="text-[12px] font-medium text-slate-200">{item.timeToFirstDollar}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-600">رأس المال</div>
          <div className="text-[12px] font-medium text-slate-200">{item.capital === 0 ? '0 $' : `~${item.capital}$`}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {item.skills.slice(0, 2).map((s) => (
            <span key={s} className="mono rounded border border-white/[0.08] px-1.5 py-0.5 text-[9.5px] text-slate-500">
              {s}
            </span>
          ))}
        </div>
        <span className="text-[11px] text-ember opacity-0 transition-opacity group-hover:opacity-100">التفاصيل ←</span>
      </div>
    </motion.button>
  );
}

function Modal({ item, onClose }) {
  const risk = RISK[item.risk];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 md:p-8"
      >
        <button
          onClick={onClose}
          className="absolute end-4 top-4 grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
          aria-label="إغلاق"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-2xl">
            {item.emoji}
          </span>
          <div>
            <h3 className="font-display text-xl font-bold text-white">{item.ar}</h3>
            <p className="mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{item.en}</p>
          </div>
        </div>

        <p className="mt-5 text-[14px] leading-[1.9] text-slate-300">{item.arDesc}</p>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            { k: 'المخاطرة', v: risk.ar, c: risk.color },
            { k: 'رأس المال', v: item.capital === 0 ? 'صفر' : `~${item.capital}$` },
            { k: 'أول دولار', v: item.timeToFirstDollar },
            { k: 'الجهد', v: item.effort },
          ].map((x) => (
            <div key={x.k} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <div className="text-[10px] text-slate-600">{x.k}</div>
              <div className="mt-0.5 text-[13px] font-semibold" style={{ color: x.c || '#e8ecf4' }}>
                {x.v}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-lime/20 bg-lime/[0.05] p-4">
          <div className="mono mb-1 text-[10px] uppercase tracking-[0.18em] text-lime">evidence · الدليل</div>
          <p className="text-[13px] leading-relaxed text-slate-300">{item.proof}</p>
        </div>

        <div className="mt-6">
          <div className="mono mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">skills needed</div>
          <div className="flex flex-wrap gap-1.5">
            {item.skills.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="mono mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">where to start</div>
          <div className="flex flex-wrap gap-2">
            {item.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-ghost px-4 py-2 text-[12px]"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 border-t border-white/[0.08] pt-4 text-[11.5px] leading-relaxed text-slate-500">
          ⚠️ هذه بطاقة تعريف لا توصية استثمارية. كل الأرقام والسياقات قابلة للتغيّر، والقرار مسؤوليتك — لكن القرار
          المبني على معلومة أفضل، دائماً أقل كلفة.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function Arena() {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);

  const items = useMemo(
    () => (filter === 'all' ? ARCADE : ARCADE.filter((x) => x.risk === filter)),
    [filter]
  );

  return (
    <section id="arena" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="The Arena · الساحة"
            title={
              <>
                ثمانية مسارات <span className="ember-text">لا ثمانية وعود.</span>
              </>
            }
            desc="كل مسار هنا مصنّف بمخاطرة صريحة، ووقت واقعي لأول دولار، وما يحتاجه منك فعلاً. اضغط أي بطاقة لرؤية «الدليل» الذي يجعلها حقيقية لا شعاراً."
          />
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-4 py-1.5 text-[12px] transition ${
                filter === f.id
                  ? 'border-ember/50 bg-ember/15 text-ember'
                  : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
              }`}
            >
              {f.ar}
            </button>
          ))}
          <span className="mono ms-auto text-[10.5px] text-slate-600">
            {items.length} / {ARCADE.length} visible
          </span>
        </div>

        <motion.div layout className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <Card key={item.id} item={item} index={i} onOpen={setOpen} />
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-l from-white/[0.04] to-transparent p-5 sm:flex-row sm:items-center">
            <p className="max-w-2xl text-[13px] leading-relaxed text-slate-400">
              <span className="font-semibold text-white">ملاحظة صريحة:</span> لا شيء في هذه الساحة يُغني عن العمل. أفضل
              بطاقة هنا وأسوأ بطاقة هنا تشتركان في شيء واحد: كلتاهما تحتاج منك أن تُنجز شيئاً يفيد شخصاً آخر.
            </p>
            <a href="#simulator" className="btn btn-primary shrink-0 px-5 py-2.5 text-[13px]">
              احسب النتيجة قبل أن تبدأ ←
            </a>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>{open && <Modal item={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
