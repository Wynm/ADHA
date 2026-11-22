// ═══════════════════════════════════════════════════════════════
//  ADHA · أين تبيع؟ — رسوم المنصات محسوبة على المال الفعلي
//  الأرقام تقديرية ومبنية على الهياكل المعلنة (2024–2025).
//  الرسوم تتغيّر: تحقق قبل الاعتماد. الهدف تعليمي.
// ═══════════════════════════════════════════════════════════════

export const PLATFORMS = [
  {
    id: 'direct',
    ar: 'عميل مباشر',
    emoji: '🤝',
    fee: 0,
    fixed: 0,
    payoutFee: 0,
    timeToFirst: 'أسابيع–أشهر',
    protection: 'منخفضة (أنت تحمل المخاطرة)',
    note: 'أعلى صافي ربح، وأصعب بداية: لا منصة تجلب لك العميل ولا تحمي الدفع.',
    bestFor: 'من لديه شبكة أو محفظة أعمال.',
    feeNote: '0% — لكنك تدفع مقابل ذلك: بحث، تفاوض، وتحصيل.',
  },
  {
    id: 'upwork',
    ar: 'Upwork',
    emoji: '🌍',
    fee: 0.1,
    fixed: 0,
    payoutFee: 0.01,
    timeToFirst: '1–4 أسابيع',
    protection: 'عالية (escrow)',
    note: 'الرسوم 10% (هيكل مبسّط)، ومنافسة عالمية على أول مشروع. الإنجليزي شرط شبه أساسي.',
    bestFor: 'تخصص واضح + محفظة إنجليزية.',
    feeNote: '10% من العقد + رسوم تحويل ~1%.',
  },
  {
    id: 'fiverr',
    ar: 'Fiverr',
    emoji: '🟩',
    fee: 0.2,
    fixed: 0,
    payoutFee: 0.029,
    timeToFirst: '1–8 أسابيع',
    protection: 'عالية (escrow)',
    note: '20% من كل طلب + رسوم سحب. تعمل إذا بنيت «باقة» واضحة، وتفشل إذا انتظرت الطلبات.',
    bestFor: 'خدمات معلّبة ونطاق صغير.',
    feeNote: '20% + ~2.9% سحب.',
  },
  {
    id: 'khamsat',
    ar: 'خمسات',
    emoji: '🟨',
    fee: 0.2,
    fixed: 0,
    payoutFee: 0,
    timeToFirst: '1–3 أسابيع',
    protection: 'متوسطة',
    note: 'منصة عربية بجمهور محلي، أسعار أقل لكن الحاجز اللغوي منخفض. 20% رسوم.',
    bestFor: 'أول تجربة بيع، بالعربية.',
    feeNote: '20% من كل خدمة.',
  },
  {
    id: 'mostaql',
    ar: 'مستقل',
    emoji: '🟦',
    fee: 0.1,
    fixed: 0,
    payoutFee: 0.02,
    timeToFirst: '2–5 أسابيع',
    protection: 'متوسطة',
    note: 'مشاريع بعقود واضحة، 10% رسوم. المشاريع أكبر من خمسات لكن المنافسة أشد على السعر.',
    bestFor: 'مطورون ومصممون بالعربية.',
    feeNote: '10% + رسوم سحب ~2%.',
  },
  {
    id: 'gumroad',
    ar: 'Gumroad',
    emoji: '🍬',
    fee: 0.1,
    fixed: 0,
    payoutFee: 0,
    timeToFirst: 'أيام (إن كان لديك جمهور)',
    protection: 'منخفضة (بيع مباشر)',
    note: '10% + رسوم دفع. لا يجلب عملاء — يحتاج جمهوراً موجوداً أو توزيعاً خارجياً.',
    bestFor: 'منتجات رقمية لجمهور موجود.',
    feeNote: '10% + رسوم بوابة الدفع.',
  },
];

/**
 * صافي ما يصل إليك من مشروع/منتج بسعر معيّن.
 */
export function netFrom(price, platform) {
  const afterFee = price * (1 - platform.fee) - platform.fixed;
  const afterPayout = afterFee * (1 - platform.payoutFee);
  return Math.max(0, afterPayout);
}

/** كم تحتاج أن تبيع بسعر أعلى لتحصل على نفس الصافي الذي يعطيه العميل المباشر */
export function priceNeededFor(desiredNet, platform) {
  let lo = desiredNet;
  let hi = desiredNet * 5;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (netFrom(mid, platform) < desiredNet) lo = mid;
    else hi = mid;
  }
  return Math.round(hi);
}

export const PLATFORM_LESSONS = [
  {
    ar: 'الرسوم ليست عيباً',
    d: '20% على عميل جاء من منصة أفضل من 0% على عميل لم يأتِ أبداً. السؤال ليس «كم تأخذ المنصة؟» بل «كم عميلاً تجلب؟».',
  },
  {
    ar: 'ابنِ قناة تملكها',
    d: 'المنصة قناة مستأجرة. النشرة البريدية ومحفظة الأعمال قناة مملوكة. اجمع الأولى ببطء، ولا تتخلَّ عن الثانية.',
  },
  {
    ar: 'السعر يُعدّل للرسوم',
    d: 'إذا أردت 100$ صافية على منصة بـ20%، فالسعر 125$ لا 100$. الرفض في التفاوض على ذلك يكلّفك ربع دخلك.',
  },
];
