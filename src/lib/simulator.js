// ══════════════════════════════════════════════════════════════
//  ADHA · محاكي الدخل الواقعي — الإصدار 2
//  كل المعاملات معلنة وقابلة للتعديل. لا رقم سحري واحد.
//  المبدأ: منحنيات لوجستية ومتذبذبة، لا أسّية وردية.
// ══════════════════════════════════════════════════════════════

export const TRACKS = [
  {
    id: 'freelance',
    ar: 'عمل حرّ (Freelance)',
    en: 'Freelance',
    emoji: '🎯',
    blurb: 'تبيع ساعاتك ومهارتك. أسرع طريق لأول دولار، وأبطأ طريق لبناء أصل.',
    model: 'linear',
    base: {
      priceStart: 5,
      priceEnd: 34,
      rampMonths: 20,
      hoursPerWeek: 22,
      utilizationStart: 0.28,
      utilizationEnd: 0.72,
      rampUtil: 10,
      learningHours: 12,
    },
    fees: 0.06,
    risk: 'منخفضة',
    ceiling: 'محدود بعدد ساعاتك — السقف الحقيقي هو 168 ساعة/أسبوع، وهو غير بشري.',
    notes: ['أول 6 أشهر: منافسة على السعر.', 'بعد 12 شهراً: منافسة على السمعة والتخصص.'],
  },
  {
    id: 'saas',
    ar: 'Micro-SaaS',
    en: 'Micro-SaaS',
    emoji: '🧱',
    blurb: 'تبني أصل برمجي صغير يدفع لك شهرياً. طويل، لكنه يتراكم عندما تنام.',
    model: 'saas',
    base: {
      mrrCap: 2900,
      curvature: 0.105,
      shapeExp: 1.15,
      buildMonths: 3,
      supportHoursPerMonth: 8,
      supportCostPerHour: 16,
    },
    fees: 0.05,
    risk: 'متوسطة',
    ceiling: 'سقف عملي منخفض في البداية، لكنه يتضاعف مع الاستمرار.',
    notes: ['أول 3 أشهر: بناء بلا دخل.', 'معامل النمو محافظ: 19% شهرياً في البداية ثم يتباطأ.'],
  },
  {
    id: 'content',
    ar: 'محتوى / تعليم',
    en: 'Content & Teaching',
    emoji: '🎙️',
    blurb: 'تحوّل ما تعرفه إلى محتوى ومنتج تعليمي. يعمل أفضل بمهارة سرد قوية.',
    model: 'content',
    base: {
      startViews: 400,
      growth: 0.155,
      viewCap: 160000,
      rpm: 1.9,
      viewToBuyer: 0.0009,
      arpu: 22,
    },
    fees: 0.12,
    risk: 'متوسطة',
    ceiling: 'منخفض في البداية، ومتذبذب. يعتمد على الثبات وليس على الحظ.',
    notes: ['النموذج يفترض منحنى لوجستي — واقعياً يوجد انقطاعات.', 'أول 90 يوماً: بناء مكتبة محتوى بصفر دخل.'],
  },
  {
    id: 'product',
    ar: 'منتج رقمي (قالب/درس)',
    en: 'Digital Product',
    emoji: '💾',
    blurb: 'تصنع مرة واحدة وتبيع مراراً. أفضل نسبة جهد/عائد عند جمهور موجود مسبقاً.',
    model: 'product',
    base: {
      price: 26,
      launchUnits: 30,
      monthlyUnits: 26,
      decay: 0.045,
      unitGrowth: 0.02,
      releaseEvery: 4,
      releaseBoost: 0.4,
    },
    fees: 0.1,
    risk: 'منخفضة',
    ceiling: 'يحتاج توزيعاً حقيقياً؛ بدون جمهور سيكون منتجاً نائماً.',
    notes: ['الإطلاق الأول يحمل أكبر نصيب من الدخل في النموذج.', 'إن لم يكن لديك جمهور، اقرأ مسار المحتوى أولاً.'],
  },
];

export const HOURS_PRESETS = [
  { id: 'light', ar: 'خفيف · 8 ساعات', hours: 8 },
  { id: 'steady', ar: 'منتظم · 15 ساعة', hours: 15 },
  { id: 'serious', ar: 'جاد · 25 ساعة', hours: 25 },
  { id: 'full', ar: 'كامل · 40 ساعة', hours: 40 },
];

const WEEKS_PER_MONTH = 4.345;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const logistic = (t, k, mid) => 1 / (1 + Math.exp(-k * (t - mid)));

/**
 * يحاكي 24 شهراً لمسار معيّن بعدد ساعات أسبوعية.
 * returns { track, hoursPerWeek, months[], total2y, month24, breakevenMonth, effectiveHourly, peakMonth }
 */
export function simulate(trackId, hoursPerWeek) {
  const track = TRACKS.find((t) => t.id === trackId) || TRACKS[0];
  const scale = hoursPerWeek / 22;
  const b = track.base;
  const months = [];
  let cumulative = 0;

  for (let m = 1; m <= 24; m++) {
    let gross = 0;

    if (track.model === 'linear') {
      // السعر والاستخدام يرتفعان مع السمعة، ثم يستقران
      const ramp = clamp(m / b.rampMonths, 0, 1);
      const price = b.priceStart + (b.priceEnd - b.priceStart) * Math.pow(ramp, 0.75);
      const util = b.utilizationStart + (b.utilizationEnd - b.utilizationStart) * logistic(m, 0.35, b.rampUtil * 0.5);
      const hours = b.hoursPerWeek * scale * util;
      gross = price * hours * WEEKS_PER_MONTH;
    }

    if (track.model === 'saas') {
      // بناء أولاً، ثم منحنى إشباع (1 − e^−kt) مع تكلفة دعم متزايدة
      if (m > b.buildMonths) {
        const t = m - b.buildMonths;
        const mrr = b.mrrCap * scale * Math.pow(1 - Math.exp(-b.curvature * t), b.shapeExp);
        const support = b.supportHoursPerMonth * scale * b.supportCostPerHour * (0.4 + 0.05 * t);
        gross = Math.max(0, mrr - support);
      }
    }

    if (track.model === 'content') {
      // جمهور لوجستي + تحويل إلى مشترين + عائد إعلاني
      const views = b.viewCap / (1 + ((b.viewCap - b.startViews) / b.startViews) * Math.exp(-b.growth * (m - 1)));
      const buyers = views * b.viewToBuyer * scale;
      const ads = (views / 1000) * b.rpm * scale * 0.35;
      gross = buyers * b.arpu + ads;
    }

    if (track.model === 'product') {
      const baseStream =
        b.monthlyUnits *
        Math.pow(1 - b.decay + b.unitGrowth, Math.max(0, m - 1)) *
        b.price *
        scale *
        0.55;
      const launch = m === 2 ? b.launchUnits * b.price * scale : 0;
      const relaunch =
        m > 2 && (m - 2) % b.releaseEvery === 0 ? b.launchUnits * b.releaseBoost * b.price * scale : 0;
      gross = baseStream + launch + relaunch;
    }

    const net = gross * (1 - track.fees);
    cumulative += net;
    months.push({ m, gross: Math.round(gross), net: Math.round(net), cumulative: Math.round(cumulative) });
  }

  const firstPositive = months.find((x) => x.net >= 150);
  const total2y = months.at(-1).cumulative;
  const totalHours = hoursPerWeek * WEEKS_PER_MONTH * 24;
  const effectiveHourly = total2y / totalHours;
  const peakMonth = months.reduce((p, c) => (c.net > p.net ? c : p), months[0]);

  return {
    track,
    hoursPerWeek,
    months,
    total2y,
    month24: months.at(-1).net,
    breakevenMonth: firstPositive ? firstPositive.m : null,
    effectiveHourly: Math.round(effectiveHourly * 10) / 10,
    peakMonth,
    totalHours: Math.round(totalHours),
  };
}

/** مقارنة كل المسارات بنفس عدد الساعات */
export function compareAll(hoursPerWeek) {
  return TRACKS.map((t) => {
    const r = simulate(t.id, hoursPerWeek);
    return {
      id: t.id,
      ar: t.ar,
      emoji: t.emoji,
      month24: r.month24,
      total2y: r.total2y,
      breakevenMonth: r.breakevenMonth,
      effectiveHourly: r.effectiveHourly,
    };
  }).sort((a, b) => b.total2y - a.total2y);
}

/** «الوعد الوهمي» — المنحنى الأسّي الذي يُبَاع للناس، للمقارنة البصرية */
export function hypeCurve(hoursPerWeek) {
  const start = 40 * (hoursPerWeek / 22);
  return Array.from({ length: 24 }, (_, i) => {
    const t = i + 1;
    // نمو 45% شهرياً «كما يقولون» — رياضيًا يعني 8800 ضعف في سنتين
    return { m: t, hype: Math.round(start * Math.pow(1.45, t - 1)) };
  });
}
