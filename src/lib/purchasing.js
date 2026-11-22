// ═══════════════════════════════════════════════════════════════
//  ADHA · قيمة المال — 1000$ ليست نفسها في كل بلد
//  الأرقام تقديرية (متوسطات إحصائية عامة) للاستخدام التعليمي فقط،
//  والغرض منها تصحيح القرار لا تقديم بيانات اقتصادية دقيقة.
//  المصدر: متوسطات تقريبية منشورة (أجور/كلفة معيشة) — 2024–2025.
// ═══════════════════════════════════════════════════════════════

export const COUNTRIES = [
  { id: 'MA', ar: 'المغرب', flag: '🇲🇦', cur: 'MAD', rate: 10.1, medianWage: 5200, rent1br: 3200 },
  { id: 'DZ', ar: 'الجزائر', flag: '🇩🇿', cur: 'DZD', rate: 133, medianWage: 45000, rent1br: 30000 },
  { id: 'TN', ar: 'تونس', flag: '🇹🇳', cur: 'TND', rate: 3.1, medianWage: 1200, rent1br: 800 },
  { id: 'EG', ar: 'مصر', flag: '🇪🇬', cur: 'EGP', rate: 48.5, medianWage: 9000, rent1br: 6000 },
  { id: 'LY', ar: 'ليبيا', flag: '🇱🇾', cur: 'LYD', rate: 4.85, medianWage: 2500, rent1br: 1200 },
  { id: 'SA', ar: 'السعودية', flag: '🇸🇦', cur: 'SAR', rate: 3.75, medianWage: 6000, rent1br: 2500 },
  { id: 'AE', ar: 'الإمارات', flag: '🇦🇪', cur: 'AED', rate: 3.67, medianWage: 9000, rent1br: 4500 },
  { id: 'QA', ar: 'قطر', flag: '🇶🇦', cur: 'QAR', rate: 3.64, medianWage: 10000, rent1br: 5000 },
  { id: 'KW', ar: 'الكويت', flag: '🇰🇼', cur: 'KWD', rate: 0.31, medianWage: 1200, rent1br: 450 },
  { id: 'JO', ar: 'الأردن', flag: '🇯🇴', cur: 'JOD', rate: 0.71, medianWage: 600, rent1br: 350 },
  { id: 'IQ', ar: 'العراق', flag: '🇮🇶', cur: 'IQD', rate: 1310, medianWage: 900000, rent1br: 500000 },
  { id: 'SD', ar: 'السودان', flag: '🇸🇩', cur: 'SDG', rate: 600, medianWage: 250000, rent1br: 150000 },
];

const USD_REFERENCE = 1000;

/**
 * يحوّل دخلًا بالدولار إلى مقارنة محلية.
 * @returns {{ local:number, multipleOfMedian:number, monthsOfRent:number, pctOfMedian:number, verdict:string, tone:string }}
 */
export function localize(usd, country) {
  const local = usd * country.rate;
  const multipleOfMedian = local / country.medianWage;
  const monthsOfRent = local / country.rent1br;
  const pctOfMedian = multipleOfMedian * 100;

  let verdict;
  let tone;
  if (multipleOfMedian >= 3) {
    verdict = 'دخل أعلى من ثلاثة أضعاف متوسط الأجر — نادر، ويحتاج تخصصاً حقيقياً أو عميلاً أجنبياً مباشراً.';
    tone = 'lime';
  } else if (multipleOfMedian >= 1.5) {
    verdict = 'أعلى من متوسط الأجر بوضوح. هذا هو النطاق الذي يغيّر حياة شخص واحد في معظم دول المنطقة.';
    tone = 'cyan';
  } else if (multipleOfMedian >= 0.8) {
    verdict = 'قريب من متوسط الأجر. مفيد كدخل ثانٍ، لكنه لا يكفي للاستقلال المالي بمفرده.';
    tone = 'amber';
  } else {
    verdict = 'أقل من متوسط الأجر. لا تبنِ عليه قراراً بالاستقالة أو التفرّغ.';
    tone = 'red';
  }
  return { local, multipleOfMedian, monthsOfRent, pctOfMedian, verdict, tone };
}

/** عدد الأشهر اللازمة لتكوين احتياطي (3 أشهر مصاريف) بهذا الدخل */
export function runwayMonths(usd, country, savingsRate = 0.3) {
  const monthlySaving = usd * country.rate * savingsRate;
  const target = country.rent1br * 3 * 1.6; // إيجار + معيشة تقريبية
  return monthlySaving > 0 ? Math.ceil(target / monthlySaving) : Infinity;
}

export const PPP_NOTE =
  'هذه الأرقام تقديرية ومبنية على متوسطات منشورة، وتختلف داخل البلد نفسه بين المدينة والقرية وبين القطاعات. الهدف تعليمي: تصحيح القرار، لا تقديم بيانات اقتصادية.';

export const BIG_MAC = [
  { ar: '1000$ شهرياً', note: 'ليست مبلغاً واحداً في كل مكان — إنها 3 أضعاف أجر في مكان، وربع أجر في مكان آخر.' },
  { ar: 'العميل الأجنبي يدفع بعملته', note: 'لهذا يعمل كثيرون على منصات أجنبية: نفس العمل، قيمة مختلفة بحسب العملة.' },
  { ar: 'الكلفة تنمو مع الدخل', note: 'أول ما يحدث بعد أول دخل ثابت هو ارتفاع المصاريف. الاحتياطي هو ما يحمي القرار.' },
];

export { USD_REFERENCE };
