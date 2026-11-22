// ═══════════════════════════════════════════════════════════════
//  ADHA · قاعدة بيانات الفرص — الواقعية فقط، بدون وعود وهمية
//  كل فرصة مصنّفة بمستوى المخاطرة + الوقت المتوقع لأول دولار
// ═══════════════════════════════════════════════════════════════

export const RISK = {
  low: { key: 'low', ar: 'منخفضة', en: 'Low', color: '#22c55e' },
  medium: { key: 'medium', ar: 'متوسطة', en: 'Medium', color: '#f59e0b' },
  high: { key: 'high', ar: 'مرتفعة', en: 'High', color: '#ef4444' },
};

export const ARCADE = [
  {
    id: 'bug-bounty',
    emoji: '🛡️',
    ar: 'صيد الثغرات (Bug Bounty)',
    en: 'Bug Bounty Hunting',
    arDesc:
      'ابحث عن ثغرات في مواقع الشركات عبر منصات مثل HackerOne و Bugcrowd. المكافآت تبدأ من 50$ للثغرات البسيطة وتصل لآلاف الدولارات. أنت تبيع «أماناً» لشركة خسرت بياناتها فعلاً من قبل.',
    risk: 'high',
    capital: 0,
    timeToFirstDollar: '2–8 أسابيع',
    effort: 'متوسط',
    skills: ['شبكات', 'OWASP', 'قراءة كود'],
    proof: 'المكافآت تُدفع فقط بعد إثبات الثغرة وتأكيدها من الفريق.',
    links: [
      { label: 'HackerOne', url: 'https://www.hackerone.com/' },
      { label: 'Bugcrowd', url: 'https://www.bugcrowd.com/' },
    ],
  },
  {
    id: 'vibe-saas',
    emoji: '⚡',
    ar: 'Micro-SaaS مُوجّه بعميل واحد',
    en: 'Single-Customer Micro-SaaS',
    arDesc:
      'قبل أن تكتب سطر كود: بيع الحل. ابحث عن صاحب متجر أو عيادة وقال لك «هذه العملية تأخذ مني 3 ساعات يومياً». اتفاق أسبوعي مكتوب على ورقة. أول دفع = أول إثبات سوقي حقيقي.',
    risk: 'medium',
    capital: 0,
    timeToFirstDollar: '1–4 أسابيع',
    effort: 'مرتفع',
    skills: ['برمجة', 'بيع', 'فهم العميل'],
    proof: 'الاتفاق المكتوب قبل بناء المنتج.',
    links: [
      { label: 'Indie Hackers', url: 'https://www.indiehackers.com/' },
      { label: 'Stripe Atlas', url: 'https://stripe.com/atlas' },
    ],
  },
  {
    id: 'resale-value',
    emoji: '🔁',
    ar: 'إعادة بيع قيمة (لا منتج)',
    en: 'Value Reselling',
    arDesc:
      'اشترِ خدمة رخيصة ومعروفة، أعد تعبئتها وتقديمها لعملاء لا يعرفون أنها أرخص. مثال واضح: تحويل قوالب جاهزة إلى هوية بصرية، أو سكربتات مجانية إلى أتمتة مُشغّلة.',
    risk: 'low',
    capital: 0,
    timeToFirstDollar: '3–10 أيام',
    effort: 'منخفض',
    skills: ['تسويق', 'تصميم', 'تواصل'],
    proof: 'هامش الربح الفعلي = السعر - التكلفة.',
    links: [{ label: 'Fiverr', url: 'https://www.fiverr.com/' }],
  },
  {
    id: 'paid-debug',
    emoji: '🧨',
    ar: 'إصلاح أعطال مقابل أجر',
    en: 'Paid Debugging',
    arDesc:
      'المطورون العرب في مجتمعات Discord و Telegram يعانون من أعطال لا يستطيعون حلها. العرض واضح: «أصلح لك العطل مقابل X». سوق صغير مزدحم بالطلب وقليل العرض.',
    risk: 'low',
    capital: 0,
    timeToFirstDollar: 'أيام',
    effort: 'منخفض',
    skills: ['تصحيح أخطاء', 'صبر'],
    proof: 'العطل يعمل بعد الإصلاح أو لا تدفع.',
    links: [{ label: 'GitHub Issues', url: 'https://github.com/issues' }],
  },
  {
    id: 'b2b-automation',
    emoji: '🤖',
    ar: 'أتمتة عمليات للشركات الصغيرة',
    en: 'SMB Process Automation',
    arDesc:
      'المطاعم والصيدليات والمحلات: ورقة إكسل واحدة تحوّلها إلى نظام تتبع. القيمة ليست في التقنية بل في الوقت الذي توفره. استخدم n8n أو Make ثم بِع «انتهاء العمل اليدوي».',
    risk: 'medium',
    capital: 0,
    timeToFirstDollar: '2–6 أسابيع',
    effort: 'متوسط',
    skills: ['n8n/Make', 'تحليل عمليات'],
    proof: 'توفير ساعات موثّق قبل/بعد.',
    links: [
      { label: 'n8n', url: 'https://n8n.io/' },
      { label: 'Make', url: 'https://www.make.com/' },
    ],
  },
  {
    id: 'open-source-support',
    emoji: '🧩',
    ar: 'دعم مؤسسي لمشروع مفتوح المصدر',
    en: 'OSS Paid Support',
    arDesc:
      'إذا كان لديك مستودع يستخدمه الناس، فبيع «دعم أولوية» أو «إضافة ميزة مدفوعة». لا تُخفِ المشروع، بل بِع السرعة والضمان. هذه حرفة قائمة بذاتها منذ عقود.',
    risk: 'medium',
    capital: 0,
    timeToFirstDollar: 'أسابيع–أشهر',
    effort: 'مرتفع',
    skills: ['مستودع نشط', 'توثيق', 'دعم'],
    proof: 'عقد دعم شهري.',
    links: [{ label: 'GitHub Sponsors', url: 'https://github.com/sponsors' }],
  },
  {
    id: 'data-entry-plus',
    emoji: '⌨️',
    ar: 'إدخال بيانات + تحقق',
    en: 'Data Entry + Verification',
    arDesc:
      'منصات مثل Remotasks و Amazon MTurk تدفع مقابل مهام صغيرة، لكن الدفع منخفض جداً. تُذكر هنا للشفافية لا كتوصية: استخدمها فقط كجسر مؤقت وليس كخطة.',
    risk: 'low',
    capital: 0,
    timeToFirstDollar: 'أيام',
    effort: 'منخفض',
    skills: ['تركيز', 'لغة'],
    proof: 'الدفع مقابل المهمة المنجزة فقط.',
    links: [
      { label: 'Amazon MTurk', url: 'https://www.mturk.com/' },
    ],
  },
  {
    id: 'teaching',
    emoji: '📣',
    ar: 'بيع المهارة التي تعلّمتها بدل بيع الوقت',
    en: 'Sell the Skill, Not the Hours',
    arDesc:
      'كل ساعة تعلّمت فيها شيئاً جديداً، وثّقها. خمس ملاحظات عملية تحوّلها إلى درس مصغّر. المتعلّم يدفع مقابل اختصار الطريق، لا مقابل معلومة مجانية على يوتيوب.',
    risk: 'low',
    capital: 0,
    timeToFirstDollar: '1–3 أسابيع',
    effort: 'منخفض',
    skills: ['كتابة', 'تفسير', 'تسجيل'],
    proof: 'أول مشترٍ للدرس.',
    links: [{ label: 'Gumroad', url: 'https://gumroad.com/' }],
  },
];

// «الوقود لا الهدف» — أنواع عمل على الإنترنت تصنع دخلاً لكنها لا تصنع أصلاً
export const FUEL_NOT_GOAL = [
  { ar: 'توصيل طلبات / نقل', why: 'تدفع مقابل الساعة فقط، لا بناء أصل ولا مهارة قابلة للنقل.' },
  { ar: 'مهام النقر اليومية (Click Tasks)', why: 'كل ساعة لا تزيد قيمتك السوقية، وتستنزف انتباهك.' },
  { ar: 'التوصيات مقابل عمولات ضخمة', why: 'تحوّل علاقاتك إلى أرقام تضيع، والضحية غالباً صديقك.' },
  { ar: 'تداول بدون خبرة', why: 'ليس مصدر دخل أول؛ هو تحويل رأس مال إلى تعليم مكلف.' },
];

export const PRINCIPLES = [
  {
    ar: 'أصل واحد قبل كل شيء',
    desc: 'لا تشتري شيئاً قبل أن تبيع شيئاً. من يبيع أولاً يعرف ما يبني.',
    icon: '01',
  },
  {
    ar: 'الدليل قبل الضجيج',
    desc: 'إذا لم يكن الأمر قابلاً للقياس، فلا يمكن أن يكون نصيحة. الأرقام لا تكذب.',
    icon: '02',
  },
  {
    ar: 'لا للربح السريع',
    desc: 'أي وعد «ربح 500$ في يوم» هو فخ. الوقت الذي تكسبه هو الذي يُكسب.',
    icon: '03',
  },
  {
    ar: 'الوقت أغلى رأس مال',
    desc: 'كل ساعة استثمرتها في مهارة قابلة للنقل، تعود مدى الحياة.',
    icon: '04',
  },
];
