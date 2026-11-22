import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { EMAIL_TIPS, SCRIPTS } from '../data/scripts.js';
import { Reveal, SectionHeading } from './ui.jsx';

export default function Scripts() {
  const [active, setActive] = useState(SCRIPTS[0].id);
  const [copied, setCopied] = useState(null);
  const s = useMemo(() => SCRIPTS.find((x) => x.id === active), [active]);

  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section id="scripts" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Scripts · بنك النصوص"
            tone="cyan"
            title={
              <>
                المشكلة ليست في مهارتك. <span className="ember-text">في الكلمات.</span>
              </>
            }
            desc="ثمانية نصوص جاهزة تستخدمها اليوم: أول رسالة لعميل، إعلان السعر دون اعتذار، رفض إضافة مجانية، مطالبة بدفع متأخر، طلب شهادة… انسخ، عدّل، وأرسل. النص ليس بديلاً عن المهارة، لكنه يمنع المهارة من أن تبقى صامتة."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[300px_1fr]">
          <div className="space-y-1.5">
            {SCRIPTS.map((x) => (
              <button
                key={x.id}
                onClick={() => setActive(x.id)}
                className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-start transition ${
                  active === x.id
                    ? 'border-cyan/40 bg-cyan/10'
                    : 'border-white/[0.08] bg-panel/40 hover:border-white/25'
                }`}
              >
                <span className="flex-1 text-[12px] font-medium text-slate-200">{x.ar}</span>
                <span className="chip shrink-0 !px-1.5 !py-0.5 !text-[8.5px]">{x.tag}</span>
              </button>
            ))}
          </div>

          <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div className="glass-strong overflow-hidden rounded-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] px-4 py-3">
                <div>
                  <div className="text-[13px] font-semibold text-white">{s.ar}</div>
                  <div className="mono text-[9.5px] uppercase tracking-[0.18em] text-slate-600">template · {s.id}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copy(s.body, s.id)}
                    className={`rounded-lg border px-3 py-1.5 text-[11px] transition ${
                      copied === s.id
                        ? 'border-lime/40 bg-lime/10 text-lime'
                        : 'border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {copied === s.id ? '✓ نُسخ' : '⧉ نسخ'}
                  </button>
                  <a
                    href={`mailto:?body=${encodeURIComponent(s.body)}&subject=${encodeURIComponent(s.ar)}`}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] text-slate-300 transition hover:border-white/30 hover:text-white"
                  >
                    ✉ بريد
                  </a>
                </div>
              </div>

              <pre className="mono max-h-[360px] overflow-auto whitespace-pre-wrap px-4 py-4 text-[11.5px] leading-[2] text-slate-300" dir="auto">
                {s.body}
              </pre>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-red-400/20 bg-red-500/[0.05] p-3">
                <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-red-300">avoid this</div>
                <p className="text-[11.5px] leading-relaxed text-slate-300">{s.avoid}</p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-slate-500">why it works</div>
                <p className="text-[11.5px] leading-relaxed text-slate-400">{s.why}</p>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {EMAIL_TIPS.map((t) => (
                <div key={t.ar} className="rounded-lg border border-white/[0.06] bg-white/[0.015] px-3 py-2">
                  <div className="text-[11.5px] font-medium text-slate-200">· {t.ar}</div>
                  <div className="mt-0.5 text-[10.5px] leading-relaxed text-slate-500">{t.d}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
