"use client";

import { useEffect, useRef } from "react";
import { LATTICE, latticePhase } from "./data";

/**
 * Pointer-driven lattice — the dala-style "living background" without the parts that break our gate.
 *
 * Deliberate constraints:
 * - No time base. The field is a pure function of pointer position — no wall-clock reads, no
 *   animation timer — so a screenshot taken at rest is always the same image.
 * - Redraws only while the pointer moves (and once on mount/resize), so an idle tab costs nothing.
 * - `prefers-reduced-motion` freezes it at the rest state instead of following the pointer.
 * - Purely decorative → `aria-hidden`, and it never intercepts pointer events.
 */
export default function LatticeField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;

    function draw() {
      frame = 0;
      const el = ref.current;
      const box = host!.getBoundingClientRect();
      if (!el || !ctx || box.width === 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (el.width !== Math.round(box.width * dpr) || el.height !== Math.round(box.height * dpr)) {
        el.width = Math.round(box.width * dpr);
        el.height = Math.round(box.height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, box.width, box.height);

      const cols = Math.ceil(box.width / LATTICE.gap) + 1;
      const rows = Math.ceil(box.height / LATTICE.gap) + 1;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const baseX = c * LATTICE.gap;
          const baseY = r * LATTICE.gap;
          const phase = latticePhase(c, r);
          let x = baseX;
          let y = baseY + phase * 3;
          let strength = 0;
          if (pointer) {
            const dx = baseX - pointer.x;
            const dy = baseY - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < LATTICE.influence && dist > 0.001) {
              strength = 1 - dist / LATTICE.influence;
              const push = strength * LATTICE.maxPush;
              x += (dx / dist) * push;
              y += (dy / dist) * push;
            }
          }
          ctx.beginPath();
          ctx.arc(x, y, LATTICE.radius + strength * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(0.12 + strength * 0.55).toFixed(3)})`;
          ctx.fill();
        }
      }
    }

    function schedule() {
      if (frame) return;
      frame = requestAnimationFrame(draw);
    }
    function onPointer(e: PointerEvent) {
      if (reduce.matches) return;
      const box = host!.getBoundingClientRect();
      pointer = { x: e.clientX - box.left, y: e.clientY - box.top };
      schedule();
    }
    function onLeave() {
      pointer = null;
      schedule();
    }

    draw();
    const ro = new ResizeObserver(() => schedule());
    ro.observe(host);
    host.addEventListener("pointermove", onPointer);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
