import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PLATFORMS, PLATFORM_LESSONS, netFrom, priceNeededFor } from '../data/platforms.js';
import { fmt, Reveal, SectionHeading } from './ui.jsx';

export default function Platforms() {
  const [price, setPrice] = useState(500);
  const [sel, setSel] = useState('upwork');
  const p = PLATFORMS.find((x) => x.id === sel);
  const net = useMemo(() => netFrom(price, p), [price, p]);
  const maxNet = useMemo(() => Math.max(...PLATFORMS.map((x) => netFrom(price, x))), [price]);

  return (
    <section id="platforms" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Where to Sell · أين تبيع؟"
            tone="cyan"
            title={
              <>
                المنصة تأخذ نسبة. <span className="ember-text">وأنت من يقرر الباقي.</span>
              </>
            }
            desc="نفس المشروع بسعر 500$ يعطي مبالغ مختلفة جداً بحسب المنصة. هذه ليست دعوة للابتعاد عن المنصات — بل لمعرفة الثمن الحقيقي لكل قناة، ولحساب سعرك بحيث يصل إليك ما تريده أنت."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            <div className="glass-strong rounded-2xl p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">project price</div>
                  <div className="font-display mt-1 text-3xl font-bold text-white">${fmt(price)}</div>
                </div>
                <div className="text-end">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">you keep on {p.ar}</div>
                  <div className="font-display mt-1 text-2xl font-bold text-lime">${fmt(net)}</div>
                </div>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={price}
                onChange={(e) => setPrice(+e.target.value)}
                className="mt-4"
                aria-label="سعر المشروع"
              />

              <div className="mt-5 space-y-1.5">
                {PLATFORMS.map((x) => {
                  const n = netFrom(price, x);
                  const isSel = sel === x.id;
                  return (
                    <button
                      key={x.id}
                      onClick={() => setSel(x.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 transition ${
                        isSel ? 'border-cyan/40 bg-cyan/[0.07]' : 'border-white/[0.06] bg-white/[0.012] hover:border-white/20'
                      }`}
                    >
                      <span className="w-5 shrink-0 text-sm">{x.emoji}</span>
                      <span className={`w-24 shrink-0 text-start text-[11.5px] ${isSel ? 'text-white' : 'text-slate-400'}`}>
                        {x.ar}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-ember to-lime"
                          animate={{ width: `${maxNet > 0 ? (n / maxNet) * 100 : 0}%` }}
                          transition={{ duration: 0.35 }}
                        />
                      </div>
                      <span className={`mono w-16 shrink-0 text-end text-[11px] ${isSel ? 'text-lime' : 'text-slate-400'}`}>
                        ${fmt(n)}
                      </span>
                      <span className="mono w-9 shrink-0 text-end text-[9.5px] text-slate-600">
                        {Math.round(x.fee * 100)}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="rounded-xl border border-cyan/20 bg-cyan/[0.05] p-4">
                <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-cyan">to keep ${fmt(price)} net</div>
                <div className="font-display text-2xl font-bold text-white">${fmt(priceNeededFor(price, p))}</div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  على {p.ar} يجب أن تسعّر بـ{fmt(priceNeededFor(price, p))}$ لتصل إلى {fmt(price)}$. أضف هذه القاعدة إلى
                  عرضك قبل التفاوض، لا بعده.
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-slate-500">what you lose</div>
                <div className="font-display text-2xl font-bold text-red-300">${fmt(price - net)}</div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  الفارق الذي تدفعه مقابل الوصول إلى العملاء والحماية. السؤال: هل تجلب لك هذه المنصة عملاء بـ{fmt(price - net)}$
                  أكثر من قناتك الحالية؟
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{p.emoji}</span>
                <div className="text-[13px] font-semibold text-white">{p.ar}</div>
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-slate-400">{p.note}</p>
              <div className="mt-3 space-y-1.5">
                {[
                  { k: 'الرسوم', v: p.feeNote },
                  { k: 'أول عميل', v: p.timeToFirst },
                  { k: 'الحماية', v: p.protection },
                  { k: 'الأفضل لـ', v: p.bestFor },
                ].map((x) => (
                  <div key={x.k} className="flex items-baseline justify-between gap-2 border-b border-white/[0.05] pb-1.5">
                    <span className="mono shrink-0 text-[9px] uppercase tracking-wider text-slate-600">{x.k}</span>
                    <span className="text-end text-[11px] text-slate-300">{x.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="mono mb-2.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">three rules</div>
              <div className="space-y-2">
                {PLATFORM_LESSONS.map((l) => (
                  <div key={l.ar} className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5">
                    <div className="text-[11.5px] font-medium text-slate-200">{l.ar}</div>
                    <div className="mt-0.5 text-[10.5px] leading-relaxed text-slate-500">{l.d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-3.5">
              <p className="text-[10.5px] leading-relaxed text-slate-400">
                <span className="font-semibold text-amber-300">تنبيه:</span> هياكل الرسوم تتغيّر، وبعض المنصات تضيف رسوم
                سحب أو تحويل عملة. الأرقام هنا للفهم البنيوي، وتحقّق من الصفحة الرسمية قبل التسعير.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
