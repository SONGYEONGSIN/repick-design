"use client";

import { useRef, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { CheckCircle2, CircleDot, TrendingUp } from "lucide-react";
import { BIG_STEP, MAX_PRICE, STEP, clampPrice, formatPct, formatUsd, outcomeLabel, type Negotiation } from "./model";
import { ACCENT_HEX, CAPTION, DARK_INK, FOCUS_RING, INK, MUTED, PANEL, PANEL_BORDER } from "./tokens";

export type HandleId = "offer" | "ask";

interface NegotiatorProps {
  offer: number;
  ask: number;
  result: Negotiation;
  onChange: (id: HandleId, value: number) => void;
}

const HANDLE_META: Record<HandleId, { label: string; shortLabel: string }> = {
  offer: { label: "Your offer", shortLabel: "Offer" },
  ask: { label: "Seller's minimum", shortLabel: "Ask" },
};

/**
 * The device: one shared horizontal axis from $0–MAX_PRICE carrying two independently draggable
 * handles. Both render on the same pixel scale (a single track), not two separate bars — the band
 * between them IS the gap, drawn once, so moving either handle visibly stretches or closes the same
 * region rather than updating two unrelated gauges.
 */
export function Negotiator({ offer, ask, result, onChange }: NegotiatorProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>, id: HandleId) => {
    event.preventDefault();
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();

    const handleMove = (moveEvent: PointerEvent) => {
      const pct = (moveEvent.clientX - rect.left) / rect.width;
      onChange(id, clampPrice(pct * MAX_PRICE));
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>, id: HandleId, current: number) => {
    const step = event.shiftKey ? BIG_STEP : STEP;
    let next: number | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = current - step;
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") next = current + step;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = MAX_PRICE;
    if (next === null) return;
    event.preventDefault();
    onChange(id, clampPrice(next));
  };

  const offerPct = (offer / MAX_PRICE) * 100;
  const askPct = (ask / MAX_PRICE) * 100;
  const bandLeftPct = Math.min(offerPct, askPct);
  const bandWidthPct = Math.abs(askPct - offerPct);

  // Band fill opacity is a deterministic function of the outcome — never random, never fixed —
  // so the same two handle values always paint the same band every render.
  const bandOpacity = result.outcome === "at-or-above-ask" ? 1 : result.outcome === "likely" ? 0.65 : 0.28;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className={CAPTION} style={{ color: ACCENT_HEX }}>
          Gap: {formatUsd(result.gap)} ({formatPct(result.gapPct)} of ask)
        </p>
        <OutcomeChip result={result} />
      </div>

      <div ref={trackRef} className="relative mt-4 h-16 w-full select-none" style={{ touchAction: "none" }}>
        <div
          className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 overflow-hidden rounded-full"
          style={{ backgroundColor: PANEL, border: `1px solid ${PANEL_BORDER}` }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-y-0 rounded-full transition-[left,width] duration-150 ease-out"
            style={{
              left: `${bandLeftPct}%`,
              width: `${bandWidthPct}%`,
              backgroundColor: ACCENT_HEX,
              opacity: bandOpacity,
            }}
          />
        </div>

        <PriceHandle
          id="offer"
          value={offer}
          pct={offerPct}
          variant="filled"
          onPointerDown={(event) => handlePointerDown(event, "offer")}
          onKeyDown={(event) => handleKeyDown(event, "offer", offer)}
        />
        <PriceHandle
          id="ask"
          value={ask}
          pct={askPct}
          variant="ring"
          onPointerDown={(event) => handlePointerDown(event, "ask")}
          onKeyDown={(event) => handleKeyDown(event, "ask", ask)}
        />
      </div>

      <div className="mt-2 flex items-center justify-between" aria-hidden="true">
        <span className={`text-[11px] ${MUTED}`} style={{ fontVariantNumeric: "tabular-nums" }}>
          $0
        </span>
        <span className={`text-[11px] ${MUTED}`} style={{ fontVariantNumeric: "tabular-nums" }}>
          ${MAX_PRICE.toLocaleString("en-US")}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <HandleReadout id="offer" value={offer} variant="filled" />
        <HandleReadout id="ask" value={ask} variant="ring" />
      </div>
    </div>
  );
}

interface PriceHandleProps {
  id: HandleId;
  value: number;
  pct: number;
  variant: "filled" | "ring";
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
}

function PriceHandle({ id, value, pct, variant, onPointerDown, onKeyDown }: PriceHandleProps) {
  const meta = HANDLE_META[id];
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={MAX_PRICE}
      aria-valuenow={value}
      aria-valuetext={`${formatUsd(value)} — ${meta.label}`}
      aria-label={meta.label}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={`absolute top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full active:cursor-grabbing ${FOCUS_RING}`}
      style={{
        left: `${pct}%`,
        backgroundColor: variant === "filled" ? ACCENT_HEX : PANEL,
        border: variant === "filled" ? `2px solid ${DARK_INK}` : `3px solid ${ACCENT_HEX}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
      }}
    >
      {variant === "filled" ? (
        <CircleDot className="h-3.5 w-3.5" style={{ color: DARK_INK }} aria-hidden="true" />
      ) : null}
    </div>
  );
}

function HandleReadout({ id, value, variant }: { id: HandleId; value: number; variant: "filled" | "ring" }) {
  const meta = HANDLE_META[id];
  return (
    <div
      className="flex items-center justify-between gap-2 rounded-xl px-3 py-2"
      style={{ backgroundColor: PANEL, border: `1px solid ${PANEL_BORDER}` }}
    >
      <span className="flex min-w-0 items-center gap-2 text-[12px] font-semibold" style={{ color: INK }}>
        <span
          aria-hidden="true"
          className="h-3 w-3 shrink-0 rounded-full"
          style={{
            backgroundColor: variant === "filled" ? ACCENT_HEX : "transparent",
            border: variant === "filled" ? `1px solid ${DARK_INK}` : `2px solid ${ACCENT_HEX}`,
          }}
        />
        {meta.label}
      </span>
      <span className="shrink-0 text-[13px] font-extrabold" style={{ color: INK, fontVariantNumeric: "tabular-nums" }}>
        {formatUsd(value)}
      </span>
    </div>
  );
}

function OutcomeChip({ result }: { result: Negotiation }) {
  const label = outcomeLabel(result.outcome);
  const Icon = result.outcome === "too-wide" ? TrendingUp : CheckCircle2;
  const isPositive = result.outcome !== "too-wide";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
      style={{
        backgroundColor: isPositive ? ACCENT_HEX : PANEL,
        color: isPositive ? DARK_INK : INK,
        border: isPositive ? "none" : `1px solid ${PANEL_BORDER}`,
      }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
