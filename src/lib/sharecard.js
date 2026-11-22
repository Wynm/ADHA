// ══════════════════════════════════════════════════════════════
//  ADHA · بطاقة المشاركة — تُرسم على canvas داخل المتصفح
//  الهدف: ملف PNG يحمل أرقامك الحقيقية، لا صورة تحفيزية فارغة.
// ══════════════════════════════════════════════════════════════

const W = 1080;
const H = 1350;

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fitText(ctx, text, maxWidth, startSize, family, weight = '700') {
  let size = startSize;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  } while (size > 18);
  return size;
}

/**
 * @param {object} data
 *  { name, path, trackAr, month24, total2y, totalHours, hoursPerWeek, survival, doneTasks, totalTasks, streak }
 */
export function drawShareCard(canvas, data) {
  const ctx = canvas.getContext('2d');
  canvas.width = W * 2;
  canvas.height = H * 2;
  ctx.scale(2, 2);

  const FONT_AR = '"IBM Plex Sans Arabic", "Segoe UI", system-ui, sans-serif';
  const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';
  const FONT_DISP = '"Space Grotesk", "IBM Plex Sans Arabic", sans-serif';

  // ── background ──
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#05060a');
  bg.addColorStop(0.55, '#0b0d14');
  bg.addColorStop(1, '#140a05');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.5, -80, 40, W * 0.5, -80, 700);
  glow.addColorStop(0, 'rgba(255,107,26,0.30)');
  glow.addColorStop(1, 'rgba(255,107,26,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(255,255,255,0.045)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 54) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 54) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // ── header logo mark ──
  const mark = ctx.createLinearGradient(W - 96, 30, W - 40, 90);
  mark.addColorStop(0, '#ff6b1a');
  mark.addColorStop(1, '#22d3ee');
  ctx.save();
  ctx.strokeStyle = mark;
  ctx.lineWidth = 4.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(W - 94, 84);
  ctx.lineTo(W - 68, 32);
  ctx.lineTo(W - 42, 84);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W - 82, 67);
  ctx.lineTo(W - 54, 67);
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = 'right';
  ctx.direction = 'rtl';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 40px ${FONT_DISP}`;
  ctx.fillText('ADHA', W - 136, 78);
  ctx.fillStyle = 'rgba(148,163,184,0.85)';
  ctx.font = `400 17px ${FONT_MONO}`;
  ctx.fillText('ساحة الفرص الحقيقية', W - 136, 108);

  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillStyle = 'rgba(100,116,139,0.9)';
  ctx.font = `400 15px ${FONT_MONO}`;
  ctx.fillText(new Date().toISOString().slice(0, 10), 72, 76);

  // ── name block ──
  ctx.textAlign = 'right';
  ctx.direction = 'rtl';
  ctx.fillStyle = 'rgba(148,163,184,0.9)';
  ctx.font = `400 24px ${FONT_AR}`;
  ctx.fillText('بطاقة قرار شخصية', W - 72, 200);

  const name = data.name?.trim() || 'بدون اسم';
  fitText(ctx, name, W - 200, 78, FONT_AR, '700');
  const nameGrad = ctx.createLinearGradient(W - 72, 0, 100, 0);
  nameGrad.addColorStop(0, '#ffffff');
  nameGrad.addColorStop(0.7, '#ffb37a');
  nameGrad.addColorStop(1, '#22d3ee');
  ctx.fillStyle = nameGrad;
  ctx.font = `700 ${fitText(ctx, name, W - 200, 78, FONT_AR, '700')}px ${FONT_AR}`;
  ctx.fillText(name, W - 72, 275);

  // path pill
  const pathText = data.path?.ar ? `المسار · ${data.path.ar}` : 'المسار · لم تُحدَّد البوصلة';
  ctx.font = `500 25px ${FONT_AR}`;
  const pw = ctx.measureText(pathText).width + 56;
  ctx.fillStyle = 'rgba(255,107,26,0.14)';
  rr(ctx, W - 72 - pw, 305, pw, 54, 27);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,107,26,0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#ffb37a';
  ctx.fillText(pathText, W - 44, 341);

  // ── metric cards ──
  const cards = [
    { v: `$${data.month24.toLocaleString('en-US')}`, l: 'دخل الشهر 24', c: '#a3e635' },
    { v: `$${data.total2y.toLocaleString('en-US')}`, l: 'صافي سنتين', c: '#ffffff' },
    { v: `${data.totalHours.toLocaleString('en-US')}h`, l: 'ساعات العمل', c: '#22d3ee' },
    { v: `${data.hoursPerWeek}h`, l: 'أسبوعياً', c: '#fbbf24' },
  ];
  const cw = (W - 144 - 3 * 18) / 2;
  const ch = 132;
  cards.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 72 + (1 - col) * (cw + 18);
    const y = 400 + row * (ch + 18);
    ctx.fillStyle = 'rgba(255,255,255,0.035)';
    rr(ctx, x, y, cw, ch, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'right';
    ctx.direction = 'ltr';
    ctx.fillStyle = c.c;
    const size = fitText(ctx, c.v, cw - 44, 46, FONT_DISP, '700');
    ctx.font = `700 ${size}px ${FONT_DISP}`;
    ctx.fillText(c.v, x + cw - 22, y + 66);

    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(148,163,184,0.85)';
    ctx.font = `400 20px ${FONT_AR}`;
    ctx.fillText(c.l, x + cw - 22, y + 102);
  });

  // ── chart strip ──
  const cy = 710;
  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  rr(ctx, 72, cy, W - 144, 210, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.stroke();

  ctx.textAlign = 'right';
  ctx.direction = 'rtl';
  ctx.fillStyle = 'rgba(100,116,139,0.95)';
  ctx.font = `400 17px ${FONT_MONO}`;
  ctx.fillText('النمو التراكمي خلال أربعة وعشرين شهراً', W - 100, cy + 38);

  const pts = data.months || [];
  if (pts.length) {
    const max = Math.max(...pts.map((p) => p.cumulative)) || 1;
    const gx = 108;
    const gy = cy + 62;
    const gw = W - 216;
    const gh = 118;
    ctx.beginPath();
    pts.forEach((p, i) => {
      const x = gx + (i / (pts.length - 1)) * gw;
      const y = gy + gh - (p.cumulative / max) * gh;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.lineTo(gx + gw, gy + gh);
    ctx.lineTo(gx, gy + gh);
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, gy, 0, gy + gh);
    fill.addColorStop(0, 'rgba(34,211,238,0.30)');
    fill.addColorStop(1, 'rgba(34,211,238,0)');
    ctx.fillStyle = fill;
    ctx.fill();
  }

  // ── survival / progress row ──
  const ry = 955;
  const halfW = (W - 144 - 18) / 2;
  const blocks = [
    { label: 'مؤشر البقاء', value: data.survival == null ? '—' : `${data.survival}/100`, pct: data.survival ?? 0, color: '#a3e635' },
    { label: 'خريطة 90 يوماً', value: `${data.doneTasks}/${data.totalTasks}`, pct: (data.doneTasks / data.totalTasks) * 100, color: '#ff6b1a' },
  ];
  blocks.forEach((b, i) => {
    const x = W - 72 - halfW - i * (halfW + 18);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    rr(ctx, x, ry, halfW, 108, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.stroke();

    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.fillStyle = 'rgba(148,163,184,0.9)';
    ctx.font = `400 19px ${FONT_AR}`;
    ctx.fillText(b.label, x + halfW - 22, ry + 38);

    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.fillStyle = b.color;
    ctx.font = `700 26px ${FONT_MONO}`;
    ctx.fillText(b.value, x + 22, ry + 42);

    const bw = halfW - 44;
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    rr(ctx, x + 22, ry + 68, bw, 8, 4);
    ctx.fill();
    ctx.fillStyle = b.color;
    rr(ctx, x + 22, ry + 68, Math.max(4, (bw * Math.min(100, b.pct)) / 100), 8, 4);
    ctx.fill();
  });

  // ── streak strip ──
  if (data.streakGrid) {
    const sy = 1090;
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.fillStyle = 'rgba(148,163,184,0.9)';
    ctx.font = `400 19px ${FONT_AR}`;
    ctx.fillText(`الالتزام · ${data.streak} يوماً متتالياً`, W - 72, sy + 4);

    const cell = 15;
    const gap = 4;
    const perRow = 30;
    data.streakGrid.slice(-perRow).forEach((on, i) => {
      const x = W - 72 - (i + 1) * (cell + gap) + gap;
      ctx.fillStyle = on ? 'rgba(163,230,53,0.85)' : 'rgba(255,255,255,0.07)';
      rr(ctx, x, sy + 18, cell, cell, 3);
      ctx.fill();
    });
  }

  // ── quote ──
  ctx.textAlign = 'right';
  ctx.direction = 'rtl';
  ctx.fillStyle = 'rgba(226,232,240,0.95)';
  ctx.font = `500 30px ${FONT_AR}`;
  ctx.fillText('«الربح من الإنترنت ليس سراً.', W - 72, 1215);
  ctx.fillStyle = '#ff8a3d';
  ctx.font = `600 30px ${FONT_AR}`;
  ctx.fillText('هو فقط أبطأ مما يبيعونك.»', W - 72, 1257);

  // ── footer ──
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(72, 1290);
  ctx.lineTo(W - 72, 1290);
  ctx.stroke();

  ctx.direction = 'ltr';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(100,116,139,0.95)';
  ctx.font = `400 16px ${FONT_MONO}`;
  ctx.fillText('github.com/Wynm/ADHA', 72, 1322);

  ctx.textAlign = 'right';
  ctx.direction = 'rtl';
  ctx.fillStyle = 'rgba(100,116,139,0.95)';
  ctx.font = `400 16px ${FONT_AR}`;
  ctx.fillText('لا وعود · أرقام فقط', W - 72, 1322);
}

export function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }, 'image/png');
}
