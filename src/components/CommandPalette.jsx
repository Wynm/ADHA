import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ITEMS = [
  { id: 'top', ar: 'البداية', hint: 'Hero', keys: 'رئيسية بداية top' },
  { id: 'arena', ar: 'الساحة · 8 مسارات', hint: 'Arena', keys: 'فرص مسارات arena' },
  { id: 'simulator', ar: 'المحاكي · 24 شهراً', hint: 'Simulator', keys: 'محاكي دخل حساب simulator' },
  { id: 'shield', ar: 'الماسح · فحص عرض', hint: 'Shield', keys: 'احتيال نصب فحص shield' },
  { id: 'scamlab', ar: 'مختبر الاحتيال', hint: 'Scam Lab', keys: 'مختبر تجربة lab' },
  { id: 'game', ar: 'لعبة نصب أم عمل', hint: 'Game', keys: 'لعبة اختبار game' },
  { id: 'compass', ar: 'البوصلة · 4 أسئلة', hint: 'Compass', keys: 'بوصلة اختبار compass' },
  { id: 'premortem', ar: 'تشريح الفشل', hint: 'Pre-Mortem', keys: 'فشل خطر premortem' },
  { id: 'calc', ar: 'الحساب العكسي', hint: 'Calc', keys: 'حاسبة هدف وحدات calc' },
  { id: 'roadmap', ar: 'خريطة 90 يوماً', hint: 'Roadmap', keys: 'خطة مهام roadmap' },
  { id: 'tracker', ar: 'المتتبّع · 30 يوماً', hint: 'Tracker', keys: 'التزام سلسلة tracker' },
  { id: 'cases', ar: 'ملفات الحالات', hint: 'Cases', keys: 'حالات أمثلة cases' },
  { id: 'scripts', ar: 'بنك النصوص', hint: 'Scripts', keys: 'رسائل بريد نصوص scripts' },
  { id: 'lexicon', ar: 'المعجم · المصطلحات', hint: 'Lexicon', keys: 'مصطلحات معجم lexicon' },
  { id: 'share', ar: 'بطاقة المشاركة', hint: 'Share', keys: 'صورة مشاركة بطاقة share' },
  { id: 'plan', ar: 'تصدير الخطة', hint: 'Plan', keys: 'تحميل تصدير خطة plan' },
  { id: 'fuel', ar: 'الوقود مقابل الأصل', hint: 'Fuel', keys: 'وقود أصل fuel' },
  { id: 'manifesto', ar: 'البيان', hint: 'Manifesto', keys: 'بيان manifesto' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      setQ('');
      setIdx(0);
      inputRef.current?.focus();
    }, 40);
    return () => clearTimeout(t);
  }, [open]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return ITEMS;
    return ITEMS.filter(
      (i) => i.ar.includes(q.trim()) || i.keys.toLowerCase().includes(needle) || i.hint.toLowerCase().includes(needle)
    );
  }, [q]);

  const go = (item) => {
    setOpen(false);
    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx((i) => Math.min(results.length - 1, i + 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    }
    if (e.key === 'Enter' && results[idx]) go(results[idx]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mono fixed bottom-5 end-5 z-40 hidden items-center gap-2 rounded-full border border-white/15 bg-panel/90 px-3.5 py-2 text-[10.5px] text-slate-400 shadow-2xl backdrop-blur-xl transition hover:border-ember/40 hover:text-white sm:flex"
        aria-label="فتح لوحة الأوامر"
      >
        <span className="text-ember">⌘</span>K<span className="text-slate-600">·</span>لوحة الأوامر
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-lg overflow-hidden rounded-2xl"
            >
              <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3">
                <span className="text-slate-500">⌕</span>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setIdx(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="انتقل إلى أي قسم…"
                  className="flex-1 bg-transparent text-[13px] text-slate-200 outline-none placeholder:text-slate-600"
                />
                <kbd className="mono rounded border border-white/10 px-1.5 py-0.5 text-[9px] text-slate-500">esc</kbd>
              </div>
              <div className="max-h-[340px] overflow-y-auto p-1.5">
                {results.map((item, i) => (
                  <button
                    key={item.id}
                    onMouseEnter={() => setIdx(i)}
                    onClick={() => go(item)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-start transition ${
                      i === idx ? 'bg-ember/15 text-white' : 'text-slate-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-[12.5px]">{item.ar}</span>
                    <span className="mono text-[9px] uppercase tracking-wider text-slate-600">{item.hint}</span>
                  </button>
                ))}
                {results.length === 0 && (
                  <div className="px-3 py-6 text-center text-[12px] text-slate-600">لا نتائج</div>
                )}
              </div>
              <div className="mono flex items-center gap-3 border-t border-white/[0.08] px-4 py-2 text-[9px] text-slate-600">
                <span>↑↓ تنقّل</span>
                <span>↵ انتقال</span>
                <span className="ms-auto">{results.length} sections</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
