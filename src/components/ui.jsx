import { motion } from 'framer-motion';
import { useInView } from '../lib/hooks.js';

export function Reveal({ children, delay = 0, y = 26, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionTag({ children, tone = 'ember' }) {
  const tones = {
    ember: 'border-ember/30 text-ember bg-ember/10',
    cyan: 'border-cyan/30 text-cyan bg-cyan/10',
    lime: 'border-lime/30 text-lime bg-lime/10',
  };
  return (
    <span
      className={`mono inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em] ${tones[tone]}`}
    >
      <span className="inline-block h-1 w-1 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function SectionHeading({ tag, title, desc, tone = 'ember', align = 'start' }) {
  return (
    <div className={`flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : 'items-start'}`}>
      {tag && <SectionTag tone={tone}>{tag}</SectionTag>}
      <h2 className="font-display max-w-3xl text-3xl font-bold leading-[1.15] text-white sm:text-4xl md:text-[2.9rem]">
        {title}
      </h2>
      {desc && <p className="max-w-2xl text-[15px] leading-relaxed text-slate-400 md:text-base">{desc}</p>}
    </div>
  );
}

export function fmt(n) {
  if (n === null || n === undefined) return '—';
  return new Intl.NumberFormat('en-US').format(Math.round(n));
}

export function RiskDot({ level }) {
  const map = {
    low: 'bg-emerald-400',
    medium: 'bg-amber-400',
    high: 'bg-red-400',
  };
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${map[level] || 'bg-slate-400'}`} />;
}
