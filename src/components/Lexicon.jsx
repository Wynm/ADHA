import { useMemo, useState } from 'react';
import { LEXICON } from '../data/lexicon.js';
import { Reveal, SectionHeading } from './ui.jsx';

const TAGS = ['الكل', 'مقياس', 'نموذج', 'بيع', 'تموضع', 'منتج', 'توزيع', 'مسار', 'تشغيل', 'تفكير'];

export default function Lexicon() {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('الكل');
  const [open, setOpen] = useState(null);

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return LEXICON.filter((x) => {
      const tagOk = tag === 'الكل' || x.tag === tag;
      if (!needle) return tagOk;
      return (
        tagOk &&
        (x.t.toLowerCase().includes(needle) || x.ar.includes(q.trim()) || x.d.includes(q.trim()))
      );
    });
  }, [q, tag]);

  return (
    <section id="lexicon" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Lexicon · المعجم"
            title={
              <>
                المصطلح الذي لا تعرفه، <span className="ember-text">يصبح فخاً تدفع ثمنه.</span>
              </>
            }
            desc="MRR، Churn، Scope Creep، Sunk Cost — مفردات تُقال في كل محادثة جدّية عن الربح من الإنترنت. من لا يعرفها يوقّع على ما لا يفهم. هنا كل مصطلح بجملة واحدة تُستخدم فعلاً."
          />
        </Reveal>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-600">⌕</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن مصطلح…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pe-4 ps-9 text-[13px] text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-ember/40"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((t) => (
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
        </div>

        <div className="mono mt-3 text-[10px] text-slate-600">{items.length} / {LEXICON.length} terms</div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((x) => {
            const isOpen = open === x.t;
            return (
              <button
                key={x.t}
                onClick={() => setOpen(isOpen ? null : x.t)}
                className={`rounded-xl border p-3.5 text-start transition ${
                  isOpen ? 'border-cyan/40 bg-cyan/[0.07]' : 'border-white/[0.08] bg-panel/50 hover:border-white/25'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="mono text-[12.5px] font-bold text-white" dir="ltr">
                      {x.t}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{x.ar}</div>
                  </div>
                  {x.tag && <span className="chip shrink-0 !px-1.5 !py-0.5 !text-[9px]">{x.tag}</span>}
                </div>
                <p className={`mt-2 text-[11.5px] leading-relaxed text-slate-400 ${isOpen ? '' : 'line-clamp-2'}`}>{x.d}</p>
              </button>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center text-[13px] text-slate-500">
            لا نتائج. جرّب كلمة أبسط.
          </div>
        )}
      </div>
    </section>
  );
}
