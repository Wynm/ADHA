import { Reveal } from './ui.jsx';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-ink/80">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-panel">
                  <svg viewBox="0 0 64 64" className="h-5 w-5">
                    <defs>
                      <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ff6b1a" />
                        <stop offset="1" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                    <path d="M14 48 L32 14 L50 48 Z" fill="none" stroke="url(#fg)" strokeWidth="5" strokeLinejoin="round" />
                    <path d="M23 38 H41" stroke="url(#fg)" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <div className="font-display text-base font-bold text-white">ADHA</div>
                  <div className="mono text-[9px] uppercase tracking-[0.24em] text-slate-600">arena of real ops</div>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-[12.5px] leading-relaxed text-slate-500">
                مشروع مفتوح المصدر يبني ثقافة قرار مالي واعٍ بالعربية. لا يبيع أحلاماً، ولا يبيع بيانات. كل الأرقام
                قابلة للفحص في الكود.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="https://github.com/Wynm/ADHA"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-ghost px-4 py-2 text-[11.5px]"
                >
                  ★ GitHub
                </a>
                <a href="#top" className="btn btn-ghost px-4 py-2 text-[11.5px]">
                  ↑ إلى الأعلى
                </a>
              </div>
            </div>

            <div>
              <div className="mono mb-3 text-[9.5px] uppercase tracking-[0.2em] text-slate-600">sections</div>
              <ul className="space-y-1.5 text-[12.5px] text-slate-400">
                {[
                  ['#arena', 'الساحة · 8 مسارات'],
                  ['#simulator', 'المحاكي · 24 شهراً'],
                  ['#shield', 'الماسح · 10 قواعد'],
                  ['#compass', 'البوصلة · 4 أسئلة'],
                  ['#calc', 'الحساب العكسي'],
                  ['#roadmap', 'خريطة 90 يوماً'],
                  ['#tracker', 'متتبّع 30 يوماً'],
                  ['#plan', 'تصدير الخطة'],
                  ['#fuel', 'الوقود مقابل الأصل'],
                  ['#manifesto', 'البيان'],
                ].map(([h, t]) => (
                  <li key={h}>
                    <a href={h} className="transition hover:text-white">
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mono mb-3 text-[9.5px] uppercase tracking-[0.2em] text-slate-600">disclaimer</div>
              <div className="space-y-2 text-[11.5px] leading-relaxed text-slate-500">
                <p>
                  ADHA أداة تعليمية وتنظيمية. لا يقدّم نصيحة استثمارية أو قانونية أو ضريبية، ولا يضمن أي دخل. كل الأرقام
                  المحسوبة هي نماذج رياضية معلنة، لا توقّعات.
                </p>
                <p>
                  النماذج تفترض جدية والتزاماً مستمرين. الواقع يحتوي انقطاعات وإخفاقات — وهذا جزء من التعليم لا استثناء
                  منه.
                </p>
                <p className="text-slate-600">
                  بُني بعناية، بالعربية أولاً، لهذا الجيل الذي يستحق معلومة أفضل من التي تُبَاع له.
                </p>
              </div>
            </div>
          </div>

          <div className="hairline my-8" />

          <div className="flex flex-col items-center justify-between gap-3 text-[11px] text-slate-600 sm:flex-row">
            <span className="mono">ADHA v1.0 · {new Date().getFullYear()} · MIT</span>
            <span>صُنع ليُقرأ مرتين: مرة الآن، ومرة بعد 90 يوماً.</span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
