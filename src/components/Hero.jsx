import { motion } from 'framer-motion';
import { useCounter, useInView } from '../lib/hooks.js';

const STATS = [
  { value: 8, suffix: '', label: 'مسارات ربح حقيقية', sub: 'مصنّفة بالمخاطرة والزمن' },
  { value: 24, suffix: '', label: 'شهراً في المحاكي', sub: 'منحنى دخل لا صورة' },
  { value: 10, suffix: '', label: 'قواعد كشف احتيال', sub: 'كل قاعدة بشرحها' },
  { value: 90, suffix: '', label: 'يوماً في الخريطة', sub: 'مهام بمعايير قياس' },
];

function Stat({ value, suffix, label, sub }) {
  const [ref, inView] = useInView();
  const n = useCounter(value, { active: inView, duration: 1500 });
  return (
    <div ref={ref} className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-ember/30 hover:bg-white/[0.045]">
      <div className="font-display flex items-baseline gap-0.5 text-2xl font-bold text-white md:text-3xl">
        {n}
        <span className="text-ember">{suffix}</span>
      </div>
      <div className="mt-1 text-[13px] font-medium text-slate-200">{label}</div>
      <div className="mt-0.5 text-[11px] text-slate-500">{sub}</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 md:pt-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ── left / copy ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mono mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-slate-400"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
              </span>
              v1.0 · بنيتُ بالعربية أولاً
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.4rem]"
            >
              ساحة الفرص
              <br />
              <span className="gradient-text">الحقيقية.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18 }}
              className="mt-6 max-w-xl text-[15px] leading-[1.9] text-slate-400 sm:text-[17px]"
            >
              هذا ليس مستودعاً يَعِدك بالمال. هذا <span className="text-white">مختبر قرارات</span>: تحاكي الدخل قبل أن
              تعيشه، تفحص العروض قبل أن تصدّقها، وترى مخاطر كل طريق مكتوبةً بخط واضح.
              <br />
              <span className="text-slate-500">لأن الثقة تُبنى بالأرقام، لا بالوعود.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a href="#simulator" className="btn btn-primary px-6 py-3 text-sm">
                جرّب المحاكي الآن
                <span aria-hidden>←</span>
              </a>
              <a href="#shield" className="btn btn-ghost px-6 py-3 text-sm">
                افحص عرضاً مشبوهاً
              </a>
              <span className="mono hidden text-[11px] text-slate-600 sm:inline">// لا تسجيل. لا تتبّع. يعمل في المتصفح.</span>
            </motion.div>

            <div className="mt-12 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {STATS.map((s) => (
                <Stat key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* ── right / terminal card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-[conic-gradient(from_140deg,rgba(255,107,26,0.18),transparent_35%,rgba(34,211,238,0.16),transparent_70%)] blur-2xl" />
            <div className="glass-strong relative overflow-hidden rounded-[1.6rem] ring-glow">
              <div className="scan-line" />
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">adha · runtime</div>
              </div>

              <div className="mono space-y-2 px-4 py-5 text-[11.5px] leading-relaxed sm:text-xs" dir="ltr">
                <p className="text-slate-500">$ node adha.js --mode=reality</p>
                <p className="text-slate-300">
                  <span className="text-cyan">▸</span> scanning 3 offers for red flags…{' '}
                  <span className="text-red-400">2 critical</span>
                </p>
                <p className="text-slate-300">
                  <span className="text-cyan">▸</span> modelling 24-month income curve:{' '}
                  <span className="text-amber-300">logarithmic</span>
                </p>
                <p className="text-slate-300">
                  <span className="text-cyan">▸</span> hours invested: <span className="text-white">880</span> · net:{' '}
                  <span className="text-lime">$4,120</span>
                </p>
                <p className="text-slate-500">
                  <span className="text-ember">!</span> warning: "guaranteed daily 3%" detected → ponzi pattern
                </p>
                <p className="text-slate-300">
                  <span className="text-cyan">▸</span> verdict: <span className="text-lime">build a skill, sell it</span>
                </p>
                <p className="text-slate-500">
                  $ <span className="inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-ember" />
                </p>
              </div>

              <div className="grid grid-cols-3 gap-px border-t border-white/[0.08] bg-white/5">
                {[
                  { k: 'أول دولار', v: '21 يوم' },
                  { k: 'قابل للقياس', v: '100%' },
                  { k: 'وعود', v: 'صفر' },
                ].map((x) => (
                  <div key={x.k} className="bg-panel/70 px-3 py-3 text-center">
                    <div className="text-[10px] text-slate-500">{x.k}</div>
                    <div className="font-display mt-0.5 text-sm font-semibold text-white">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-600">
              <span className="chip">بدون بيانات شخصية</span>
              <span className="chip">يعمل دون إنترنت بعد التحميل</span>
              <span className="chip">مفتوح المصدر</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* marquee */}
      <div className="marquee-wrap relative mt-20 overflow-hidden border-y border-white/[0.08] bg-white/[0.015] py-3.5">
        <div className="marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-10 pe-10">
              {[
                'لا يوجد ربح مضمون',
                'الدليل قبل الضجيج',
                'الوقت أغلى رأس مال',
                'الأصل قبل الدخل',
                'العقد قبل اليد',
                'الأرقام لا تكذب',
                'لا للربح السريع',
                'المهارة القابلة للنقل',
              ].map((t) => (
                <span key={t} className="mono flex items-center gap-3 whitespace-nowrap text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  <span className="h-1 w-1 rounded-full bg-ember/70" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
