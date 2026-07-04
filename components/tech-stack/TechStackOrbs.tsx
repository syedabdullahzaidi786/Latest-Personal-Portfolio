'use client';

import { useRef, useEffect, useState } from 'react';
import { type PortfolioTechGroup } from '@/lib/portfolio-data';

const STIFFNESS = 0.09;
const DAMPING = 0.76;
const TINT_LERP = 0.13;


type Orb = { ox: number; oy: number; x: number; y: number; vx: number; vy: number; color: string; name: string; tint: number; gi: number; phase: number };
type Layout = { startX: number; cy: number; w: number; h: number };
type Sizes = {
  orbR: number; orbG: number; labW: number; pad: number;
  repR: number; rowG: number; rPadY: number; rStartY: number;
  font: string; labFont: string;
};

function getSizes(w: number): Sizes {
  if (w < 480) return {
    orbR: 22, orbG: 5, labW: 65, pad: 8, repR: 70,
    rowG: 6, rPadY: 8, rStartY: 16,
    font: '700 9px Geist, system-ui, -apple-system, sans-serif',
    labFont: '700 9px Geist, system-ui, -apple-system, sans-serif',
  };
  if (w < 640) return {
    orbR: 28, orbG: 7, labW: 80, pad: 12, repR: 90,
    rowG: 8, rPadY: 10, rStartY: 20,
    font: '700 10px Geist, system-ui, -apple-system, sans-serif',
    labFont: '700 10px Geist, system-ui, -apple-system, sans-serif',
  };
  if (w < 900) return {
    orbR: 36, orbG: 10, labW: 110, pad: 18, repR: 120,
    rowG: 10, rPadY: 14, rStartY: 28,
    font: '700 12px Geist, system-ui, -apple-system, sans-serif',
    labFont: '700 12px Geist, system-ui, -apple-system, sans-serif',
  };
  return {
    orbR: 42, orbG: 14, labW: 140, pad: 24, repR: 130,
    rowG: 10, rPadY: 14, rStartY: 28,
    font: '700 13px Geist, system-ui, -apple-system, sans-serif',
    labFont: '700 12px Geist, system-ui, -apple-system, sans-serif',
  };
}

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 255, g: 255, b: 255 };
}

function getLayouts(s: Sizes, canvasW: number, groups: PortfolioTechGroup[]): Layout[] {
  const startX = s.pad + s.labW;
  const layouts: Layout[] = [];
  for (let i = 0; i < groups.length; i++) {
    const rowH = s.orbR * 2 + s.rPadY * 2;
    const cy = s.rStartY + i * (rowH + s.rowG);
    layouts.push({ startX, cy, w: canvasW - startX - s.pad, h: rowH });
  }
  return layouts;
}

function makeOrbs(s: Sizes, layouts: Layout[], groups: PortfolioTechGroup[]): Orb[] {
  const result: Orb[] = [];
  for (let gi = 0; gi < groups.length; gi++) {
    const g = groups[gi];
    const l = layouts[gi];
    for (let ti = 0; ti < g.techs.length; ti++) {
      const x = l.startX + ti * (s.orbR * 2 + s.orbG) + s.orbR;
      const y = l.cy;
      result.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, color: g.color, name: g.techs[ti], tint: 0, gi, phase: Math.random() * Math.PI * 2 });
    }
  }
  return result;
}

function getCanvasHeight(s: Sizes, layouts: Layout[]): number {
  if (layouts.length === 0) return 100;
  const last = layouts[layouts.length - 1];
  return last.cy + last.h / 2 + s.pad;
}

function drawFocusGlow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, tint: number) {
  ctx.save();
  const g = ctx.createRadialGradient(x, y, r * 0.8, x, y, r + 18);
  const rgb = hexToRgb(color);
  g.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
  g.addColorStop(0.6, `rgba(${Math.min(255, rgb.r + 60)},${Math.min(255, rgb.g + 60)},${Math.min(255, rgb.b + 60)},${0.08 + tint * 0.06})`);
  g.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r + 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawOrb(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, name: string, tint: number, phase: number, time: number, font: string) {
  const rgb = hexToRgb(color);
  const pulse = 0.075 + Math.sin(phase + time * 0.35) * 0.025;
  const hoverR = r * (1 + tint * 0.06);

  ctx.save();
  ctx.shadowColor = `rgba(0,0,0,0.4)`;
  ctx.shadowBlur = hoverR * 0.5;
  ctx.shadowOffsetY = hoverR * 0.15;
  ctx.beginPath();
  ctx.arc(x, y, hoverR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (tint > 0.01) {
    ctx.save();
    const aGrad = ctx.createRadialGradient(x, y, hoverR * 0.2, x, y, hoverR * 2.5);
    aGrad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${tint * 0.18 + pulse * 0.04})`);
    aGrad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
    ctx.fillStyle = aGrad;
    ctx.beginPath();
    ctx.arc(x, y, hoverR * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  const boost = tint * 50;
  const gl = ctx.createRadialGradient(
    x - hoverR * 0.3, y - hoverR * 0.35, 0,
    x + hoverR * 0.05, y + hoverR * 0.05, hoverR * 1.2,
  );
  gl.addColorStop(0, `rgb(${Math.min(255, rgb.r + 55 + boost * 0.5)},${Math.min(255, rgb.g + 55 + boost * 0.5)},${Math.min(255, rgb.b + 55 + boost * 0.5)})`);
  gl.addColorStop(0.35, `rgb(${Math.min(255, rgb.r + 25 + boost * 0.3)},${Math.min(255, rgb.g + 25 + boost * 0.3)},${Math.min(255, rgb.b + 25 + boost * 0.3)})`);
  gl.addColorStop(0.65, color);
  gl.addColorStop(0.88, `rgb(${Math.max(0, rgb.r - 55)},${Math.max(0, rgb.g - 55)},${Math.max(0, rgb.b - 55)})`);
  gl.addColorStop(1, `rgb(${Math.max(0, rgb.r - 85)},${Math.max(0, rgb.g - 85)},${Math.max(0, rgb.b - 85)})`);
  ctx.fillStyle = gl;
  ctx.beginPath();
  ctx.arc(x, y, hoverR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  const eGrad = ctx.createRadialGradient(x, y, hoverR * 0.7, x, y, hoverR);
  eGrad.addColorStop(0, 'rgba(0,0,0,0)');
  eGrad.addColorStop(0.85, `rgba(0,0,0,${0.08 + tint * 0.04})`);
  eGrad.addColorStop(1, `rgba(0,0,0,${0.3 + tint * 0.06})`);
  ctx.fillStyle = eGrad;
  ctx.beginPath();
  ctx.arc(x, y, hoverR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  const fGrad = ctx.createRadialGradient(
    x + hoverR * 0.3, y + hoverR * 0.35, hoverR * 0.1,
    x + hoverR * 0.3, y + hoverR * 0.35, hoverR * 0.9,
  );
  fGrad.addColorStop(0, `rgba(${Math.min(255, rgb.r + 40)},${Math.min(255, rgb.g + 40)},${Math.min(255, rgb.b + 40)},${0.12 + tint * 0.06})`);
  fGrad.addColorStop(0.5, `rgba(${rgb.r},${rgb.g},${rgb.b},0.03)`);
  fGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = fGrad;
  ctx.beginPath();
  ctx.arc(x, y, hoverR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  const hGrad = ctx.createRadialGradient(
    x - hoverR * 0.25, y - hoverR * 0.3, 0,
    x - hoverR * 0.25, y - hoverR * 0.3, hoverR * 0.4,
  );
  hGrad.addColorStop(0, `rgba(255,255,255,${0.22 + tint * 0.1})`);
  hGrad.addColorStop(0.5, `rgba(255,255,255,${0.06 + tint * 0.03})`);
  hGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hGrad;
  ctx.beginPath();
  ctx.arc(x, y, hoverR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = `rgba(255,255,255,${0.18 + tint * 0.1})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, hoverR - 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  const bGrad = ctx.createRadialGradient(
    x + hoverR * 0.15, y + hoverR * 0.35, 0,
    x + hoverR * 0.15, y + hoverR * 0.35, hoverR * 0.15,
  );
  bGrad.addColorStop(0, `rgba(255,255,255,${0.08 + tint * 0.04})`);
  bGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = bGrad;
  ctx.beginPath();
  ctx.arc(x, y, hoverR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  const textGlow = ctx.createRadialGradient(x, y, 0, x, y, r * 0.85);
  textGlow.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${0.3 + tint * 0.15})`);
  textGlow.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
  ctx.fillStyle = textGlow;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(name, x, y);
  ctx.restore();
}

function drawConnectingLine(ctx: CanvasRenderingContext2D, l: Layout, color: string, orbs: Orb[], gi: number, orbR: number) {
  const rowOrbs = orbs.filter(o => o.gi === gi);
  if (rowOrbs.length < 2) return;
  const x1 = rowOrbs[0].ox;
  const x2 = rowOrbs[rowOrbs.length - 1].ox;
  ctx.save();
  const g = ctx.createLinearGradient(x1, l.cy, x2, l.cy);
  g.addColorStop(0, color + '35');
  g.addColorStop(0.25, color + '60');
  g.addColorStop(0.75, color + '60');
  g.addColorStop(1, color + '35');
  ctx.strokeStyle = g;
  ctx.lineWidth = 1;
  ctx.shadowColor = color + '30';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.moveTo(x1 - orbR, l.cy);
  ctx.lineTo(x2 + orbR, l.cy);
  ctx.stroke();
  ctx.restore();
}

function drawVLine(ctx: CanvasRenderingContext2D, layouts: Layout[], pad: number) {
  if (layouts.length < 2) return;
  const lx = pad + 11;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 5]);
  ctx.beginPath();
  ctx.moveTo(lx, layouts[0].cy);
  ctx.lineTo(lx, layouts[layouts.length - 1].cy);
  ctx.stroke();
  ctx.restore();
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, s: Sizes) {
  const lx = x + (s.labW < 90 ? 6 : 11);
  ctx.save();
  ctx.fillStyle = color;
  const dotR = s.labW < 90 ? 2 : 3;
  ctx.beginPath();
  ctx.arc(lx, y, dotR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color + '30';
  ctx.beginPath();
  ctx.arc(lx, y, dotR * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = s.labFont;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), x + (s.labW < 90 ? 14 : 28), y);
  ctx.restore();
}

export function TechStackOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [groups, setGroups] = useState<PortfolioTechGroup[]>([]);
  const [dbWarning, setDbWarning] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mouse = { x: -9999, y: -9999 };
    let entranceStart: number | null = null;
    let hasAnimated = false;
    let isCanvasVisible = true;
    let orbs: Orb[] = [];
    let layouts: Layout[] = [];
    let w = 0;
    let h = 0;

    let s: Sizes = getSizes(container.clientWidth);

    const resize = () => {
      w = container.clientWidth;
      if (w === 0) return;
      const dpr = window.devicePixelRatio || 1;
      s = getSizes(w);
      layouts = getLayouts(s, w, groups);
      orbs = makeOrbs(s, layouts, groups);
      h = getCanvasHeight(s, layouts);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    if (!hasLoadedRef.current) {
      fetch('/api/portfolio')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data?.techStack)) {
            setGroups(data.techStack);
            setDbWarning(null);
          } else {
            setGroups([]);
            setDbWarning('Database content is unavailable.');
          }
        })
        .catch(() => {
          setGroups([]);
          setDbWarning('Database content is unavailable.');
        });
      hasLoadedRef.current = true;
    }

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    const visObserver = new IntersectionObserver(
      (entries) => {
        isCanvasVisible = entries[0]?.isIntersecting ?? true;
        if (isCanvasVisible) {
          entranceStart = null;
          raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0 }
    );
    visObserver.observe(container);

    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const leave = () => { mouse.x = -9999; mouse.y = -9999; };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);

    let raf: number;
    const loop = (time: number) => {
      if (!isCanvasVisible) { return; }
      if (w === 0 || h === 0) { raf = requestAnimationFrame(loop); return; }
      if (entranceStart === null) entranceStart = time;
      const entranceElapsed = time - entranceStart;
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, Math.max(w, h) * 0.65);
      bgGrad.addColorStop(0, '#111118');
      bgGrad.addColorStop(0.5, '#08080c');
      bgGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const ambX = mouse.x > 0 && mouse.x < w ? mouse.x : w * 0.5;
      const ambY = mouse.y > 0 && mouse.y < h ? mouse.y : h * 0.5;
      const cGrad = ctx.createRadialGradient(ambX, ambY, 0, ambX, ambY, Math.max(w, h) * 0.45);
      cGrad.addColorStop(0, 'rgba(255,255,255,0.04)');
      cGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = cGrad;
      ctx.fillRect(0, 0, w, h);

      const sweepX = ((time * 0.035) % (w + 400)) - 200;
      const sGrad = ctx.createRadialGradient(sweepX, h * 0.4, 0, sweepX, h * 0.4, 280);
      sGrad.addColorStop(0, 'rgba(255,255,255,0.015)');
      sGrad.addColorStop(0.5, 'rgba(255,255,255,0.005)');
      sGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sGrad;
      ctx.fillRect(0, 0, w, h);

      if (mouse.x > 0 && mouse.x < w && mouse.y > 0 && mouse.y < h) {
        ctx.save();
        const cr = Math.min(28, s.orbR * 0.67);
        const rGrad = ctx.createRadialGradient(mouse.x, mouse.y, 4, mouse.x, mouse.y, cr);
        rGrad.addColorStop(0, 'rgba(127,119,221,0.08)');
        rGrad.addColorStop(1, 'rgba(127,119,221,0)');
        ctx.fillStyle = rGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, cr, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(127,119,221,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, cr * 0.43, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      drawVLine(ctx, layouts, s.pad);

      for (let gi = 0; gi < groups.length; gi++) {
        const groupDelay = gi * 100;
        const et = Math.max(0, (entranceElapsed - groupDelay) / 400);
        const ea = Math.min(1, et * 2);
        if (ea < 0.01) continue;
        const l = layouts[gi];
        if (!l) continue;
        const g = groups[gi];
        ctx.globalAlpha = ea;
        drawConnectingLine(ctx, l, g.color, orbs, gi, s.orbR);
        drawLabel(ctx, g.name.toUpperCase(), s.pad, l.cy, g.color, s);
        ctx.globalAlpha = 1;
      }

      let nearestOrb: Orb | null = null;
      let nearestDist = Infinity;
      for (const orb of orbs) {
        const dx = mouse.x - orb.x;
        const dy = mouse.y - orb.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < nearestDist) { nearestDist = d2; nearestOrb = orb; }
      }

      for (const orb of orbs) {
        const groupDelay = orb.gi * 100;
        const et = Math.max(0, (entranceElapsed - groupDelay) / 400);
        const oa = Math.min(1, et * 2);
        if (oa < 0.01) continue;

        const dx = orb.x - mouse.x;
        const dy = orb.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < s.repR && dist > 1) {
          const t = 1 - (dist / s.repR);
          const force = t * t;
          orb.vx += (dx / dist) * force * 4;
          orb.vy += (dy / dist) * force * 4;
          orb.tint += (1 - orb.tint) * TINT_LERP;
        } else {
          orb.tint += (0 - orb.tint) * TINT_LERP;
        }

        orb.vx += (orb.ox - orb.x) * STIFFNESS;
        orb.vy += (orb.oy - orb.y) * STIFFNESS;
        orb.vx *= DAMPING;
        orb.vy *= DAMPING;
        orb.x += orb.vx;
        orb.y += orb.vy;

        const focusR = s.orbR * 5.2;
        if (orb === nearestOrb && nearestDist < focusR * focusR) {
          drawFocusGlow(ctx, orb.x, orb.y, s.orbR, orb.color, orb.tint);
        }

        const scale = 1 + (1 - oa) * 0.05;
        ctx.globalAlpha = oa;
        ctx.save();
        ctx.translate(orb.x, orb.y);
        ctx.scale(scale, scale);
        ctx.translate(-orb.x, -orb.y);
        drawOrb(ctx, orb.x, orb.y, s.orbR, orb.color, orb.name, orb.tint, orb.phase, time, s.font);
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      visObserver.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [groups]);

  return (
    <div ref={containerRef} className="w-full">
      {dbWarning && (
        <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {dbWarning}
        </div>
      )}
      <canvas ref={canvasRef} className="w-full" style={{ display: 'block' }} />
    </div>
  );
}
