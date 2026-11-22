import { motion } from 'framer-motion';
import { useStore } from '../lib/store.jsx';
import { simulate } from '../lib/simulator.js';
import { PHASES } from '../data/roadmap.js';
import { COMPASS_PATHS, guessPath } from '../lib/plan.js';
import { fmt } from './ui.jsx';

function Bar({ label, value, max, color = '#ff6b1a' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[10px] text-slate-500">{label}</span>
        <span className="mono text-[10px] font-bold text-slate-300">{Math.round(pct)}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function CommandDeck() {
  const s = useStore();
  const sim = simulate(s.trackId, s.hours);
  const totalTasks = PHASES.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks = Object.values(s.tasks || {}).filter(Boolean).length;
  const streakDays = Object.values(s.streak || {}).filter(Boolean).length;
  const path = Object.keys(s.compass || {}).length >= 4 ? COMPASS_PATHS[guessPath(s.compass)] : null;

  const rows = [
    {
      k: 'COMPASS',
      v: path ? `${path.emoji} ${path.ar}` : 'لم تُحدَّد',
      tone: path ? 'text-lime' : 'text-slate-500',
    },
    { k: 'TRACK', v: sim.track.ar, tone: 'text-white' },
    { k: 'HOURS/WK', v: `${s.hours}h`, tone: 'text-cyan' },
    { k: 'MONTH 24', v: `$${fmt(sim.month24)}/mo`, tone: 'text-amber-300' },
    { k: '2-YEAR NET', v: `$${fmt(sim.total2y)}`, tone: 'text-white' },
    { k: 'FIRST REAL $', v: sim.breakevenMonth ? `month ${sim.breakevenMonth}` : '—', tone: 'text-slate-300' },
  ];

  return (
    <div className="glass-strong relative overflow-hidden rounded-[1.6rem] ring-glow">
      <div className="scan-line" />
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
          </span>
          <span className="mono text-[10px] uppercase tracking-[0.22em] text-slate-400">live sitrep</span>
        </div>
        <span className="mono text-[9.5px] uppercase tracking-[0.18em] text-slate-600">adha · state</span>
      </div>

      <div className="divide-y divide-white/[0.05]">
        {rows.map((r, i) => (
          <motion.div
            key={r.k}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
            className="flex items-center justify-between px-4 py-2"
          >
            <span className="mono text-[9.5px] uppercase tracking-[0.18em] text-slate-600">{r.k}</span>
            <span className={`mono truncate ps-3 text-[11.5px] font-bold ${r.tone}`} dir="auto">
              {r.v}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="space-y-2.5 border-t border-white/[0.08] px-4 py-3.5">
        <Bar label="تقدّم خريطة 90 يوماً" value={doneTasks} max={totalTasks} color="#22d3ee" />
        <Bar label="أيام الالتزام المسجّلة" value={streakDays} max={30} color="#a3e635" />
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-white/[0.08] bg-white/5">
        <a href="#tracker" className="bg-panel/70 px-3 py-2.5 text-center transition hover:bg-white/[0.06]">
          <div className="text-[10px] text-slate-500">سجّل يومك</div>
          <div className="font-display mt-0.5 text-[12px] font-semibold text-white">متتبّع 30 يوماً →</div>
        </a>
        <a href="#plan" className="bg-panel/70 px-3 py-2.5 text-center transition hover:bg-white/[0.06]">
          <div className="text-[10px] text-slate-500">خطتك كاملة</div>
          <div className="font-display mt-0.5 text-[12px] font-semibold text-white">نزّل الخطة ↓</div>
        </a>
      </div>
    </div>
  );
}
