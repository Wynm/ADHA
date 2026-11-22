// ══════════════════════════════════════════════════════════════
//  ADHA · بطاقة القرار — تجميع كل الوحدات في ستة أبعاد
//  لا شيء مخفي: كل بُعد له مصدر واحد معروف داخل التطبيق.
// ══════════════════════════════════════════════════════════════

import { PHASES } from '../data/roadmap.js';
import { ASSETS, scoreAssets } from './assets.js';
import { evaluate } from './premortem.js';

export const DIMENSIONS = [
  {
    id: 'clarity',
    ar: 'وضوح الاتجاه',
    short: 'اتجاه',
    icon: '🧭',
    source: 'البوصلة',
    desc: 'هل تعرف مسارك، أم ما زلت تقرأ عن كل المسارات؟',
  },
  {
    id: 'awareness',
    ar: 'وعي المخاطر',
    short: 'وعي',
    icon: '🛡️',
    source: 'تشريح الفشل',
    desc: 'هل تعرف أين يمكن أن تنكسر خطتك قبل أن تنكسر؟',
  },
  {
    id: 'assets',
    ar: 'رصيد الأصول',
    short: 'أصول',
    icon: '🗄️',
    source: 'خزانة الأصول',
    desc: 'ما تملكه فعلاً اليوم: مهارة، دليل، عرض، عميل.',
  },
  {
    id: 'plan',
    ar: 'وضوح الخطة',
    short: 'خطة',
    icon: '🗺️',
    source: 'الحساب العكسي',
    desc: 'هل تعرف عدد الوحدات والساعات التي تفصلك عن هدفك؟',
  },
  {
    id: 'execution',
    ar: 'التنفيذ',
    short: 'تنفيذ',
    icon: '⚙️',
    source: 'الخريطة والمسار',
    desc: 'المهام المنجزة والأسابيع المكتملة — لا النيات.',
  },
  {
    id: 'consistency',
    ar: 'الاستمرارية',
    short: 'استمرار',
    icon: '🔥',
    source: 'المتتبّع والمراجعة',
    desc: 'أيام الالتزام والمراجعات الأسبوعية: أقوى مؤشر على عدم التوقف.',
  },
];

export const INDEX_LEVELS = [
  {
    max: 20,
    key: 'start',
    ar: 'قبل البداية',
    color: '#64748b',
    read: 'لم تدخل الساحة بعد. هذا ليس عيباً — لكن كل يوم بلا خطوة هو يوم يُعاد فيه نفس القرار.',
    action: 'اختر أي قسم واحد فقط: «تشريح الفشل». عشر دقائق، ولن تكون في نفس المكان.',
  },
  {
    max: 40,
    key: 'exploring',
    ar: 'تستكشف',
    color: '#f97316',
    read: 'لديك نية واضحة وأدوات مفتوحة، لكن لا يوجد شيء مُنفَّذ بعد. خطر هذه المرحلة: قراءة أكثر وتنفيذ أقل.',
    action: 'أغلق المتصفح بعد هذه الجلسة وابدأ عملاً واحداً مدته 30 دقيقة.',
  },
  {
    max: 60,
    key: 'building',
    ar: 'تبني',
    color: '#eab308',
    read: 'أنت في المنتصف — وهو أصعب مكان نفسياً: بداية الالتزام ظهرت، والنتائج لم تظهر بعد.',
    action: 'لا تفتح مساراً جديداً. أكمل أسبوعاً واحداً من مسار التعلّم، وعلّم يومين في المتتبّع.',
  },
  {
    max: 80,
    key: 'shipping',
    ar: 'تنفّذ',
    color: '#84cc16',
    read: 'الخطة واضحة والأصول تتراكم. الخطر الوحيد الآن هو التشتت أو رفع السقف قبل استحقاقه.',
    action: 'حوّل ما أنجزته إلى دليل مرئي وأرسله لثلاثة أشخاص محددين هذا الأسبوع.',
  },
  {
    max: 100,
    key: 'compounding',
    ar: 'تتراكم',
    color: '#22c55e',
    read: 'أنت في المنطقة التي يصلها القليل: أصول + خطة + التزام. الآن القرار الحقيقي هو السعر، لا البداية.',
    action: 'ارفع سعرك 25% للعميل التالي، ووثّق كل مشروع في قالب قابل للتكرار.',
  },
];

/**
 * @param {{compass:object, tasks:object, streak:object, hours:number, goal:number,
 *          premortem:object, assets:object, reviews:array, curriculum:object}} input
 */
export function computeIndex(input) {
  const { compass = {}, tasks = {}, streak = {}, hours = 0, goal = 0, premortem = {}, assets = {}, reviews = [], curriculum = {} } = input;

  const compassAnswered = Object.keys(compass).length;
  const pm = evaluate(premortem);
  const vault = scoreAssets(assets);

  const roadmapTotal = PHASES.reduce((s, p) => s + p.tasks.length, 0);
  const roadmapDone = Object.values(tasks || {}).filter(Boolean).length;

  const weeksDone = Object.entries(curriculum || {}).filter(([, v]) => Array.isArray(v) && v.length === 3).length;
  const streakDays = Object.values(streak || {}).filter(Boolean).length;
  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;

  const scores = {
    clarity: Math.round((compassAnswered / 4) * 100),
    awareness: pm.complete ? pm.pct : 0,
    assets: vault.pct,
    plan:
      Math.round(
        (Number(hours > 0) * 0.4 + Number(goal > 0) * 0.3 + Number(compassAnswered >= 4) * 0.3) * 100
      ) || 0,
    execution: Math.round(
      Math.min(1, (roadmapDone / roadmapTotal) * 0.6 + (weeksDone / 8) * 0.3 + Number(reviewCount > 0) * 0.1) * 100
    ),
    consistency: Math.round(Math.min(1, (streakDays / 30) * 0.7 + (Math.min(reviewCount, 12) / 12) * 0.3) * 100),
  };

  const weights = { clarity: 18, awareness: 16, assets: 22, plan: 14, execution: 20, consistency: 10 };
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const index = Math.round(
    DIMENSIONS.reduce((sum, d) => sum + scores[d.id] * weights[d.id], 0) / total
  );

  const level = INDEX_LEVELS.find((l) => index <= l.max) || INDEX_LEVELS.at(-1);

  // ثلاث خطوات تالية، مُرتّبة حسب الثغرة الأكبر
  const actions = [];
  if (!pm.complete) actions.push({ ar: 'أكمل «تشريح الفشل» (5 عوامل، دقيقتان)', href: '#premortem', why: 'لأن احتمال توقفك غير المقاس هو أكبر خطر' });
  if (compassAnswered < 4) actions.push({ ar: 'أجب على أسئلة البوصلة الأربعة', href: '#compass', why: 'مسار واحد أفضل من عشرة مفتوحة' });
  if (vault.top) actions.push({ ar: `أغلق ثغرة: ${vault.top.ar}`, href: '#vault', why: vault.top.next });
  if (weeksDone === 0) actions.push({ ar: 'ابدأ الأسبوع الأول من مسار التعلّم', href: '#curriculum', why: '112 ساعة تفصلك عن مهارة تُدفع' });
  if (reviewCount === 0) actions.push({ ar: 'اكتب أول مراجعة أسبوعية', href: '#review', why: 'المراجعة تمنع التوقف الصامت' });
  if (streakDays === 0) actions.push({ ar: 'سجّل أول يوم التزام حقيقي', href: '#tracker', why: 'السلسلة أرخص مؤشر على الاستمرار' });
  if (roadmapDone === 0) actions.push({ ar: 'اختر مهمة واحدة من خريطة 90 يوماً', href: '#roadmap', why: 'خطة بلا مهمة منفّذة = صفر' });

  return {
    index,
    level,
    scores,
    dimensions: DIMENSIONS.map((d) => ({ ...d, value: scores[d.id] })),
    actions: actions.slice(0, 3),
    raw: { compassAnswered, pm, vault, roadmapDone, roadmapTotal, weeksDone, streakDays, reviewCount },
  };
}

export { ASSETS };
