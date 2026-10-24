"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ShieldAlert } from "lucide-react";
import {
  FAILED_VERIFICATION_COUNT,
  GRADE_STEPS,
  MATCHED_COUNT,
  POOL_COUNT,
  SEARCH_QUERY,
  TIERS,
  type Outcomes,
} from "./data";
import { ACCENT, ACCENT_RIBBON, BODY_SM, CAPTION } from "./tokens";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Visual bar height in px for a raw count. Square-root scaled (not linear):
// the raw counts span a ~68x range (27 to 1,842) and a linear scale makes
// every column but "Listings scanned" collapse to a hairline. Square-root
// compression keeps every node visibly distinct and still strictly ordered
// (bigger count -> taller bar) — the real integer counts are always printed
// as text next to the bar, so nothing about the underlying numbers is hidden
// or implied false by the compression.
const MAX_BAR_PX = 200;
const MIN_BAR_PX = 8;
const SCALE = MAX_BAR_PX / Math.sqrt(POOL_COUNT);
function barPx(value: number) {
  return Math.max(MIN_BAR_PX, Math.round(SCALE * Math.sqrt(value)));
}

type LinkDatum = {
  id: string;
  from: string;
  to: string;
  variant: "accent" | "neutral";
};

function buildLinks(minGradeIndex: number): LinkDatum[] {
  const links: LinkDatum[] = [{ id: "pool-matched", from: "pool", to: "matched", variant: "neutral" }];
  TIERS.forEach((t) => {
    links.push({ id: `matched-${t.id}`, from: "matched", to: `tier-${t.id}`, variant: "neutral" });
  });
  links.push({ id: "matched-failed", from: "matched", to: "tier-failed", variant: "neutral" });
  TIERS.forEach((t) => {
    const toRecommended = t.order >= minGradeIndex;
    links.push({
      id: `${t.id}-out`,
      from: `tier-${t.id}`,
      to: toRecommended ? "out-recommended" : "out-heldback",
      variant: toRecommended ? "accent" : "neutral",
    });
  });
  links.push({ id: "failed-out", from: "tier-failed", to: "out-notverified", variant: "neutral" });
  return links;
}

const TIER_BAR_CLASS: Record<number, string> = {
  0: "bg-zinc-300",
  1: "bg-zinc-500",
  2: "bg-zinc-700",
  3: "bg-zinc-900",
};

type NodeDatum = {
  id: string;
  label: string;
  value: number;
  sublabel: string;
  barClassName?: string;
  barColor?: string;
};

function NodeRow({
  node,
  registerRef,
  emphasis = false,
}: {
  node: NodeDatum;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        ref={(el) => registerRef(node.id, el)}
        aria-hidden="true"
        className={`w-2.5 flex-none rounded-sm ${node.barClassName ?? "bg-zinc-800"}`}
        style={{ height: barPx(node.value), backgroundColor: node.barColor }}
      />
      <div className="min-w-0">
        <p
          className={`truncate font-semibold ${
            emphasis ? "text-[15px]" : "text-sm"
          } text-[#111113]`}
        >
          {node.label}
        </p>
        <p className="text-xs leading-snug text-zinc-600">
          <span className="font-semibold tabular-nums text-[#111113]">
            {node.value.toLocaleString("en-US")}
          </span>{" "}
          {node.sublabel}
        </p>
      </div>
    </div>
  );
}

export default function FlowDiagram({
  minGradeIndex,
  onChange,
  outcomes,
}: {
  minGradeIndex: number;
  onChange: (index: number) => void;
  outcomes: Outcomes;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState<{ id: string; d: string; accent: boolean }[]>([]);

  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    setBox({ w: cRect.width, h: cRect.height });
    if (cRect.width === 0 || cRect.height === 0) return;

    const rectOf = (id: string) => {
      const el = nodeRefs.current.get(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left: r.left - cRect.left,
        right: r.right - cRect.left,
        top: r.top - cRect.top,
        bottom: r.bottom - cRect.top,
      };
    };

    const next = buildLinks(minGradeIndex)
      .map((link) => {
        const s = rectOf(link.from);
        const t = rectOf(link.to);
        if (!s || !t) return null;
        const mx = (s.right + t.left) / 2;
        const d = `M${s.right},${s.top} C${mx},${s.top} ${mx},${t.top} ${t.left},${t.top} L${t.left},${t.bottom} C${mx},${t.bottom} ${mx},${s.bottom} ${s.right},${s.bottom} Z`;
        return { id: link.id, d, accent: link.variant === "accent" };
      })
      .filter((v): v is { id: string; d: string; accent: boolean } => v !== null);

    setPaths(next);
  }, [minGradeIndex]);

  useIsomorphicLayoutEffect(() => {
    recompute();
  }, [recompute]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => recompute());
    ro.observe(el);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [recompute]);

  const col0: NodeDatum[] = [
    {
      id: "pool",
      label: "Listings scanned",
      value: POOL_COUNT,
      sublabel: `match "${SEARCH_QUERY}"`,
    },
  ];
  const col1: NodeDatum[] = [
    {
      id: "matched",
      label: "AI-matched candidates",
      value: MATCHED_COUNT,
      sublabel: "clear the intent-match threshold",
    },
  ];
  const col2: NodeDatum[] = [
    ...TIERS.map((t) => ({
      id: `tier-${t.id}`,
      label: t.grade,
      value: t.count,
      sublabel: `graded · ${t.avgMatch}% avg match`,
      barClassName: TIER_BAR_CLASS[t.order],
    })),
    {
      id: "tier-failed",
      label: "Failed verification",
      value: FAILED_VERIFICATION_COUNT,
      sublabel: "seller or item unauthenticated",
      barClassName: "bg-zinc-200",
    },
  ];
  const col3: NodeDatum[] = [
    {
      id: "out-recommended",
      label: "Recommended to you",
      value: outcomes.recommended.count,
      sublabel: `${outcomes.recommended.avgMatch}% match · ${outcomes.recommended.avgDiscount}% off avg`,
      barColor: ACCENT,
    },
    {
      id: "out-heldback",
      label: "Held back for now",
      value: outcomes.heldBack.count,
      sublabel: `below ${outcomes.minGrade} minimum`,
      barClassName: "bg-zinc-400",
    },
    {
      id: "out-notverified",
      label: "Not verified",
      value: outcomes.notVerified.count,
      sublabel: "never reaches a buyer",
      barClassName: "bg-zinc-200",
    },
  ];

  const columns: { id: string; title: string; folio: string; nodes: NodeDatum[] }[] = [
    { id: "c0", title: "Search intent", folio: "01", nodes: col0 },
    { id: "c1", title: "AI matching", folio: "02", nodes: col1 },
    { id: "c2", title: "Condition & authenticity", folio: "03", nodes: col2 },
    { id: "c3", title: "Your shortlist", folio: "04", nodes: col3 },
  ];

  return (
    <div>
      {/* Minimum-grade slider — the manipulation that re-routes the flow */}
      <div className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor="min-grade" className="text-sm font-semibold text-[#111113]">
            Minimum condition grade to recommend
          </label>
          <span className="text-sm font-semibold tabular-nums" style={{ color: ACCENT }}>
            {outcomes.minGrade} or better
          </span>
        </div>
        <input
          id="min-grade"
          type="range"
          min={0}
          max={GRADE_STEPS.length - 1}
          step={1}
          value={minGradeIndex}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-describedby="min-grade-helper"
          aria-valuetext={`${outcomes.minGrade} or better`}
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-[#BE185D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE185D]"
        />
        <div className="mt-2 grid grid-cols-4 text-xs text-zinc-600">
          {GRADE_STEPS.map((step, i) => (
            <span
              key={step.grade}
              className={`${i === 0 ? "text-left" : i === GRADE_STEPS.length - 1 ? "text-right" : "text-center"} ${
                i === minGradeIndex ? "font-semibold text-[#111113]" : ""
              }`}
            >
              {step.grade}
            </span>
          ))}
        </div>
        <p id="min-grade-helper" className={`mt-3 ${CAPTION}`}>
          {GRADE_STEPS[minGradeIndex].helper}. Drag right to raise the bar — every listing
          below it moves from &ldquo;Recommended&rdquo; to &ldquo;Held back&rdquo; below, live.
        </p>
      </div>

      {/* Live-announced summary, independent of the diagram's visuals */}
      <p aria-live="polite" className={`mt-4 ${BODY_SM}`}>
        At <strong className="font-semibold text-[#111113]">{outcomes.minGrade} or better</strong>:{" "}
        <strong className="font-semibold text-[#111113]">{outcomes.recommended.count}</strong>{" "}
        recommended, averaging{" "}
        <strong className="font-semibold text-[#111113]">{outcomes.recommended.avgMatch}%</strong>{" "}
        match and{" "}
        <strong className="font-semibold text-[#111113]">{outcomes.recommended.avgDiscount}%</strong>{" "}
        off retail ·{" "}
        <strong className="font-semibold text-[#111113]">{outcomes.heldBack.count}</strong> held
        back for now.
      </p>

      {/* The diagram itself. Ribbons (SVG, decorative) sit behind real HTML
          node labels/values, so every number is a normal accessible text
          node regardless of whether the measurement effect has run. */}
      <div className="mt-6 -mx-4 overflow-x-auto px-4 pb-2" tabIndex={0} aria-label="Search-to-shortlist flow diagram, scrollable">
        <div ref={containerRef} className="relative grid min-w-[680px] grid-cols-4 gap-5">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-150 motion-reduce:transition-none"
            viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
            preserveAspectRatio="none"
          >
            {paths.map((p) => (
              <path key={p.id} d={p.d} fill={p.accent ? ACCENT_RIBBON : "rgba(24,24,27,0.09)"} />
            ))}
          </svg>

          {columns.map((col) => (
            <div key={col.id} className="relative z-10 min-w-0">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                <span className="tabular-nums" aria-hidden="true">
                  {col.folio}
                </span>
                {col.title}
              </p>
              <div className="mt-4 flex min-h-[220px] flex-col justify-center gap-3">
                {col.nodes.map((node) => (
                  <NodeRow key={node.id} node={node} registerRef={registerRef} emphasis={col.nodes.length === 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-zinc-500 md:hidden">Scroll to see the full pipeline.</p>

      <div className="mt-6 flex items-start gap-2 rounded-xl border border-zinc-200 bg-white p-4">
        <ShieldAlert className="mt-0.5 h-4 w-4 flex-none text-zinc-500" aria-hidden="true" strokeWidth={2} />
        <span className={CAPTION}>
          <span className="font-semibold text-zinc-700">{FAILED_VERIFICATION_COUNT} listings</span> never
          reach a buyer at any grade setting — they failed authenticity or seller verification
          before condition grading even runs, and that count does not move with the slider above.
        </span>
      </div>
    </div>
  );
}
