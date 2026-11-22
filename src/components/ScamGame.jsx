import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RANKS, ROUNDS } from '../data/game.js';
import { usePersistentState } from '../lib/hooks.js';
import { Reveal, SectionHeading } from './ui.jsx';

export default function ScamGame() {
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [log, setLog] = usePersistentState('adha.game', { best: 0, plays: 0 });
  const finished = i >= ROUNDS.length;

  const round = ROUNDS[i];
  const isCorrect = choice !== null && choice === round?.scam;
  const rank = useMemo(() => RANKS.find((r) => correct <= r.max) || RANKS[0], [correct]);

  const answer = (v) => {
    if (choice !== null) return;
    setChoice(v);
    if (v === round.scam) setCorrect((c) => c + 1);
  };

  const next = () => {
    setChoice(null);
    setI((x) => x + 1);
  };

  const restart = () => {
    const best = Math.max(log.best, correct);
    setLog({ best, plays: (log.plays || 0) + 1 });
    setI(0);
    setChoice(null);
    setCorrect(0);
  };

  if (finished) {
    return (
      <section id="game" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong rounded-3xl p-8 text-center">
            <div className="mono text-[10px] uppercase tracking-[0.24em] text-slate-500">final result</div>
            <div className="font-display mt-3 text-5xl font-bold" style={{ color: rank.color }}>
              {correct}<span className="text-2xl text-slate-600">/{ROUNDS.length}</span>
            </div>
            <div className="mt-1 text-xl font-bold" style={{ color: rank.color }}>{rank.ar}</div>
            <p className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed text-slate-400">{rank.note}</p>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {[
                { k: 'أفضل نتيجة سابقة', v: `${log.best}/${ROUNDS.length}` },
                { k: 'عدد المحاولات', v: `${(log.plays || 0) + 1}` },
                { k: 'نسبة النجاح', v: `${Math.round((correct / ROUNDS.length) * 100)}%` },
              ].map((x) => (
                <div key={x.k} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                  <div className="text-[10px] text-slate-600">{x.k}</div>
                  <div className="mono mt-0.5 text-base font-bold text-white">{x.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-lime/20 bg-lime/[0.05] p-4 text-start">
              <div className="mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-lime">the takeaway</div>
              <p className="text-[12px] leading-relaxed text-slate-300">
                لن تحمي نفسك بحفظ قائمة إشارات، بل ببناء <span className="text-white">سؤال واحد</span>: «من أين يأتي المال
                فعلاً؟» — إن لم يكن هناك منتج أو خدمة أو عقد، فالمال يأتي من شخص آخر يدخل بعدك. وأنت ذلك الشخص.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={restart} className="btn btn-primary px-6 py-2.5 text-[13px]">↻ العب مرة أخرى</button>
              <a href="#shield" className="btn btn-ghost px-6 py-2.5 text-[13px]">افحص عرضاً حقيقياً</a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="game" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Game · نصب أم عمل؟"
            tone="ember"
            align="center"
            title={
              <>
                ست عشرة بطاقة. <span className="ember-text">قرار في ثانيتين.</span>
              </>
            }
            desc="لن تقرأ قائمة تحذيرات وتحفظها. ستقرر، ثم تكتشف. كل خطأ هنا يوفّر عليك خطأً حقيقياً بمئات الدولارات."
          />
        </Reveal>

        <div className="mt-8 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ember to-amber-300"
              animate={{ width: `${(i / ROUNDS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="mono shrink-0 text-[11px] text-slate-500">
            {i}/{ROUNDS.length} · <span className="text-lime">{correct}</span> ✓
          </span>
        </div>

        <div className="relative mt-4 min-h-[330px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={round.id}
              initial={{ opacity: 0, y: 24, rotate: -0.4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -20, rotate: 0.4 }}
              transition={{ duration: 0.32 }}
              className="glass-strong overflow-hidden rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">offer #{i + 1}</span>
                {round.hard && <span className="chip !border-amber-400/30 !text-amber-300">⚠ حالة صعبة</span>}
              </div>

              <p className="px-5 py-6 text-[14.5px] leading-[2] text-slate-200">{round.text}</p>

              {choice === null ? (
                <div className="grid grid-cols-2 gap-2 border-t border-white/[0.08] p-4">
                  <button
                    onClick={() => answer(true)}
                    className="group rounded-xl border border-red-400/30 bg-red-500/[0.07] py-4 transition hover:border-red-400/60 hover:bg-red-500/15"
                  >
                    <div className="text-xl">🚩</div>
                    <div className="mt-1 text-[13px] font-semibold text-red-200">نصب</div>
                  </button>
                  <button
                    onClick={() => answer(false)}
                    className="group rounded-xl border border-lime/30 bg-lime/[0.06] py-4 transition hover:border-lime/60 hover:bg-lime/15"
                  >
                    <div className="text-xl">✅</div>
                    <div className="mt-1 text-[13px] font-semibold text-lime">عمل حقيقي</div>
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-t border-white/[0.08]">
                  <div className={`px-5 py-3 ${isCorrect ? 'bg-lime/[0.07]' : 'bg-red-500/[0.07]'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{isCorrect ? '✓' : '✕'}</span>
                      <span className={`text-[12.5px] font-bold ${isCorrect ? 'text-lime' : 'text-red-300'}`}>
                        {isCorrect ? 'قرار صحيح' : `خطأ — الإجابة: ${round.scam ? 'نصب' : 'عمل حقيقي'}`}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
                      <div className="mono mb-1 text-[9px] uppercase tracking-[0.18em] text-slate-600">the tell</div>
                      <p className="text-[12px] leading-relaxed text-slate-300">{round.tell}</p>
                    </div>
                    <div className="rounded-lg border border-cyan/20 bg-cyan/[0.05] p-3">
                      <div className="mono mb-1 text-[9px] uppercase tracking-[0.18em] text-cyan">rule to remember</div>
                      <p className="text-[12px] leading-relaxed text-slate-200">{round.lesson}</p>
                    </div>
                    <button onClick={next} className="btn btn-primary w-full py-2.5 text-[12.5px]">
                      {i === ROUNDS.length - 1 ? 'اعرض النتيجة' : 'البطاقة التالية →'}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mono mt-4 text-center text-[9.5px] text-slate-600">
          // البطاقات مستوحاة من عروض حقيقية متداولة، ومُعاد صياغتها للتعليم.
        </p>
      </div>
    </section>
  );
}
