import { useEffect, useRef } from 'react';

/** شبكة جزيئات تفاعلية خفيفة على canvas — تتحرك مع المؤشر */
export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: 0.5, y: 0.5 };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const N = window.innerWidth < 768 ? 38 : 76;
    let parts = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      parts = Array.from({ length: N }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.7 + 0.4,
        hue: Math.random() > 0.6 ? '255,107,26' : '34,211,238',
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // خطوط الربط
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(255,255,255,${0.055 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of parts) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          p.x += (pointer.x * w - p.x) * 0.0006;
          p.y += (pointer.y * h - p.y) * 0.0006;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }
        ctx.fillStyle = `rgba(${p.hue},0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
    };

    resize();
    seed();
    draw();

    window.addEventListener('resize', () => {
      resize();
      seed();
    });
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,107,26,0.13),transparent_55%),radial-gradient(ellipse_at_85%_20%,rgba(34,211,238,0.08),transparent_50%),radial-gradient(ellipse_at_10%_70%,rgba(163,230,53,0.05),transparent_45%)]" />
      <div className="absolute inset-0 grid-bg opacity-70" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
