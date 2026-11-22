import { motion } from 'framer-motion';
import { JOURNEY_NOTE, STAGES } from '../data/journey.js';
import { useStore } from '../lib/store.jsx';
import { usePersistentState } from '../lib/hooks.js';
import { evaluate } from '../lib/premortem.js';
import { scoreAssets } from '../lib/assets.js';
import { PHASES } from '../data/roadmap.js';
import { Reveal, SectionTag } from './ui.jsx';

export default function Journey() {
  const s = useStore();
  const [pm] = usePersistentState('adha.premortem', {});
  const [assets] = usePersistentState('adha.assets', {});
  const [cur] = usePersistentState('adha.curriculum', {});

  const compassDone = Object.keys(s.compass || {}).length >= 4;
  const pmScore = evaluate(pm);
  const vault = scoreAssets(assets);
  const roadmapDone = Object.values(s.tasks || {}).filter(Boolean).length;
  const roadmapTotal = PHASES.reduce((a, p) => a + p.tasks.length, 0);
  const curWeeks = Object.entries(cur).filter(([, v]) => Array.isArray(v) && v.length === 3).length;
  const streak = Object.values(s.streak || {}).filter(Boolean).length;

  const progress = {
    'stage-1': (Number(compassDone) + Number(pmScore.complete) + Number(vault.pct > 0)) / 3,
    'stage-2': 0, // لا يمكن قياس «تحصّن» تلقائياً — يبقى صادقاً
    'stage-3': (Number(compassDone) + Number(s.hours > 0)) / 2,
    'stage-4': (roadmapDone / roadmapTotal) * 0.6 + (curWeeks / 8) * 0.25 + (streak / 30) * 0.15,
    'stage-5': Number(Object.keys(s.tasks || {}).length > 0),
  };

  return (
    <section id="journey" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionTag>Journey · الرحلة</SectionTag>
              <h2 className="font-display mt-3 text-2xl font-bold text-white sm:text-3xl">
                عشرون أداة. <span className="text-slate-500">خمس مراحل. طريق واحد.</span>
              </h2>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-500">{JOURNEY_NOTE}</p>
            </div>
            <div className="mono flex shrink-0 items-center gap-3 text-[10px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" /> تقدّمك
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" /> لم يبدأ
              </span>
            </div>
          </div>
        </Reveal>

        <div className="relative mt-8">
          <div className="absolute inset-x-0 top-[26px] hidden h-px bg-gradient-to-r from-cyan/30 via-ember/40 to-purple-400/30 lg:block" />
          <div className="grid gap-3 lg:grid-cols-5">
            {STAGES.map((st, i) => {
              const pct = Math.round((progress[st.id] || 0) * 100);
              return (
                <motion.div
                  key={st.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className="relative"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="relative z-10 grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border-2 bg-ink text-[13px] font-bold"
                      style={{ borderColor: `${st.color}66`, color: st.color }}
                    >
                      {st.n}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-white">{st.ar}</div>
                      <div className="mono text-[9px] uppercase tracking-[0.16em] text-slate-600">{st.en}</div>
                    </div>
                  </div>

                  {st.id !== 'stage-2' ? (
                    <div className="mb-2 flex items-center gap-1.5">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: st.color }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                      <span className="mono w-7 text-end text-[9px] text-slate-600">{pct}%</span>
                    </div>
                  ) : (
                    <div className="mono mb-2 text-[9px] text-slate-600">يُقاس بالقرارات لا بالأرقام</div>
                  )}

                  <p className="mb-3 text-[10.5px] leading-relaxed text-slate-500">{st.why}</p>

                  <div className="space-y-1">
                    {st.items.map((it) => (
                      <a
                        key={it.id}
                        href={`#${it.id}`}
                        className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.012] px-2.5 py-1.5 transition hover:border-white/25 hover:bg-white/[0.04]"
                      >
                        <span className="text-[11px] text-slate-300 group-hover:text-white">{it.ar}</span>
                        <span className="mono ms-2 truncate text-[9px] text-slate-600 group-hover:text-slate-500">
                          {it.note}
                        </span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
