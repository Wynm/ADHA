import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#journey', ar: 'الرحلة', en: 'Journey' },
  { href: '#arena', ar: 'الساحة', en: 'Arena' },
  { href: '#simulator', ar: 'المحاكي', en: 'Simulator' },
  { href: '#shield', ar: 'الماسح', en: 'Scanner' },
  { href: '#compass', ar: 'البوصلة', en: 'Compass' },
  { href: '#premortem', ar: 'تشريح الفشل', en: 'Pre-Mortem' },
  { href: '#roadmap', ar: 'الخريطة', en: 'Roadmap' },
  { href: '#tracker', ar: 'المتتبّع', en: 'Tracker' },
  { href: '#plan', ar: 'الخطة', en: 'Plan' },
  { href: '#fuel', ar: 'الوقود', en: 'Fuel' },
  { href: '#manifesto', ar: 'البيان', en: 'Manifesto' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled ? 'border-b border-white/10 bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#top" className="group flex items-center gap-2.5" aria-label="ADHA">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-panel">
              <svg viewBox="0 0 64 64" className="h-5 w-5">
                <defs>
                  <linearGradient id="navg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ff6b1a" />
                    <stop offset="1" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <path d="M14 48 L32 14 L50 48 Z" fill="none" stroke="url(#navg)" strokeWidth="5" strokeLinejoin="round" />
                <path d="M23 38 H41" stroke="url(#navg)" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              ADHA
              <span className="ms-2 hidden text-[10px] font-normal uppercase tracking-[0.3em] text-slate-500 sm:inline">
                arena
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[13px] text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                {l.ar}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="#shield" className="btn btn-ghost hidden px-4 py-2 text-[13px] sm:inline-flex">
              افحص عرضاً
            </a>
            <a href="#simulator" className="btn btn-primary px-4 py-2 text-[13px]">
              شغّل المحاكي
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="القائمة"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white lg:hidden"
            >
              <span className="text-lg">{open ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-white/5">
          <div
            className="h-px bg-gradient-to-r from-ember via-amber-300 to-cyan transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {open && (
        <div className="border-b border-white/10 bg-ink/95 px-5 py-3 backdrop-blur-xl lg:hidden">
          <div className="grid grid-cols-2 gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5"
              >
                {l.ar}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
