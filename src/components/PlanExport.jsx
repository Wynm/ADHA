import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store.jsx';
import { buildPlan, downloadPlan } from '../lib/plan.js';
import { usePersistentState } from '../lib/hooks.js';
import { Reveal, SectionHeading } from './ui.jsx';

export default function PlanExport() {
  const s = useStore();
  const [copied, setCopied] = useState(false);
  const [backupMsg, setBackupMsg] = useState('');
  const [premortem] = usePersistentState('adha.premortem', {});
  const [assets] = usePersistentState('adha.assets', {});
  const [reviews] = usePersistentState('adha.reviews', []);
  const [curriculum] = usePersistentState('adha.curriculum', {});
  const [game] = usePersistentState('adha.game', { best: 0, plays: 0 });
  const [name] = usePersistentState('adha.name', '');

  const snapshot = useMemo(
    () => ({ ...s, premortem, assets, reviews, curriculum, game, name, exportedAt: new Date().toISOString() }),
    [s, premortem, assets, reviews, curriculum, game, name]
  );

  const md = useMemo(() => buildPlan(s), [s]);
  const preview = md.split('\n').slice(0, 26).join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="plan" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            tag="Export · الخطة"
            title={
              <>
                خطتك ليست في هذا الموقع. <span className="ember-text">خطتك ملفٌ تحمله.</span>
              </>
            }
            desc="كل ما اخترته في هذا التطبيق — البوصلة، الهدف المالي، المسار، المهام المنجزة — يُصاغ الآن في وثيقة Markdown واحدة. نزّلها، اطبعها، أو ضعها في مستودعك. الوعد المكتوب على ورقة أقوى من نيّة في رأس."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="glass-strong overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">plan.md · preview</span>
              <span className="mono text-[10px] text-slate-600">{md.length} chars</span>
            </div>
            <pre
              className="mono max-h-[420px] overflow-auto whitespace-pre-wrap px-4 py-4 text-[11px] leading-[1.9] text-slate-400"
              dir="auto"
            >
              {preview}
              <span className="text-slate-700">{'\n…'}</span>
            </pre>
          </div>

          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => downloadPlan(s)}
              className="btn btn-primary w-full py-3.5 text-[13.5px]"
            >
              ↓ نزّل خطتي (Markdown)
            </motion.button>
            <button onClick={copy} className="btn btn-ghost w-full py-3 text-[12.5px]">
              {copied ? '✓ تم النسخ إلى الحافظة' : '⧉ انسخ النص كاملاً'}
            </button>

            <div className="glass rounded-2xl p-4">
              <div className="mono mb-2.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">backup · نسخة احتياطية</div>
              <p className="mb-2.5 text-[11px] leading-relaxed text-slate-500">
                كل بياناتك محفوظة في متصفحك فقط. نزّل نسخة JSON لتستعيدها على جهاز آخر، أو قبل تنظيف المتصفح.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `adha-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setTimeout(() => URL.revokeObjectURL(url), 2000);
                    setBackupMsg('تم تنزيل نسخة احتياطية ✓');
                    setTimeout(() => setBackupMsg(''), 2500);
                  }}
                  className="btn btn-ghost flex-1 py-2 text-[11.5px]"
                >
                  ⤓ تصدير JSON
                </button>
                <label className="btn btn-ghost flex-1 cursor-pointer py-2 text-[11.5px]">
                  ⤒ استيراد
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const data = JSON.parse(await file.text());
                        if (data.premortem) localStorage.setItem('adha.premortem', JSON.stringify(data.premortem));
                        if (data.assets) localStorage.setItem('adha.assets', JSON.stringify(data.assets));
                        if (data.reviews) localStorage.setItem('adha.reviews', JSON.stringify(data.reviews));
                        if (data.curriculum) localStorage.setItem('adha.curriculum', JSON.stringify(data.curriculum));
                        if (data.name) localStorage.setItem('adha.name', JSON.stringify(data.name));
                        setBackupMsg('تم الاستيراد — أعد تحميل الصفحة');
                        setTimeout(() => setBackupMsg(''), 4000);
                      } catch {
                        setBackupMsg('ملف غير صالح');
                        setTimeout(() => setBackupMsg(''), 2500);
                      }
                    }}
                  />
                </label>
              </div>
              {backupMsg && <p className="mono mt-2 text-[10px] text-lime">{backupMsg}</p>}
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="mono mb-2.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">ما تحتويه الوثيقة</div>
              <ul className="space-y-1.5 text-[11.5px] leading-relaxed text-slate-400">
                {[
                  'المسار المقترح من البوصلة',
                  'الهدف الشهري محوّلاً إلى وحدات وساعات/يوم',
                  'نموذج 24 شهراً لأرقامك الحالية',
                  'مهام 90 يوماً بحالتها (منجز/غير منجز)',
                  'قائمة مراجعة قبل أي دفع',
                  'جدول المسارات الثمانية بالمخاطرة والزمن',
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-lime">·</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="mono mb-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-500">privacy</div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                لا يوجد خادم في هذا المشروع. بياناتك تُحفظ في <span className="text-slate-300">localStorage</span> على
                جهازك، والملف يُولَّد داخل متصفحك. لا حساب، لا بريد، لا تتبّع.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
