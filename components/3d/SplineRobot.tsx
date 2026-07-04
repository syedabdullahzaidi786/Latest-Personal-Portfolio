'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export function SplineRobot() {
  const { scrollY } = useScroll();
  const [posRange, setPosRange] = useState<[number, number]>([0, 0]);
  const [fadeRange, setFadeRange] = useState<[number, number]>([0, 0]);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  const mouseX = useRef(0);
  const active = useRef(false);
  const baseAngle = useRef(0);
  const rafRef = useRef(0);
  const hoverRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Spline load
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;
    let cancelled = false;

    import('@splinetool/runtime').then(({ Application }) => {
      if (cancelled || !canvasRef.current) return;
      const app = new Application(canvasRef.current);
      appRef.current = app;
      app.load('/scene.splinecode')
        .then(() => {
          if (cancelled) return;
          const allObjs = app.getAllObjects();
          console.log('Spline objects:', allObjs.map((o: any) => o.name));
          eyeRef.current = allObjs.filter((o: any) => /eye/i.test(o.name));
          setLoaded(true);
        })
        .catch((err: unknown) => console.error('Spline load error:', err));
    });

    return () => { cancelled = true; appRef.current?.dispose(); };
  }, [mounted]);

  // Scroll ranges
  useEffect(() => {
    if (!mounted) return;
    const hero = document.getElementById('home');
    const about = document.getElementById('about');
    if (hero && about) {
      const start = hero.offsetTop + hero.offsetHeight * 0.25;
      const end = about.offsetTop + about.offsetHeight * 0.35;
      setPosRange([start, end]);
      setFadeRange([end, end + window.innerHeight * 0.8]);
    }
  }, [mounted]);

  const smoothY = useSpring(scrollY, { stiffness: 200, damping: 40, mass: 0.1 });
  const progress = useTransform(smoothY, posRange, [0, 1]);
  const fade = useTransform(smoothY, fadeRange, [1, 0]);
  const x = useTransform(progress, [0, 1], ['calc(100vw - 240px)', 'clamp(140px, 16vw, 280px)']);
  const y = useTransform(progress, [0, 1], ['50vh', '50vh']);
  const scale = useTransform(progress, [0, 1], [1, 0.75]);
  const opacity = useTransform(fade, [1, 0], [1, 0]);

  // Hover interaction
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!hoverRef.current) return;
    const rect = hoverRef.current.getBoundingClientRect();
    mouseX.current = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  }, []);

  const handleMouseEnter = useCallback(() => {
    active.current = true;
    eyeRef.current.forEach((obj: any) => {
      try { obj.emitEvent('mouseHover'); } catch {}
    });
  }, []);
  const handleMouseLeave = useCallback(() => {
    active.current = false;
    mouseX.current = 0;
    eyeRef.current.forEach((obj: any) => {
      try { obj.emitEvent('mouseUp'); } catch {}
    });
  }, []);

  // Camera rotation loop
  useEffect(() => {
    if (!loaded) return;
    const factor = 0.06;
    const limit = 0.6;

    const tick = () => {
      const target = active.current ? mouseX.current * limit : 0;
      baseAngle.current += (target - baseAngle.current) * factor;

      const controls = appRef.current?._controls;
      if (controls && 'azimuthAngle' in controls) {
        controls.azimuthAngle = baseAngle.current;
        controls.update?.();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loaded]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed z-40 pointer-events-none top-0 left-0 hidden md:block"
      style={{ x, y, scale, opacity }}
    >
      <div
        ref={hoverRef}
        className="pointer-events-auto overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div className="relative w-[400px] h-[400px] md:w-[480px] md:h-[480px] overflow-hidden">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="w-full h-full block scale-[1.35] origin-top"
          />
        </div>
      </div>
    </motion.div>
  );
}
