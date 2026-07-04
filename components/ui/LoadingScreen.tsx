'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'portfolio-loaded-v2';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem(STORAGE_KEY)) return false;
    }
    return true;
  });
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'loading' | 'ready'>('loading');
  const startedAt = useRef(0);
  const particles = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: '#3b82f6',
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    })),
  []);

  useEffect(() => {
    const splash = document.getElementById('init-splash');
    if (splash) splash.classList.add('hidden');
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    startedAt.current = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startedAt.current;
      const pct = Math.min(elapsed / 400, 1);
      setProgress(pct);
      if (pct < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const onLoad = () => {
      setStage('ready');
      setTimeout(() => {
        setProgress(1);
        setTimeout(() => {
          try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
          setIsLoading(false);
        }, 150);
      }, 100);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }

    return () => window.removeEventListener('load', onLoad);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{
            background: '#000',
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: p.color,
                  left: p.left,
                  top: p.top,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-8"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black">
                <span className="text-white">SYED</span>
                <span className="text-white/90"> ABDULLAH ZAIDI</span>
              </h1>
              <p className="text-sm md:text-base text-white/40 mt-2 tracking-widest uppercase">
                Agentic AI Developer
              </p>
            </motion.div>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto mb-4"
            >
              <div className="loading-bar w-[200px] h-[2px] bg-white/10 rounded-full overflow-hidden mx-auto">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6, #3b82f6, #3b82f6)',
                    width: `${progress * 100}%`,
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs text-white/30 tracking-wider uppercase"
            >
              {stage === 'ready' ? 'Ready!' : 'Loading...'}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
