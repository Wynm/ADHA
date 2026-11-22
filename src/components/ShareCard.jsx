import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { simulate } from '../lib/simulator.js';
import { PHASES } from '../data/roadmap.js';
import { COMPASS_PATHS, guessPath } from '../lib/plan.js';
import { evaluate } from '../lib/premortem.js';
import { usePersistentState } from '../lib/hooks.js';
import { downloadCanvas, drawShareCard } from '../lib/sharecard.js';
import { Reveal, SectionHeading } from './ui.jsx';

export default function ShareCard() {
  const s = useStore();
  const canvasRef = useRef(null);
  const [name, setName] = usePersistentState('adha.name', '');
  const [pm] = usePersistentState('adha.premortem', {});
  const [ready, setReady] = useState(false);

  const data = useMemo(() => {
    const sim = simulate(s.trackId, s.hours);
    const totalTasks = PHASES.reduce((a, p) => a + p.tasks.length, 0);
    const doneTasks = Object.values(s.tasks || {}).filter(Boolean).length;
    const streak = s.streak || {};
    const grid = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      grid.push(!!streak[d.toISOString().slice(0, 10)]);
    }
    let current = 0;
    for (let i = grid.length - 1; i >= 0; i--) {
      if (grid[i]) current++;
      else break;
    }
    const ev = evaluate(pm);
    return {
      name,
      path: Object.keys(s.compass || {}).length >= 4 ? COMPASS_PATHS[guessPath(s.compass)] : null,
      months: sim.months,
      month24: sim.month24,
      total2y: sim.total2y,
      totalHours: sim.totalHours,
      hoursPerWeek: s.hours,
      survival: ev.complete ? ev.pct : null,
      doneTasks,
      totalTasks,
      streak: current,
      streakGrid: grid,
    };
  }, [s, pm, name]);

  useEffect(() => {
    let cancelled = false;
    const draw = async () => {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {
        /* ignore */
      }
      if (cancelled || !canvasRef.current) return;
      drawShareCard(canvasRef.current, data);
      setReady(true);
    };
    const t = setTimeout(draw, 120);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [data]);

  const share = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      const file = new File([blob], 'adha-card.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'بطاقة ADHA',
          text: 'أرقامي الحقيقية في ساحة الفرص — بدون وعود.',
        });
        return;
      }
    } catch {
      /* fallback to download */
    }
    downloadCanvas(canvas, `adha-card-${new Date().toISOString().slice(0, 10)}.png`);
  };

  return (
    <section id="share" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Share · البطاقة"
            tone="lime"
            title={
              <>
                لا تنشر صورة ربح. <span className="ember-text">انشر صورة قرار.</span>
              </>
            }
            desc="بطاقة تُرسم الآن من أرقامك: منحنى سنتين، ساعاتك، مؤشر بقائك، وتقدّمك على الخريطة. صورة واحدة تُغني عن شرح طويل — وتُذكّرك أنت قبل غيرك بأنك التزمت."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="glass-strong relative overflow-hidden rounded-2xl p-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,107,26,0.08),transparent_60%)]" />
            <canvas
              ref={canvasRef}
              className="relative mx-auto h-auto w-full max-w-[420px] rounded-xl shadow-[0_30px_80px_-40px_rgba(255,107,26,0.5)]"
              aria-label="بطاقة المشاركة"
              style={{ aspectRatio: '1080 / 1350' }}
            />
            {!ready && (
              <div className="absolute inset-0 grid place-items-center text-[12px] text-slate-500">تُرسم البطاقة…</div>
            )}
          </div>

          <div className="space-y-3">
            <div className="glass rounded-2xl p-4">
              <label className="mono mb-2 block text-[10px] uppercase tracking-[0.2em] text-slate-500">
                your name on the card
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 28))}
                placeholder="اكتب اسمك (اختياري)"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[13px] text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-lime/40"
              />
              <p className="mt-2 text-[10.5px] leading-relaxed text-slate-600">
                يبقى على جهازك فقط. لا يُرسل إلى أي خادم، ولا يظهر لأحد إلا في الصورة التي تنزّلها أنت.
              </p>
            </div>

            <button onClick={share} className="btn btn-primary w-full py-3.5 text-[13.5px]">
              ⤓ نزّل / شارك البطاقة
            </button>

            <div className="glass rounded-2xl p-4">
              <div className="mono mb-2.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">card contents</div>
              <ul className="space-y-1.5 text-[11.5px] leading-relaxed text-slate-400">
                {[
                  'اسمك + المسار من البوصلة',
                  'دخل الشهر 24 والصافي التراكمي',
                  'إجمالي الساعات (الثمن الحقيقي)',
                  'منحنى 24 شهراً من المحاكي',
                  'مؤشر البقاء من Pre-Mortem',
                  'تقدّم الخريطة + أيام الالتزام',
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="text-lime">·</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-3.5">
              <p className="text-[11px] leading-relaxed text-slate-300">
                <span className="font-semibold text-amber-300">لماذا لا نضع أرباحاً مزيفة؟</span> لأن أول شيء سيفعله أصدقاؤك
                هو سؤالك «كيف؟». والجواب الذي تحمله هذه البطاقة هو الأهم: منهج، لا وعد.
              </p>
            </div>

            <p className="mono px-1 text-[9.5px] leading-relaxed text-slate-600">
              // كل الأرقام في البطاقة تُحسب محلياً في متصفحك من إعداداتك.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
