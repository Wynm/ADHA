import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { usePersistentState } from '../lib/hooks.js';
import { useStore } from '../lib/store.jsx';
import { PHASES } from '../data/roadmap.js';
import { Reveal, SectionHeading } from './ui.jsx';

const QUESTIONS = [
  {
    id: 'shipped',
    ar: 'ما الشيء الذي أنجزته هذا الأسبوع فعلاً؟',
    hint: 'ليس ما تعلمته، بل ما يمكن أن يراه شخص آخر.',
    placeholder: 'مثال: نشرت صفحة العميل الأول وأرسلت العرض.',
  },
  {
    id: 'talked',
    ar: 'مع من تحدثت عن عملك؟',
    hint: 'صفر محادثات = صفر احتمالات. الأرقام هنا ليست اجتماعية، بل قنوات.',
    placeholder: 'مثال: 3 رسائل لمتاجر محلية، رد واحد.',
  },
  {
    id: 'blocked',
    ar: 'ما الشيء الذي أوقفك أكثر؟',
    hint: 'سمّه بدقة. «لم أجد وقتاً» ليست مشكلة، بل نتيجة لمشكلة.',
    placeholder: 'مثال: ترددت في إرسال السعر، فأجّلت الرسالة يومين.',
  },
  {
    id: 'next',
    ar: 'ما الخطوة الواحدة للأسبوع القادم؟',
    hint: 'واحدة فقط. من يضع ثلاث خطوات ينفّذ صفراً.',
    placeholder: 'مثال: إغلاق عرض مكتوب لعميل واحد.',
  },
  {
    id: 'honest',
    ar: 'ما الرقم الذي أخفيت عنه هذه الأسبوع؟',
    hint: 'ساعات العمل، الرفض، أو التوقف. الرقم المخفي هو ما يوقفك.',
    placeholder: 'مثال: خطتي 15 ساعة، نفّذت 6 فقط.',
  },
];

export default function Review() {
  const s = useStore();
  const [reviews, setReviews] = usePersistentState('adha.reviews', []);
  const [form, setForm] = useState({});

  const weekLabel = useMemo(() => {
    const d = new Date();
    const onejan = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  }, []);

  const save = () => {
    const filled = QUESTIONS.filter((q) => (form[q.id] || '').trim().length > 2);
    if (filled.length < 3) return;
    const entry = {
      week: weekLabel,
      date: new Date().toISOString().slice(0, 10),
      ...form,
    };
    setReviews((prev) => [entry, ...(prev || [])].slice(0, 12));
    setForm({});
  };

  const roadmapDone = Object.values(s.tasks || {}).filter(Boolean).length;
  const roadmapTotal = PHASES.reduce((a, p) => a + p.tasks.length, 0);

  return (
    <section id="review" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Weekly Review · المراجعة"
            tone="cyan"
            title={
              <>
                الحماس يخبو. <span className="ember-text">المراجعة لا تخبو.</span>
              </>
            }
            desc="خمسة أسئلة، عشر دقائق، كل أسبوع. ليست للتحفيز، بل لتشخيص الحقيقة قبل أن تكبر. اكتب بصدق — النتيجة تُحفظ على جهازك فقط، وآخر 12 مراجعة تبقى أمامك كسجل."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="glass-strong rounded-2xl p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">week {weekLabel} · review</div>
              <div className="mono text-[10px] text-slate-600">{new Date().toISOString().slice(0, 10)}</div>
            </div>

            <div className="space-y-3">
              {QUESTIONS.map((q, i) => (
                <div key={q.id}>
                  <label className="flex items-baseline gap-2">
                    <span className="mono text-[9px] text-cyan">0{i + 1}</span>
                    <span className="text-[12.5px] font-medium text-slate-200">{q.ar}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form[q.id] || ''}
                    onChange={(e) => setForm((p) => ({ ...p, [q.id]: e.target.value }))}
                    placeholder={q.placeholder}
                    className="mt-1 w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2 text-[11.5px] leading-relaxed text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan/40"
                  />
                  <p className="mt-0.5 text-[10px] text-slate-600">{q.hint}</p>
                </div>
              ))}
            </div>

            <button onClick={save} className="btn btn-primary mt-4 w-full py-2.5 text-[12.5px]">
              احفظ المراجعة
            </button>
            <p className="mono mt-1.5 text-center text-[9.5px] text-slate-600">
              يُطلب 3 إجابات على الأقل — لا مراجعة كاملة بمجهود ناقص
            </p>
          </div>

          <div className="space-y-3">
            <div className="glass rounded-2xl p-4">
              <div className="mono mb-2.5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                <span>log</span>
                <span>{(reviews || []).length}/12</span>
              </div>
              {(!reviews || reviews.length === 0) ? (
                <p className="py-6 text-center text-[11.5px] text-slate-600">
                  لا مراجعات بعد. أول مراجعة هي الأصعب، والأكثر فائدة.
                </p>
              ) : (
                <div className="max-h-[420px] space-y-1.5 overflow-y-auto">
                  {reviews.map((r, i) => (
                    <motion.div
                      key={`${r.date}-${i}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="mono text-[10px] text-cyan">W{r.week}</span>
                        <span className="mono text-[9px] text-slate-600">{r.date}</span>
                      </div>
                      {r.next && (
                        <div className="mt-1 text-[11px] text-slate-300">
                          <span className="text-slate-600">التالي: </span>
                          {r.next}
                        </div>
                      )}
                      {r.honest && (
                        <div className="mt-0.5 text-[10.5px] text-slate-500">
                          <span className="text-slate-600">الرقم المخفي: </span>
                          {r.honest}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="mono mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">snapshot</div>
              <div className="space-y-1.5 text-[11.5px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">المسار المختار</span>
                  <span className="text-slate-200">{s.trackId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">الساعات/أسبوع</span>
                  <span className="mono text-slate-200">{s.hours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">مهام الخريطة</span>
                  <span className="mono text-slate-200">
                    {roadmapDone}/{roadmapTotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">أيام الالتزام</span>
                  <span className="mono text-slate-200">{Object.values(s.streak || {}).filter(Boolean).length}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-3.5">
              <p className="text-[10.5px] leading-relaxed text-slate-400">
                <span className="font-semibold text-amber-300">لماذا 12 فقط؟</span> المراجعات القديمة تصبح أرشيفاً يُقرأ
                للاطمئنان لا للتشخيص. ما يهمك هو آخر ثلاثة أشهر.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
