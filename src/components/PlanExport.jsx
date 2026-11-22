import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store.jsx';
import { buildPlan, downloadPlan } from '../lib/plan.js';
import { Reveal, SectionHeading } from './ui.jsx';

export default function PlanExport() {
  const s = useStore();
  const [copied, setCopied] = useState(false);
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
