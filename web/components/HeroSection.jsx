'use client';

import { useEffect, useRef } from 'react';

export function HeroSection({ totalCount }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle field
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${p.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[420px] flex flex-col items-center justify-center text-center px-4 py-20">
      {/* Canvas particle field */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/30 via-transparent to-navy-900" style={{ zIndex: 1 }} />

      {/* Decorative ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-gold-800/10 pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-crimson-800/10 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        <p className="font-vazirmatn text-gold-600 text-sm tracking-[0.3em] mb-4 uppercase">
          بایگانی زنده
        </p>

        <h1 className="font-cormorant font-light text-5xl sm:text-6xl md:text-7xl text-ivory-100 mb-4 leading-tight">
          موسیقی ایرانی
        </h1>

        <p className="font-cormorant italic text-xl text-ivory-200/60 mb-2">
          Persian Music Archive
        </p>

        {/* Waveform decoration */}
        <div className="flex items-end justify-center gap-1 h-8 my-6 text-gold-600/60">
          {Array.from({ length: 24 }, (_, i) => {
            const heights = [12, 18, 24, 16, 28, 20, 14, 26, 18, 22, 16, 30, 14, 20, 24, 18, 26, 12, 22, 28, 16, 20, 14, 18];
            const durs = [1.1, 1.4, 1.0, 1.3, 0.9, 1.2, 1.5, 1.1, 1.3, 1.0, 1.4, 0.8, 1.2, 1.1, 0.9, 1.3, 1.0, 1.4, 1.2, 0.9, 1.1, 1.3, 1.0, 1.2];
            return (
              <span
                key={i}
                className="waveform-bar"
                style={{
                  height: `${heights[i]}px`,
                  '--dur': `${durs[i]}s`,
                  '--delay': `${i * 0.06}s`,
                }}
              />
            );
          })}
        </div>

        {totalCount > 0 && (
          <p className="font-vazirmatn text-ivory-200/40 text-sm">
            {totalCount} video{totalCount !== 1 ? 's' : ''} in the archive
          </p>
        )}
      </div>
    </section>
  );
}
