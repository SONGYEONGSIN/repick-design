"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { formatPct, formatUSD, pctOfTotal, type RevNode } from "./data";
import { FOCUS, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/**
 * The required grade-C fallback for the sunburst: the same region > channel > tier
 * hierarchy as a plain indented, collapsible list with every percentage printed as
 * standing text. It is not a hidden accordion behind a toggle — it renders next to
 * the sunburst at all times, per the catalog's "list leads, sunburst supports" rule
 * for this chart grade. It shares the sunburst's focus/breadcrumb state (clicking a
 * row here drills exactly like clicking a wedge) but keeps its own expand/collapse
 * state, so a keyboard-only user can walk the whole tree without ever touching the
 * SVG — every row is a real, full-width, comfortably-sized <button>.
 */
export default function BreakdownList({
  root,
  focusPath,
  hoverId,
  onHover,
  onActivate,
}: {
  root: RevNode;
  focusPath: string[];
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onActivate: (node: RevNode) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set((root.children ?? []).map((c) => c.id)));

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <p className={cx("mb-1 flex items-baseline justify-between gap-2 rounded-lg px-2 py-1.5 text-[12.5px] font-semibold", TEXT_PRIMARY)}>
        <span>{root.label}</span>
        <span className={cx("text-[11px] font-normal", NUM, TEXT_AUX)}>{`100% · ${formatUSD(root.value)}`}</span>
      </p>
      <ul>
        {(root.children ?? []).map((node) => (
          <Row key={node.id} node={node} depth={0} focusPath={focusPath} hoverId={hoverId} onHover={onHover} onActivate={onActivate} expanded={expanded} toggle={toggle} />
        ))}
      </ul>
    </div>
  );
}

function Row({
  node,
  depth,
  focusPath,
  hoverId,
  onHover,
  onActivate,
  expanded,
  toggle,
}: {
  node: RevNode;
  depth: number;
  focusPath: string[];
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onActivate: (node: RevNode) => void;
  expanded: Set<string>;
  toggle: (id: string) => void;
}) {
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isOpen = expanded.has(node.id);
  const onFocusPath = focusPath.includes(node.id);
  const isHover = hoverId === node.id;
  const pct = pctOfTotal(node.value);

  return (
    <li>
      <div
        className={cx(
          "flex items-center gap-1.5 rounded-lg py-1",
          TRANSITION,
          onFocusPath ? "bg-violet-50" : isHover ? "bg-zinc-100" : "hover:bg-zinc-50",
        )}
        style={{ paddingLeft: 8 + depth * 18 }}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => toggle(node.id)}
            aria-expanded={isOpen}
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${node.label}`}
            className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700", TRANSITION, FOCUS)}
          >
            <ChevronRight size={13} aria-hidden="true" className={cx("transition-transform duration-150 motion-reduce:transition-none", isOpen && "rotate-90")} />
          </button>
        ) : (
          <span className="w-7 shrink-0" aria-hidden="true" />
        )}

        <button
          type="button"
          onClick={() => onActivate(node)}
          onFocus={() => onHover(node.id)}
          onBlur={() => onHover(null)}
          className={cx("flex min-h-8 min-w-0 flex-1 items-center justify-between gap-2 rounded-md px-1.5 py-1 text-left", TRANSITION, FOCUS)}
        >
          <span className={cx("truncate text-[12.5px]", onFocusPath ? "font-semibold text-violet-700" : cx("font-medium", TEXT_PRIMARY))}>{node.label}</span>
          <span className={cx("flex shrink-0 items-baseline gap-2 text-[11px]", NUM, onFocusPath ? "text-violet-700" : TEXT_AUX)}>
            <span className="font-semibold">{formatPct(pct)}</span>
            <span className="hidden sm:inline">{formatUSD(node.value)}</span>
          </span>
        </button>
      </div>

      {hasChildren && isOpen ? (
        <ul>
          {node.children!.map((child) => (
            <Row key={child.id} node={child} depth={depth + 1} focusPath={focusPath} hoverId={hoverId} onHover={onHover} onActivate={onActivate} expanded={expanded} toggle={toggle} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
