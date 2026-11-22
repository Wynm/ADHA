import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store.jsx';
import { Reveal, SectionHeading } from './ui.jsx';

const HABITS = [
  { id: 'learn', ar: 'تعلّم 60 دقيقة', icon: '📚' },
  { id: 'build', ar: 'إنتاج شيء ملموس', icon: '🛠️' },
  { id: 'reach', ar: 'تواصل مع عميل/شخص', icon: '✉️' },
  { id: 'review', ar: 'مراجعة أرقامي', icon: '📊' },
];

function lastNDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export default function Tracker() {
  const s = useStore();
  const [selected, setSelected] = useState(() => new Date().toISOString().slice(0, 10));
  const days = useMemo(() => lastNDays(30), []);
  const streak = useMemo(() => s.streak || {}, [s.streak]);

  // السلسلة الحالية: كم يوماً متتالياً مسجّلين حتى اليوم
  const currentStreak = useMemo(() => {
    let n = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (streak[days[i]]) n++;
      else break;
    }
    return n;
  }, [days, streak]);

  const bestStreak = useMemo(() => {
    let best = 0;
    let cur = 0;
    for (const d of days) {
      if (streak[d]) {
        cur++;
        best = Math.max(best, cur);
      } else cur = 0;
    }
    return best;
  }, [days, streak]);

  const todayDone = !!streak[selected];

  return (
    <section id="tracker" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Tracker · المتتبّع"
            tone="lime"
            title={
              <>
                ثلاثون يوماً من <span className="ember-text">الظهور، لا من الشغف.</span>
              </>
            }
            desc="الأفكار لا تُنجز، الأيام تُنجز. علّم يوماً واحداً فقط إذا فعلت شيئاً حقيقياً واحداً. السلسلة ليست للمتعة — هي أرخص مؤشر على أنك تستمر بعد اختفاء الحافز الأول."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="glass rounded-2xl p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[13px] font-semibold text-white">آخر 30 يوماً</div>
              <div className="mono flex items-center gap-3 text-[10.5px] text-slate-500">
                <span>
                  الحالية <span className="text-lime">{currentStreak}</span>
                </span>
                <span className="text-slate-700">|</span>
                <span>
                  الأفضل <span className="text-cyan">{bestStreak}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-1.5" dir="ltr">
              {days.map((d, i) => {
                const on = !!streak[d];
                const isSel = d === selected;
                const isToday = i === days.length - 1;
                return (
                  <button
                    key={d}
                    onClick={() => setSelected(d)}
                    title={d}
                    className={`group relative aspect-square rounded-md border transition ${
                      on
                        ? 'border-lime/50 bg-lime/25 hover:bg-lime/35'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/25'
                    } ${isSel ? 'ring-2 ring-ember/60' : ''}`}
                  >
                    {on && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 grid place-items-center text-[10px] text-lime"
                      >
                        ✓
                      </motion.span>
                    )}
                    {isToday && !on && <span className="absolute inset-0 grid place-items-center text-[9px] text-ember/70">•</span>}
                    <span className="mono absolute -bottom-4 start-0 hidden text-[8px] text-slate-600 group-hover:block">
                      {d.slice(5)}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 h-px bg-white/[0.06]" />

            <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="mono text-[9.5px] uppercase tracking-[0.2em] text-slate-600">selected day</div>
                  <div className="mono mt-0.5 text-sm font-bold text-white" dir="ltr">
                    {selected}
                  </div>
                </div>
                <button
                  onClick={() => s.toggleDay(selected)}
                  className={`btn px-5 py-2 text-[12.5px] ${todayDone ? 'btn-ghost' : 'btn-primary'}`}
                >
                  {todayDone ? '✕ إلغاء تسجيل اليوم' : '✓ سجّل يوماً حقيقياً'}
                </button>
              </div>
              <p className="mt-2.5 text-[11px] leading-relaxed text-slate-500">
                الشرط: شيء أنجزته فعلاً — لا نية، ولا خطة، ولا «غداً سأبدأ». لو لم تفعل شيئاً، اتركه فارغاً. الفراغ
                الصادق أفيد من ✓ كاذب.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="glass rounded-2xl p-4">
              <div className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">4 habits · العادات الأربع</div>
              <div className="space-y-1.5">
                {HABITS.map((h) => (
                  <div key={h.id} className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.015] px-2.5 py-2">
                    <span className="text-sm">{h.icon}</span>
                    <span className="text-[11.5px] text-slate-300">{h.ar}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10.5px] leading-relaxed text-slate-600">
                لو حقّقت اثنتين منها يومياً لمدة 30 يوماً، ستتقدّم أكثر من 90% ممّن يقرأون عن الربح من الإنترنت.
              </p>
            </div>

            <div className="rounded-2xl border border-ember/25 bg-ember/[0.06] p-4">
              <div className="mono mb-1.5 text-[10px] uppercase tracking-[0.18em] text-ember">base rate reality</div>
              <p className="text-[11.5px] leading-relaxed text-slate-300">
                معظم من يبدأ التعلّم يتوقف في الأسبوع الثالث — لا لأن الطريق صعب، بل لأن أول نتيجة تأتي متأخرة عن أول
                دافع. <span className="text-white">تسجيل الأيام</span> يعطيك نتيجة أسبوعية صغيرة، وهي كافية للاستمرار.
              </p>
            </div>

            <button onClick={s.reset} className="mono w-full rounded-lg border border-white/10 px-3 py-2 text-[10px] text-slate-600 transition hover:border-red-400/30 hover:text-red-300">
              reset all local data
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
