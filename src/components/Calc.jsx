import { useMemo } from 'react';
import { CURRENCIES } from '../data/currency.js';
import { useStore } from '../lib/store.jsx';
import { fmt, Reveal, SectionHeading } from './ui.jsx';

export default function Calc() {
  const s = useStore();
  const cur = s.currency;
  const c = CURRENCIES.find((x) => x.id === cur) || CURRENCIES[0];

  const perUnit = useMemo(() => {
    const priceUsd = s.price / c.rate;
    const costUsd = s.costs / c.rate;
    const fee = priceUsd * (s.feePct / 100);
    return Math.max(0, priceUsd - costUsd - fee);
  }, [s.price, s.costs, s.feePct, c.rate]);

  const targetUsd = s.goal / c.rate;
  const units = perUnit > 0 ? Math.ceil(targetUsd / perUnit) : 0;
  const hours = units * s.hoursPerUnit;
  const perDay = s.days > 0 ? hours / s.days : 0;
  const feasible = perDay <= 6;

  const fields = [
    { key: 'goal', l: 'الدخل الصافي الذي تريده شهرياً', min: 100, max: 50000, step: 100 },
    { key: 'price', l: 'سعر الوحدة / الخدمة', min: 5, max: 5000, step: 5 },
    { key: 'costs', l: 'تكلفة مباشرة لكل وحدة', min: 0, max: 2000, step: 5 },
    { key: 'hoursPerUnit', l: 'ساعات العمل لكل وحدة', min: 0.5, max: 60, step: 0.5 },
    { key: 'days', l: 'أيام العمل الشهرية', min: 4, max: 30, step: 1 },
  ];

  return (
    <section id="calc" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Backwards Math · حساب عكسي"
            title={
              <>
                ما تريده ليس <span className="ember-text">«دخل».</span> بل عدد وحدات.
              </>
            }
            desc="أغلب الناس يفشلون لأنهم يفكرون في المبلغ لا في الوحدات. هذه الآلة تحوّل حلمك الشهري إلى: كم عميلاً تحتاج؟ وكم ساعة؟ وهل هذا ممكن فعلاً بشرياً؟"
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[380px_1fr]">
          <div className="glass rounded-2xl p-4">
            <div className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">inputs</div>

            <div className="mb-3">
              <span className="text-[11.5px] text-slate-400">العملة</span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {CURRENCIES.map((x) => (
                  <button
                    key={x.id}
                    onClick={() => s.setKey('currency', x.id)}
                    title={x.name}
                    className={`rounded-md border px-2 py-1 text-[10.5px] transition ${
                      cur === x.id
                        ? 'border-ember/50 bg-ember/15 text-ember'
                        : 'border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    {x.id}
                  </button>
                ))}
              </div>
            </div>

            {fields.map((f) => (
              <label key={f.key} className="mb-3 block">
                <span className="flex items-baseline justify-between text-[11.5px] text-slate-400">
                  {f.l}
                  <span className="mono font-bold text-white">
                    {f.key === 'goal' || f.key === 'price' || f.key === 'costs'
                      ? `${c.code} ${fmt(s[f.key])}`
                      : `${s[f.key]}${f.key === 'hoursPerUnit' ? 'h' : ''}`}
                  </span>
                </span>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={s[f.key]}
                  onChange={(e) => s.setKey(f.key, +e.target.value)}
                  className="mt-1.5"
                />
              </label>
            ))}

            <label className="block">
              <span className="flex items-baseline justify-between text-[11.5px] text-slate-400">
                رسوم المنصة %
                <span className="mono font-bold text-white">{s.feePct}%</span>
              </span>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={s.feePct}
                onChange={(e) => s.setKey('feePct', +e.target.value)}
                className="mt-1.5"
              />
            </label>

            <p className="mono mt-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2 text-[9.5px] leading-relaxed text-slate-600">
              // أسعار الصرف تقديرية ومدمجة في الكود — لا اتصال بأي API.
            </p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { k: 'صافي الوحدة', v: `${c.code} ${fmt(perUnit * c.rate)}`, s: 'بعد التكلفة والرسوم' },
                { k: 'وحدات مطلوبة', v: fmt(units), s: 'شهرياً' },
                { k: 'ساعات مطلوبة', v: `${fmt(hours)}h`, s: 'شهرياً' },
                { k: 'ساعات يومياً', v: `${Math.round(perDay * 10) / 10}h`, s: 'على مدى الأيام المختارة' },
              ].map((x) => (
                <div key={x.k} className="rounded-xl border border-white/[0.08] bg-panel/60 p-3">
                  <div className="text-[10px] text-slate-500">{x.k}</div>
                  <div className="font-display mono mt-0.5 text-lg font-bold text-white">{x.v}</div>
                  <div className="mt-0.5 text-[9.5px] text-slate-600">{x.s}</div>
                </div>
              ))}
            </div>

            <div
              className={`rounded-2xl border p-5 ${
                feasible ? 'border-lime/25 bg-lime/[0.05]' : 'border-red-400/25 bg-red-500/[0.06]'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{feasible ? '✅' : '⚠️'}</span>
                <div>
                  <div className={`font-display text-base font-bold ${feasible ? 'text-lime' : 'text-red-300'}`}>
                    {feasible ? 'هذا الرقم قابل للتنفيذ — لكنه ليس سهلاً.' : 'هذا الرقم غير واقعي بهذه المعطيات.'}
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-slate-300">
                    {feasible
                      ? `تحتاج ${fmt(units)} وحدة شهرياً بمعدل ${Math.round(perDay * 10) / 10} ساعة يومياً. الحل ليس العمل أكثر، بل رفع سعر الوحدة أو تقليل ساعاتها — وهنا يبدأ التطور الحقيقي.`
                      : `تحتاج ${Math.round(perDay * 10) / 10} ساعة يومياً، وهذا مستحيل تقريباً مع الدراسة أو العمل. الخيارات: رفع السعر، تقليل ساعات الوحدة، أو خفض الهدف الأولي. لا خيار رابع.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                sensitivity · ماذا لو رفعت السعر؟
              </div>
              <div className="space-y-1.5">
                {[1, 1.25, 1.5, 2].map((mult) => {
                  const newPrice = s.price * mult;
                  const newPerUnit = Math.max(
                    0,
                    newPrice / c.rate - s.costs / c.rate - (newPrice / c.rate) * (s.feePct / 100)
                  );
                  const newUnits = newPerUnit > 0 ? Math.ceil(targetUsd / newPerUnit) : 0;
                  const newHours = newUnits * s.hoursPerUnit;
                  return (
                    <div key={mult} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.015] px-3 py-2">
                      <span className="mono w-14 shrink-0 text-[10.5px] text-slate-500">×{mult}</span>
                      <span className="w-24 shrink-0 text-[11px] text-slate-300">
                        {c.code} {fmt(newPrice)}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-ember to-amber-300"
                          style={{ width: `${Math.min(100, (newHours / Math.max(1, hours)) * 100)}%` }}
                        />
                      </div>
                      <span className="mono w-24 shrink-0 text-end text-[10.5px] text-slate-400">
                        {fmt(newUnits)}u · {fmt(newHours)}h
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                لاحظ: مضاعفة السعر تُنصّف عدد العملاء المطلوبين تقريباً. <span className="text-slate-300">هذا هو الطريق</span> —
                ليس ساعات أكثر، بل قيمة أعلى.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[11.5px] leading-relaxed text-slate-400">
                <span className="font-semibold text-white">الرقم الذي يجب أن يرعبك:</span> ساعاتك المطلوبة شهرياً{' '}
                <span className="mono text-ember">{fmt(hours)}h</span>. إن كانت تفوق 120 ساعة، فأنت لا تبني عملاً — أنت
                تشتري وظيفة براتب أقل وساعات أطول.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
