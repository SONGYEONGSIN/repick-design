import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { TIERS, type TierId } from "./data";

interface QuadrantPlotProps {
  x: number; // price priority, 0-100
  y: number; // urgency, 0-100
  recommendedId: TierId;
}

const MARKER_SIZE = 14;
const FALLBACK_BOX = 260; // matches this component's rendered size before ResizeObserver fires

/**
 * The hero's core proof device: a restrained 2-axis plot. Four fixed reference points
 * (the service tiers) sit at fixed coordinates; one live marker moves continuously as the
 * two sliders change, and whichever fixed point it is nearest gets a non-color highlight
 * (ring + check icon + bolder label) — never color alone.
 *
 * Marked aria-hidden: the same information is always available as plain, non-hidden text —
 * the two range inputs' own values and the live explanation paragraph rendered alongside it.
 */
export default function QuadrantPlot({ x, y, recommendedId }: QuadrantPlotProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState(FALLBACK_BOX);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setBox(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const markerX = (x / 100) * box - MARKER_SIZE / 2;
  const markerY = ((100 - y) / 100) * box - MARKER_SIZE / 2;

  return (
    <div aria-hidden="true" className="w-full max-w-[260px] mx-auto sm:mx-0">
      <div
        ref={boxRef}
        className="relative aspect-square w-full overflow-visible rounded-2xl border border-zinc-200 bg-zinc-50"
      >
        {/* Center gridlines — decorative structure only */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-zinc-200" />
        <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-zinc-200" />

        {/* Corner axis tags */}
        <span className="absolute left-2 top-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Urgent ↑
        </span>
        <span className="absolute bottom-2 left-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Patient ↓
        </span>

        {/* Fixed reference points */}
        {TIERS.map((tier) => {
          const isRecommended = tier.id === recommendedId;
          return (
            <div
              key={tier.id}
              style={{ left: `${tier.x}%`, top: `${100 - tier.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={[
                    "h-2.5 w-2.5 rounded-full border-2",
                    isRecommended ? "border-sky-700 bg-sky-100" : "border-zinc-400 bg-white",
                  ].join(" ")}
                />
                <span
                  className={[
                    "inline-flex items-center gap-0.5 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[9px] leading-none",
                    isRecommended
                      ? "border-sky-700 bg-white font-semibold text-sky-700"
                      : "border-zinc-200 bg-white font-normal text-zinc-500",
                  ].join(" ")}
                >
                  {isRecommended && <CheckCircle2 className="h-2.5 w-2.5" />}
                  {tier.name}
                </span>
              </div>
            </div>
          );
        })}

        {/* Live marker — the only element that moves; animated via transform, never left/top */}
        <motion.div
          className="absolute left-0 top-0 h-[14px] w-[14px] rounded-full border-2 border-white bg-sky-600 shadow-[0_1px_4px_rgba(2,132,199,0.5)]"
          animate={{ x: markerX, y: markerY }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        <span>Lower price priority</span>
        <span>Higher price priority →</span>
      </div>
    </div>
  );
}
