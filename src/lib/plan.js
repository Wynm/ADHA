import { PHASES } from '../data/roadmap.js';
import { CURRENCIES } from '../data/currency.js';
import { TRACKS, simulate } from './simulator.js';
import { ARCADE, RISK } from '../data/opportunities.js';

export const COMPASS_PATHS = {
  freelance: { ar: 'عمل حرّ مُتخصّص', emoji: '🎯' },
  service: { ar: 'خدمة مُنتَجة', emoji: '📦' },
  product: { ar: 'منتج رقمي', emoji: '💾' },
  content: { ar: 'محتوى تعليمي', emoji: '🎙️' },
  learn: { ar: 'مرحلة تعلّم', emoji: '🌱' },
};

/**
 * يبني وثيقة خطة Markdown من حالة المستخدم كاملة.
 */
export function buildPlan(state) {
  const { compass, trackId, hours, goal, price, costs, feePct, hoursPerUnit, days, currency, tasks } = state;
  const c = CURRENCIES.find((x) => x.id === currency) || CURRENCIES[0];
  const track = TRACKS.find((t) => t.id === trackId) || TRACKS[0];
  const sim = simulate(trackId, hours);

  const pathKey = Object.keys(compass || {}).length >= 4 ? guessPath(compass) : null;
  const path = pathKey ? COMPASS_PATHS[pathKey] : null;

  const perUnitUsd = Math.max(0, price / c.rate - costs / c.rate - (price / c.rate) * (feePct / 100));
  const targetUsd = goal / c.rate;
  const units = perUnitUsd > 0 ? Math.ceil(targetUsd / perUnitUsd) : 0;
  const totalHours = units * hoursPerUnit;
  const perDay = days > 0 ? totalHours / days : 0;

  const doneTasks = Object.values(tasks || {}).filter(Boolean).length;
  const totalTasks = PHASES.reduce((s, p) => s + p.tasks.length, 0);

  const today = new Date();
  const date = today.toISOString().slice(0, 10);

  const lines = [];
  lines.push(`# خطة ADHA الشخصية — ${date}`);
  lines.push('');
  lines.push('> وُلّدت هذه الوثيقة من إعداداتك داخل تطبيق ADHA. ليست نصيحة مالية، بل أرقام من إعداداتك أنت.');
  lines.push('');
  lines.push('## 1 · البوصلة');
  lines.push('');
  if (path) {
    lines.push(`- المسار المقترح: **${path.emoji} ${path.ar}**`);
  } else {
    lines.push('- لم تكتمل أسئلة البوصلة بعد (أربعة أسئلة فقط، دقيقتان).');
  }
  lines.push('');
  lines.push('## 2 · الهدف المالي');
  lines.push('');
  lines.push(`- الهدف الشهري الصافي: **${goal.toLocaleString('en-US')} ${c.id}**`);
  lines.push(`- سعر الوحدة: ${price.toLocaleString('en-US')} ${c.id} · التكلفة: ${costs.toLocaleString('en-US')} ${c.id} · رسوم المنصة: ${feePct}%`);
  lines.push(`- صافي الوحدة: **${Math.round((perUnitUsd * c.rate) * 100) / 100} ${c.id}**`);
  lines.push(`- الوحدات المطلوبة شهرياً: **${units}**`);
  lines.push(`- الساعات المطلوبة شهرياً: **${totalHours}** (≈ ${Math.round(perDay * 10) / 10} ساعة/يوم على ${days} يوماً)`);
  lines.push(
    `- الحكم: ${perDay <= 6 ? '✅ قابل للتنفيذ بشرياً' : '⚠️ غير واقعي بهذه المعطيات — ارفع السعر أو قلّل الهدف أو زد الأيام'}`
  );
  lines.push('');
  lines.push('## 3 · النموذج الزمني (24 شهراً)');
  lines.push('');
  lines.push(`- المسار المختار في المحاكي: **${track.ar}** · ${hours} ساعة/أسبوع`);
  lines.push(`- الدخل الشهري في الشهر 24: **$${sim.month24.toLocaleString('en-US')}**`);
  lines.push(`- الإجمالي التراكمي: **$${sim.total2y.toLocaleString('en-US')}**`);
  lines.push(`- أول شهر يتجاوز 150$: ${sim.breakevenMonth ? `الشهر ${sim.breakevenMonth}` : 'لم يحدث في 24 شهراً بهذه المعطيات'}`);
  lines.push(`- سعر ساعتك الفعلي (الدخل ÷ كل الساعات): **$${sim.effectiveHourly}**`);
  lines.push('');
  lines.push('## 4 · خريطة 90 يوماً');
  lines.push('');
  for (const p of PHASES) {
    lines.push(`### ${p.days} — ${p.title}`);
    lines.push(`_${p.subtitle}_`);
    lines.push('');
    for (const t of p.tasks) {
      const checked = tasks?.[`${p.id}:${t.d}`] ? 'x' : ' ';
      lines.push(`- [${checked}] **يوم ${t.d}**: ${t.t} — ${t.hint}`);
    }
    lines.push('');
    lines.push(`> المخرج: ${p.output}`);
    lines.push(`> معيار النجاح: ${p.metric}`);
    lines.push('');
  }
  lines.push(`**التقدّم الحالي:** ${doneTasks}/${totalTasks} مهمة.`);
  lines.push('');
  lines.push('## 5 · قائمة المراجعة قبل أي دفع');
  lines.push('');
  for (const r of [
    'اطلب العقد مكتوباً. الرفض = الجواب.',
    'أي «سحب» يحتاج رسوماً إضافية ليس سحباً.',
    'أي عائد يومي «ثابت» = أموال الداخلين الجدد.',
    'أي دخل يعتمد على جلب أشخاص = شبكة تسويق لا عمل.',
    'إن شعرت بضغط الوقت، فأنت في المكان الخطأ.',
  ]) {
    lines.push(`- [ ] ${r}`);
  }
  lines.push('');
  lines.push('## 6 · المسارات الثمانية (مرجع سريع)');
  lines.push('');
  lines.push('| المسار | المخاطرة | أول دولار | رأس المال |');
  lines.push('| --- | --- | --- | --- |');
  for (const a of ARCADE) {
    lines.push(`| ${a.ar} | ${RISK[a.risk].ar} | ${a.timeToFirstDollar} | ${a.capital === 0 ? 'صفر' : `~${a.capital}$`} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('_صُنع بواسطة ADHA · أعد قراءة هذه الوثيقة بعد 90 يوماً._');

  return lines.join('\n');
}

/** نسخة مبسطة من منطق البوصلة للاستخدام خارج المكوّن */
export function guessPath(answers) {
  const { q1, q2, q3, q4 } = answers;
  if (q1 === 'nothing' && (q2 === 'low' || q2 === 'mid')) return 'learn';
  if (q3 === 'cash' && q1 !== 'nothing') return q2 === 'low' ? 'service' : 'freelance';
  if (q3 === 'asset') return q1 === 'make' || q1 === 'build' ? 'product' : 'content';
  if (q3 === 'audience' || q1 === 'talk') return 'content';
  if (q3 === 'proof') return q1 === 'build' ? 'product' : 'service';
  if (q4 === 'boring' || q2 === 'full') return 'freelance';
  return 'service';
}

export function downloadPlan(state) {
  const md = buildPlan(state);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `adha-plan-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export const buildPlanText = buildPlan;
