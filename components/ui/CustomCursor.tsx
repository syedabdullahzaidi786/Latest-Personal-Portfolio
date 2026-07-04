'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const PULL_FACTOR = 0.2;

export function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  const isHoveringRef = useRef(false);
  const isVisibleRef = useRef(false);
  const hoveredElRef = useRef<Element | null>(null);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverLabelRef = useRef<string | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const magnetX = useMotionValue(-100);
  const magnetY = useMotionValue(-100);

  const springX = useSpring(magnetX, { stiffness: 400, damping: 26, mass: 0.25 });
  const springY = useSpring(magnetY, { stiffness: 400, damping: 26, mass: 0.25 });

  const triggerPulse = useCallback(() => {
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    setPulse(true);
    pulseTimerRef.current = setTimeout(() => setPulse(false), 150);
  }, []);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      cursorX.set(cx);
      cursorY.set(cy);

      if (isHoveringRef.current && hoveredElRef.current) {
        const rect = hoveredElRef.current.getBoundingClientRect();
        const ecx = rect.left + rect.width / 2;
        const ecy = rect.top + rect.height / 2;
        magnetX.set(cx + (ecx - cx) * PULL_FACTOR);
        magnetY.set(cy + (ecy - cy) * PULL_FACTOR);
      } else {
        magnetX.set(cx);
        magnetY.set(cy);
      }

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };
    const onMouseEnter = () => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const skipTags = new Set(['section', 'div', 'nav', 'header', 'main', 'footer', 'html', 'body', 'article', 'aside', 'svg', 'path', 'g', 'img', 'canvas']);

    const extractLabel = (el: Element): string | null => {
      const tag = el.tagName.toLowerCase();
      if (skipTags.has(tag)) return null;

      const aria = el.getAttribute('aria-label');
      if (aria && aria.length >= 2 && aria.length < 30) return aria;
      const title = el.getAttribute('title');
      if (title && title.length >= 2 && title.length < 30) return title;

      const text = el.textContent?.trim().replace(/\s+/g, ' ');
      if (text && text.length >= 2 && text.length <= 32) return text.slice(0, 28);
      return null;
    };

    const onHoverCheck = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const el = e.target.closest('a, button, input, [role="button"]');
      const hovering = !!el;
      if (hovering !== isHoveringRef.current) {
        isHoveringRef.current = hovering;
        hoveredElRef.current = hovering ? el : null;
        setIsHovering(hovering);
      }
      const label = el ? extractLabel(el) : null;
      if (label !== hoverLabelRef.current) {
        hoverLabelRef.current = label;
        setHoverLabel(label);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) triggerPulse();
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', onHoverCheck);
    window.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', onHoverCheck);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, [cursorX, cursorY, magnetX, magnetY, triggerPulse]);

  useEffect(() => {
    if (isTouchDevice) return;

    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = 'body:not(:has(:focus-visible)) a, body:not(:has(:focus-visible)) button, body:not(:has(:focus-visible)) [role="button"], body:not(:has(:focus-visible)) [role="tab"] { cursor: none !important; } input, textarea, [contenteditable] { cursor: auto !important; }';
    document.head.appendChild(style);

    return () => {
      const existing = document.getElementById('custom-cursor-style');
      if (existing) existing.remove();
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Ring — tool-like, precise, responds to hover and click */}
      <motion.div
        style={{
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed pointer-events-none z-[9999]"
      >
        <motion.div
          animate={{
            width: isHovering ? 46 : 34,
            height: isHovering ? 46 : 34,
            borderColor: pulse
              ? '#ffffff'
              : isHovering
                ? '#3b82f6'
                : 'rgba(255,255,255,0.25)',
            scale: pulse ? 1.12 : 1,
          }}
          transition={{ type: 'spring', stiffness: 550, damping: 32, mass: 0.3 }}
          className="rounded-full border-2"
        />
      </motion.div>

      {/* Dot — precision point, color feedback on hover, blip on click */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          x: '-50%',
          y: '-50%',
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed pointer-events-none z-[9999]"
      >
        <motion.div
          animate={{
            scale: pulse ? 1.75 : isHovering ? 1.5 : 1,
            backgroundColor: isHovering ? '#3b82f6' : '#ffffff',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, mass: 0.2 }}
          className="w-[4px] h-[4px] rounded-full"
        />
      </motion.div>

      {/* Label — tells you what you're hovering */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          x: 18,
          y: -16,
        }}
        animate={{ opacity: hoverLabel ? 1 : 0 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        className="fixed pointer-events-none z-[9999]"
      >
        <motion.span
          animate={{ x: hoverLabel ? 0 : -4 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="text-[10px] font-semibold tracking-wide text-white/50 whitespace-nowrap"
        >
          {hoverLabel}
        </motion.span>
      </motion.div>
    </>
  );
}
