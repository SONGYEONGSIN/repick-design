"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { BadgeCheck, GripVertical, RotateCcw, ShieldCheck, Sparkles, Tag } from "lucide-react";
import {
  CATEGORY_ITEMS,
  DISCOUNT_DEFAULT,
  DISCOUNT_MAX,
  DISCOUNT_MIN,
  DISCOUNT_STEP,
  DISCOUNT_STEP_LARGE,
  MAIN_ITEM,
  discountForTravel,
  formatUsd,
  repickPrice,
  savingsAmount,
  travelForDiscount,
} from "./data";
import { ACCENT_FILL, ACCENT_TEXT, CAPTION, FOCUS_RING, MUTED_TEXT, ON_ACCENT_FILL_TEXT, SURFACE, SURFACE_ACCENT } from "./tokens";

const SLIDER_LABEL_ID = "discount-slider-label";

export function SavingsSplit({
  discount,
  onDiscountChange,
}: {
  discount: number;
  onDiscountChange: (next: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const travel = travelForDiscount(discount); // left ("Buying new") panel share of the width, 30-70

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;
      const rawPct = ((clientX - rect.left) / rect.width) * 100;
      onDiscountChange(discountForTravel(rawPct));
    },
    [onDiscountChange],
  );

  useEffect(() => {
    if (!dragging) return;
    function handleMove(e: PointerEvent) {
      updateFromClientX(e.clientX);
    }
    function handleUp() {
      setDragging(false);
    }
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [dragging, updateFromClientX]);

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.focus();
    setDragging(true);
    updateFromClientX(e.clientX);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? DISCOUNT_STEP_LARGE : DISCOUNT_STEP;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        onDiscountChange(Math.max(DISCOUNT_MIN, discount - step));
        break;
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        onDiscountChange(Math.min(DISCOUNT_MAX, discount + step));
        break;
      case "PageDown":
        e.preventDefault();
        onDiscountChange(Math.max(DISCOUNT_MIN, discount - DISCOUNT_STEP_LARGE));
        break;
      case "PageUp":
        e.preventDefault();
        onDiscountChange(Math.min(DISCOUNT_MAX, discount + DISCOUNT_STEP_LARGE));
        break;
      case "Home":
        e.preventDefault();
        onDiscountChange(DISCOUNT_MIN);
        break;
      case "End":
        e.preventDefault();
        onDiscountChange(DISCOUNT_MAX);
        break;
      default:
        break;
    }
  }

  const repick = repickPrice(MAIN_ITEM.newPrice, discount);
  const saved = savingsAmount(MAIN_ITEM.newPrice, discount);
  const transitionClass = dragging ? "" : "transition-[flex-basis] duration-150 ease-out motion-reduce:transition-none";
  const handleTransitionStyle: CSSProperties = dragging ? {} : { transition: "left 150ms ease-out" };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id={SLIDER_LABEL_ID} className="text-sm font-semibold tracking-[0.02em] text-[#F4F4F5]">
          Assumed resale discount
        </p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tabular-nums text-[#F4F4F5]" aria-hidden="true">
            {discount}%
          </span>
          <button
            type="button"
            onClick={() => onDiscountChange(DISCOUNT_DEFAULT)}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs font-semibold text-zinc-400 transition-colors duration-200 hover:text-[#F4F4F5] ${FOCUS_RING}`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset to typical
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative mt-4 flex flex-col rounded-2xl border border-white/10 sm:flex-row sm:items-stretch"
      >
        {/* Buying new panel */}
        <div
          className={`order-1 min-w-0 shrink-0 basis-auto rounded-t-2xl p-5 sm:order-none sm:rounded-l-2xl sm:rounded-t-none sm:p-6 sm:[flex-basis:var(--left-basis)] ${transitionClass}`}
          style={{ backgroundColor: SURFACE, "--left-basis": `${travel}%` } as CSSProperties}
        >
          <p className={`${CAPTION} ${MUTED_TEXT}`}>Buying new</p>
          <div className="mt-4 flex gap-4">
            <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg bg-[#1C1C22] sm:w-28">
              <Image src={MAIN_ITEM.image} alt={MAIN_ITEM.alt} fill sizes="160px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#F4F4F5]">{MAIN_ITEM.title}</p>
              <p className={`text-xs font-normal ${MUTED_TEXT}`}>{MAIN_ITEM.brand}</p>
              <p className="mt-2 text-3xl font-extrabold tabular-nums leading-none text-[#F4F4F5] sm:text-4xl">
                {formatUsd(MAIN_ITEM.newPrice)}
              </p>
            </div>
          </div>

          <ul className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4">
            {CATEGORY_ITEMS.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <span className={`min-w-0 truncate font-normal ${MUTED_TEXT}`}>{item.label}</span>
                <span className="shrink-0 font-semibold tabular-nums text-[#F4F4F5]">{formatUsd(item.newPrice)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider handle -- a real flex item (horizontal rail) when panels stack on mobile, an
            absolute full-bleed overlay (vertical line) once panels sit side by side at sm+. The
            bounding rect used for pointer math is always the outer container's, above, so the
            math is identical in both layouts. */}
        <div className="relative order-2 h-14 w-full shrink-0 sm:absolute sm:inset-y-0 sm:left-0 sm:right-0 sm:order-none sm:h-auto sm:w-auto">
          {/* decorative rail (mobile: horizontal, desktop: vertical), drawn only across the travel band */}
          <div
            aria-hidden="true"
            className="absolute left-[30%] right-[30%] top-1/2 h-px -translate-y-1/2 bg-white/15 sm:left-0 sm:right-0 sm:top-[18%] sm:bottom-[18%] sm:h-auto sm:w-px sm:translate-y-0"
          />

          <div
            role="slider"
            tabIndex={0}
            aria-labelledby={SLIDER_LABEL_ID}
            aria-valuemin={DISCOUNT_MIN}
            aria-valuemax={DISCOUNT_MAX}
            aria-valuenow={discount}
            aria-valuetext={`${discount}% assumed discount -- saves ${formatUsd(saved)} on the ${formatUsd(MAIN_ITEM.newPrice)} overcoat`}
            aria-orientation="horizontal"
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            className={`absolute top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 -translate-x-1/2 cursor-grab touch-none items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-xs font-extrabold tabular-nums shadow-[0_2px_10px_rgba(0,0,0,0.35)] active:cursor-grabbing ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} ${FOCUS_RING}`}
            style={{ left: `${travel}%`, ...handleTransitionStyle }}
          >
            <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
            <span aria-live="polite">Save {formatUsd(saved)}</span>
          </div>
        </div>

        {/* On repick panel */}
        <div
          className={`order-3 min-w-0 flex-1 basis-auto rounded-b-2xl p-5 sm:order-none sm:rounded-b-none sm:rounded-r-2xl sm:p-6 ${transitionClass}`}
          style={{ backgroundColor: SURFACE_ACCENT }}
        >
          <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${ACCENT_TEXT}`}>On repick</p>
          <div className="mt-4 flex gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#F4F4F5]">{MAIN_ITEM.title}</p>
              <p className={`text-xs font-normal ${MUTED_TEXT}`}>
                {MAIN_ITEM.conditionGrade} condition{MAIN_ITEM.verified ? " · verified seller" : ""}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-sm font-normal ${MUTED_TEXT} line-through`}>{formatUsd(MAIN_ITEM.newPrice)}</span>
                <span className="text-3xl font-extrabold tabular-nums leading-none text-[#F4F4F5] sm:text-4xl">
                  {formatUsd(repick)}
                </span>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg bg-[#1C1C22] sm:w-28">
              <Image src={MAIN_ITEM.image} alt="" fill sizes="160px" className="object-cover" />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT}`}>
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {MAIN_ITEM.matchPercent}% match
            </span>
            <span className="inline-flex items-center rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#F4F4F5]">
              <Tag className="mr-1 h-3 w-3" aria-hidden="true" />
              -{discount}%
            </span>
            {MAIN_ITEM.verified && (
              <span className={`inline-flex items-center gap-1 rounded-full border border-[#84CC16]/40 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${ACCENT_TEXT}`}>
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            )}
          </div>

          <ul className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4">
            {CATEGORY_ITEMS.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <span className={`min-w-0 truncate font-normal ${MUTED_TEXT}`}>{item.label}</span>
                <span className="shrink-0 font-semibold tabular-nums text-[#F4F4F5]">
                  {formatUsd(repickPrice(item.newPrice, discount))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className={`mt-3 flex items-center gap-1.5 text-xs font-normal ${MUTED_TEXT}`}>
        <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Drag the badge, or focus it and use the arrow keys (Shift for 5-point jumps, Home/End for the ends).
      </p>
    </div>
  );
}
