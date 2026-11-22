import { useMemo, useState } from 'react';
import { fmt, Reveal, SectionHeading } from './ui.jsx';

const CURRENCIES = [
  { id: 'USD', code: '$', rate: 1, name: 'دولار' },
  { id: 'MAD', code: 'DH', rate: 10.1, name: 'درهم مغربي' },
  { id: 'SAR', code: 'SR', rate: 3.75, name: 'ريال سعودي' },
  { id: 'AED', code: 'AED', rate: 3.67, name: 'درهم إماراتي' },
  { id: 'EGP', code: 'E£', rate: 48.5, name: 'جنيه مصري' },
  { id: 'DZD', code: 'DA', rate: 133, name: 'دينار جزائري' },
  { id: 'TND', code: 'DT', rate: 3.1, name: 'دينار تونسي' },
];

export default function Calc() {
  const [cur, setCur] = useState('MAD');
  const [netWanted, setNetWanted] = useState(3000);
  const [price, setPrice] = useState(150);
  const [costs, setCosts] = useState(15);
  const [feePct, setFeePct] = useState(8);
  const [hoursPerUnit, setHoursPerUnit] = useState(6);
  const [days, setDays] = useState(24);

  const c = CURRENCIES.find((x) => x.id === cur);
  const perUnit = useMemo(() => {
    // السعر بالدولار
    const priceUsd = price / c.rate;
    const costUsd = costs / c.rate;
    const fee = priceUsd * (feePct / 100);
    return Math.max(0, priceUsd - costUsd - fee);
  }, [price, costs, feePct, c.rate]);

  const targetUsd = netWanted / c.rate;
  const units = perUnit > 0 ? Math.ceil(targetUsd / perUnit) : 0;
  const hours = units * hoursPerUnit;
  const perDay = days > 0 ? hours / days : 0;
  const feasible = perDay <= 6;

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

            <label className="mb-3 block">
              <span className="text-[11.5px] text-slate-400">العملة</span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {CURRENCIES.map((x) => (
                  <button
                    key={x.id}
                    onClick={() => setCur(x.id)}
                    className={`rounded-md border px-2 py-1 text-[10.5px] transition ${
                      cur === x.id ? 'border-ember/50 bg-ember/15 text-ember' : 'border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    {x.id}
                  </button>
                ))}
              </div>
            </label>

            {[
              { l: 'الدخل الصافي الذي تريده شهرياً', v: netWanted, set: setNetWanted, min: 100, max: 50000, step: 100 },
              { l: 'سعر الوحدة / الخدمة', v: price, set: setPrice, min: 5, max: 5000, step: 5 },
              { l: 'تكلفة مباشرة لكل وحدة', v: costs, set: setCosts, min: 0, max: 2000, step: 5 },
              { l: 'ساعات العمل لكل وحدة', v: hoursPerUnit, set: setHoursPerUnit, min: 0.5, max: 60, step: 0.5 },
              { l: 'أيام العمل الشهرية', v: days, set: setDays, min: 4, max: 30, step: 1 },
            ].map((f) => (
              <label key={f.l} className="mb-3 block">
                <span className="flex items-baseline justify-between text-[11.5px] text-slate-400">
                  {f.l}
                  <span className="mono font-bold text-white">
                    {f.v}
                    {f.l.includes('ساعات') ? 'h' : ''}
                  </span>
                </span>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={f.v}
                  onChange={(e) => f.set(+e.target.value)}
                  className="mt-1.5"
                />
              </label>
            ))}

            <label className="block">
              <span className="flex items-baseline justify-between text-[11.5px] text-slate-400">
                رسوم المنصة %
                <span className="mono font-bold text-white">{feePct}%</span>
              </span>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={feePct}
                onChange={(e) => setFeePct(+e.target.value)}
                className="mt-1.5"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { k: 'صافي الوحدة', v: `${c.code} ${fmt(perUnit * c.rate)}`, s: 'بعد التكلفة والرسوم' },
                { k: 'وحدات مطلوبة', v: fmt(units), s: 'شهرياً' },
                { k: 'ساعات مطلوبة', v: `${fmt(hours)}h`, s: 'شهرياً' },
                { k: 'ساعات يومياً', v: `${fmt(perDay * 10) / 10}h`, s: 'على مدى الأيام المختارة' },
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
                      ? `تحتاج ${fmt(units)} وحدة شهرياً بمعدل ${Math.round((perDay * 10) / 10 * 10) / 10} ساعة يومياً. الحل ليس العمل أكثر، بل رفع سعر الوحدة أو تقليل ساعاتها — وهنا يبدأ التطور الحقيقي.`
                      : `تحتاج ${fmt(perDay * 10) / 10} ساعة يومياً، وهذا مستحيل تقريباً مع الدراسة أو العمل. الخيارات: رفع السعر، تقليل ساعات الوحدة، أو خفض الهدف الأولي. لا خيار رابع.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">sensitivity · ماذا لو رفعت السعر؟</div>
              <div className="space-y-1.5">
                {[1, 1.25, 1.5, 2].map((mult) => {
                  const newPrice = price * mult;
                  const newPerUnit = Math.max(0, newPrice / c.rate - costs / c.rate - (newPrice / c.rate) * (feePct / 100));
                  const newUnits = newPerUnit > 0 ? Math.ceil(targetUsd / newPerUnit) : 0;
                  const newHours = newUnits * hoursPerUnit;
                  return (
                    <div key={mult} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.015] px-3 py-2">
                      <span className="mono w-16 shrink-0 text-[10.5px] text-slate-500">×{mult}</span>
                      <span className="w-24 shrink-0 text-[11px] text-slate-300">
                        {c.code} {fmt(newPrice)}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
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
          </div>
        </div>
      </div>
    </section>
  );
}
