import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const STEPS = [
  {
    id: 'intro',
    icon: '⛺',
    tag: 'welcome',
    title: 'مرحباً في ADHA',
    body: 'هذا ليس موقعاً يبيعك «الربح من الإنترنت». إنه مختبر قرارات: أرقام، مخاطر، وقواعد تُديرها بنفسك — كل شيء يعمل في متصفحك دون حساب.',
    hint: 'الجولة تستغرق 20 ثانية، ويمكنك تخطيها الآن.',
  },
  {
    id: 'start',
    icon: '🧭',
    tag: 'where to start',
    title: 'ابدأ من البوصلة، لا من الساحة',
    body: 'أربعة أسئلة تحدد المسار الأقرب لما تملكه اليوم. بعدها، المحاكي يخبرك كم ستحتاج من وقت قبل أول دولار حقيقي.',
    hint: 'لا تبدأ من «أفضل مسار» — ابدأ من «المسار الذي تستطيع تحمّله».',
  },
  {
    id: 'verify',
    icon: '🛡️',
    tag: 'before anything',
    title: 'إذا وصلك عرض، افحصه أولاً',
    body: 'الماسح يشرّح نص أي عرض إلى 10 أنماط معروفة، والمختبر يجعلك تبني الفخ بنفسك لتفهمه للأبد.',
    hint: 'قاعدة واحدة تكفي في البداية: أي مال يُطلب منك قبل أن تعمل، هو نهاية العلاقة.',
  },
  {
    id: 'commit',
    icon: '📌',
    tag: 'make it stick',
    title: 'اختر 90 يوماً، وسجّل أيامك',
    body: 'الخريطة تمنحك مهاماً محددة، والمتتبّع يعطيك نتيجة أسبوعية صغيرة. سيشعرك هذا بالاستمرار أكثر من أي فيديو تحفيزي.',
    hint: 'في النهاية، نزّل خطتك كملف — والتزامك المكتوب أقوى من نيّتك.',
  },
];

export default function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem('adha.tour.seen')) {
        const t = setTimeout(() => setOpen(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const close = (seen = true) => {
    setOpen(false);
    if (seen) {
      try {
        localStorage.setItem('adha.tour.seen', '1');
      } catch {
        /* ignore */
      }
    }
  };

  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] grid place-items-center bg-black/75 p-4 backdrop-blur-md"
          onClick={() => close()}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative w-full max-w-md overflow-hidden rounded-2xl p-6"
          >
            <div className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-ember/20 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <div className="mono text-[9.5px] uppercase tracking-[0.24em] text-slate-500">{s.tag}</div>
              <button
                onClick={() => close()}
                className="mono rounded border border-white/10 px-2 py-0.5 text-[10px] text-slate-500 transition hover:text-white"
              >
                تخطٍّ ✕
              </button>
            </div>

            <div className="relative mt-4 flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-2xl">
                {s.icon}
              </span>
              <h3 className="font-display text-xl font-bold text-white">{s.title}</h3>
            </div>

            <p className="mt-4 text-[13px] leading-[1.95] text-slate-300">{s.body}</p>
            <p className="mt-3 rounded-lg border border-lime/20 bg-lime/[0.05] p-2.5 text-[11.5px] leading-relaxed text-lime/90">
              {s.hint}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {STEPS.map((x, i) => (
                  <span
                    key={x.id}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= step ? 'bg-ember' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {step > 0 && (
                <button onClick={() => setStep((v) => v - 1)} className="btn btn-ghost px-4 py-2 text-[12px]">
                  ← السابق
                </button>
              )}
              <button
                onClick={() => (last ? (close(), document.getElementById('compass')?.scrollIntoView({ behavior: 'smooth' })) : setStep((v) => v + 1))}
                className="btn btn-primary flex-1 py-2.5 text-[12.5px]"
              >
                {last ? 'ابدأ بالبوصلة →' : 'التالي →'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
