import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal, SectionHeading } from './ui.jsx';

const QUESTIONS = [
  {
    id: 'q1',
    q: 'ما أقرب شيء تستطيع تقديمه لشخص آخر اليوم؟',
    opts: [
      { k: 'build', v: 'أستطيع بناء/إصلاح شيء تقني' },
      { k: 'talk', v: 'أستطيع الشرح والإقناع' },
      { k: 'make', v: 'أستطيع التصميم أو الكتابة' },
      { k: 'nothing', v: 'لا شيء واضح بعد — أحتاج أن أتعلّم أولاً' },
    ],
  },
  {
    id: 'q2',
    q: 'كم ساعة أسبوعياً تستطيع الالتزام بها فعلياً لمدة 3 أشهر؟',
    opts: [
      { k: 'low', v: 'أقل من 6 ساعات' },
      { k: 'mid', v: '6 – 15 ساعة' },
      { k: 'high', v: '15 – 30 ساعة' },
      { k: 'full', v: 'أكثر من 30 ساعة' },
    ],
  },
  {
    id: 'q3',
    q: 'ما الذي تحتاجه في الشهر الأول أكثر؟',
    opts: [
      { k: 'cash', v: 'أي مبلغ، بأسرع وقت' },
      { k: 'proof', v: 'دليل عمل أقدر أعرضه' },
      { k: 'audience', v: 'جمهور يثق بي' },
      { k: 'asset', v: 'شيء يعمل بدوني لاحقاً' },
    ],
  },
  {
    id: 'q4',
    q: 'أي نوع من الإحباط تستطيع تحمّله أكثر؟',
    opts: [
      { k: 'rejection', v: 'رفض العملاء المتكرر' },
      { k: 'silence', v: 'صمت الجمهور لأشهر' },
      { k: 'boring', v: 'عمل متكرر وممل' },
      { k: 'uncertain', v: 'عدم معرفة إن كان سينجح' },
    ],
  },
];

const PATHS = {
  freelance: {
    ar: 'عمل حرّ مُتخصّص',
    emoji: '🎯',
    why: 'لديك مهارة قابلة للبيع الآن، ووقت كافٍ للتواصل مع العملاء. هذا أسرع طريق لأول دولار.',
    first: 'حدّد خدمة واحدة بسعر ثابت، ثم أرسل 10 عروض محدّدة هذا الأسبوع.',
    avoid: 'لا تُطلق منتجاً قبل أن تبيع خدمتك خمس مرات.',
  },
  service: {
    ar: 'خدمة مُنتَجة (Productized Service)',
    emoji: '📦',
    why: 'مهارتك موجودة لكن وقتك محدود. حوّل الخدمة إلى «باقة» بسعر ثابت ونطاق واضح.',
    first: 'اكتب باقة واحدة في 5 أسطر: ماذا تشمل، ماذا لا تشمل، السعر، المدة.',
    avoid: 'لا تقبل مشاريع «غير محددة» — ستأكل وقتك كله.',
  },
  product: {
    ar: 'منتج رقمي',
    emoji: '💾',
    why: 'لديك مهارة صناعة، وتفضّل بناء شيء مرة واحدة بدل تكرار الخدمة.',
    first: 'أنشئ قالباً صغيراً جداً (ساعة عمل) وابدأ ببيعه لعشرة أشخاص تعرفهم.',
    avoid: 'لا تبنِ منتجاً كبيراً قبل أن تبيع نسخة صغيرة.',
  },
  content: {
    ar: 'محتوى تعليمي',
    emoji: '🎙️',
    why: 'قوتك في الشرح، وتستطيع تحمّل صمت الجمهور. هذا المسار يكافئ الثبات أكثر من الموهبة.',
    first: 'انشر 20 قطعة محتوى في 30 يوماً حول مشكلة واحدة محددة.',
    avoid: 'لا تنتظر «الجاهزية» — ابدأ قبل أن تشعر أنك مستعد.',
  },
  learn: {
    ar: 'مرحلة تعلّم قبل السوق',
    emoji: '🌱',
    why: 'لا تملك بعد شيئاً قابلاً للبيع. لا مشكلة — لكن لا تدخل السوق قبل بناء أساس.',
    first: '60 ساعة في مهارة واحدة، ثم أول إنجاز قابل للعرض قبل أي محاولة بيع.',
    avoid: 'لا تشترِ أي كورس في هذه المرحلة. المجاني يكفي لأول 60 ساعة.',
  },
};

function recommend(answers) {
  const { q1, q2, q3, q4 } = answers;
  if (q1 === 'nothing' && (q2 === 'low' || q2 === 'mid')) return 'learn';
  if (q3 === 'cash' && q1 !== 'nothing') return q2 === 'low' ? 'service' : 'freelance';
  if (q3 === 'asset') return q1 === 'make' || q1 === 'build' ? 'product' : 'content';
  if (q3 === 'audience' || q1 === 'talk') return 'content';
  if (q3 === 'proof') return q1 === 'build' ? 'product' : 'service';
  if (q4 === 'boring' || q2 === 'full') return 'freelance';
  return 'service';
}

export default function Compass() {
  const [answers, setAnswers] = useState({});
  const done = Object.keys(answers).length === QUESTIONS.length;
  const pathId = useMemo(() => (done ? recommend(answers) : null), [answers, done]);
  const path = pathId ? PATHS[pathId] : null;

  const step = Object.keys(answers).length;

  return (
    <section id="compass" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Compass · البوصلة"
            tone="cyan"
            title={
              <>
                أربعة أسئلة. <span className="ember-text">مسار واحد.</span>
              </>
            }
            desc="لا يوجد «أفضل مسار» في المطلق. يوجد المسار الأقرب لما تملكه الآن وما تستطيع تحمّله. هذا الاختبار بسيط بقصد — الأدوات المعقّدة تُخفي الحقيقة."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            {QUESTIONS.map((q, qi) => {
              const chosen = answers[q.id];
              const active = qi <= step;
              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-4 transition-all duration-300 ${
                    active ? 'border-white/[0.12] bg-panel/60' : 'border-white/[0.06] bg-panel/25 opacity-45'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mono mt-0.5 shrink-0 text-[10px] text-cyan">{String(qi + 1).padStart(2, '0')}</span>
                    <div className="flex-1">
                      <div className="text-[13.5px] font-medium text-slate-200">{q.q}</div>
                      <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                        {q.opts.map((o) => {
                          const isSel = chosen === o.k;
                          return (
                            <button
                              key={o.k}
                              onClick={() => setAnswers((p) => ({ ...p, [q.id]: o.k }))}
                              className={`rounded-lg border px-3 py-2 text-start text-[11.5px] transition ${
                                isSel
                                  ? 'border-cyan/50 bg-cyan/10 text-cyan'
                                  : 'border-white/[0.08] bg-white/[0.015] text-slate-400 hover:border-white/25 hover:text-white'
                              }`}
                            >
                              {o.v}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {done && (
              <button
                onClick={() => setAnswers({})}
                className="mono rounded-lg border border-white/10 px-3 py-1.5 text-[10.5px] text-slate-500 hover:text-white"
              >
                ↻ أعد الاختبار
              </button>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass-strong relative overflow-hidden rounded-2xl p-5">
              {done && <div className="scan-line" />}
              <div className="mono mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                <span>your path</span>
                <span>{step}/4</span>
              </div>
              <AnimatePresence mode="wait">
                {!path ? (
                  <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center">
                    <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full border border-white/10 text-2xl">🧭</div>
                    <p className="text-[12.5px] text-slate-500">أجب على الأسئلة الأربعة…</p>
                  </motion.div>
                ) : (
                  <motion.div key={pathId} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-xl border border-cyan/30 bg-cyan/10 text-2xl">
                        {path.emoji}
                      </span>
                      <h3 className="font-display text-lg font-bold text-white">{path.ar}</h3>
                    </div>
                    <p className="mt-4 text-[12.5px] leading-relaxed text-slate-300">{path.why}</p>
                    <div className="mt-4 rounded-xl border border-lime/25 bg-lime/[0.06] p-3">
                      <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-lime">start here</div>
                      <p className="text-[12px] leading-relaxed text-slate-200">{path.first}</p>
                    </div>
                    <div className="mt-2 rounded-xl border border-red-400/20 bg-red-500/[0.06] p-3">
                      <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-red-300">do not</div>
                      <p className="text-[12px] leading-relaxed text-slate-300">{path.avoid}</p>
                    </div>
                    <a href="#simulator" className="btn btn-primary mt-4 w-full py-2.5 text-[12.5px]">
                      احسب منحنى هذا المسار ←
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="mt-2 px-1 text-[10.5px] leading-relaxed text-slate-600">
              هذا ليس تشخيصاً، بل بوصلة أولية. القرار النهائي يحتاج معلومة أكثر عنك، وأنت تعرف نفسك أكثر من أي اختبار.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
