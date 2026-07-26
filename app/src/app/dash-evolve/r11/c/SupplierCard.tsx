"use client";

import { Check, Clock3, MapPin, Plus, Star } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  CAPABILITY_META,
  CATEGORY_META,
  PRICE_BAND_META,
  REGION_META,
  numberFmt,
  unsplashPhoto,
  type Supplier,
} from "./data";
import { ACCENT_TEXT, BORDER, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, TRANSITION_MOTION, cx } from "./tokens";
import { VerifiedBadge } from "./ui";

function ScoreBadge({ score, reviewCount }: { score: number; reviewCount: number }) {
  const top = score >= 4.5;
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
      <Star
        size={14}
        aria-hidden="true"
        className={top ? "fill-emerald-500 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400" : "fill-zinc-300 text-zinc-400 dark:fill-zinc-600 dark:text-zinc-500"}
      />
      <span className={cx("text-sm font-semibold", NUM, top ? ACCENT_TEXT : TEXT_PRIMARY)}>{score.toFixed(1)}</span>
      <span className={cx("text-xs", NUM, TEXT_CAPTION)}>({numberFmt.format(reviewCount)})</span>
      {top ? <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">Top rated</span> : null}
    </div>
  );
}

function StatChip({ children }: { children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium", BORDER, "bg-zinc-50 dark:bg-white/5", TEXT_SECONDARY)}>{children}</span>
  );
}

export function CompareToggle({ checked, disabled, onClick, className }: { checked: boolean; disabled: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-disabled={disabled && !checked}
      onClick={onClick}
      title={disabled && !checked ? "Compare tray full (4/4) — remove one to add another" : undefined}
      className={cx(
        "flex min-h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-xs font-semibold",
        TRANSITION,
        FOCUS_RING,
        checked
          ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-500 dark:border-blue-400 dark:bg-blue-500"
          : disabled
            ? cx(BORDER, "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-white/5 dark:text-zinc-500")
            : cx(BORDER, "bg-white text-zinc-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"),
        className,
      )}
    >
      {checked ? <Check size={13} aria-hidden="true" /> : <Plus size={13} aria-hidden="true" />}
      {checked ? "In compare" : disabled ? "Tray full" : "Compare"}
    </button>
  );
}

export function SupplierCard({ supplier, compareChecked, compareDisabled, onToggleCompare }: { supplier: Supplier; compareChecked: boolean; compareDisabled: boolean; onToggleCompare: () => void }) {
  const shownCaps = supplier.capabilities.slice(0, 2);
  const extraCaps = supplier.capabilities.length - shownCaps.length;

  return (
    <li
      className={cx(
        "flex h-full flex-col gap-3 rounded-2xl border p-4",
        BORDER,
        "bg-white dark:bg-zinc-900",
        "shadow-sm shadow-zinc-900/5 dark:shadow-black/20",
        TRANSITION_MOTION,
        "hover:-translate-y-0.5 hover:shadow-md hover:shadow-zinc-900/10 dark:hover:shadow-black/30",
      )}
    >
      <div className="flex items-start gap-3">
        <Image
          src={unsplashPhoto(supplier.photoId, 96)}
          alt={`Portrait of ${supplier.contactName}, ${supplier.contactRole.toLowerCase()} at ${supplier.name}`}
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-xl border border-zinc-200 object-cover dark:border-white/10"
        />
        <div className="min-w-0 flex-1">
          <h3 className={cx("truncate text-sm font-semibold leading-snug", TEXT_PRIMARY)}>{supplier.name}</h3>
          <p className={cx("mt-0.5 flex items-center gap-1 truncate text-xs", TEXT_CAPTION)}>
            <MapPin size={11} aria-hidden="true" className="shrink-0" />
            {supplier.city}, {supplier.country}
          </p>
        </div>
      </div>

      <ScoreBadge score={supplier.score} reviewCount={supplier.reviewCount} />

      <div className="flex flex-wrap items-center gap-1.5">
        <StatChip>{CATEGORY_META[supplier.category].label}</StatChip>
        <StatChip>{REGION_META[supplier.region].label}</StatChip>
        <StatChip>
          {PRICE_BAND_META[supplier.priceBand].symbol} {PRICE_BAND_META[supplier.priceBand].label}
        </StatChip>
      </div>

      <div className={cx("flex flex-wrap items-center gap-x-3 gap-y-1 text-xs", TEXT_SECONDARY)}>
        <span className="inline-flex items-center gap-1">
          <Clock3 size={12} aria-hidden="true" className={TEXT_CAPTION} />
          <span className={NUM}>{supplier.leadTimeDays}d</span> lead
        </span>
        <span className={NUM}>MOQ {numberFmt.format(supplier.minOrderUnits)}</span>
        <VerifiedBadge verified={supplier.verified} />
      </div>

      <p className={cx("line-clamp-2 text-xs leading-relaxed", TEXT_SECONDARY)}>{supplier.blurb}</p>

      <div className="mt-auto flex flex-wrap items-center gap-1">
        {shownCaps.map((c) => (
          <span key={c} className={cx("rounded-full px-2 py-0.5 text-[10px] font-medium", "bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-400")}>
            {CAPABILITY_META[c].label}
          </span>
        ))}
        {extraCaps > 0 ? <span className={cx("text-[10px] font-medium", TEXT_CAPTION)}>+{extraCaps} more</span> : null}
      </div>

      <CompareToggle checked={compareChecked} disabled={compareDisabled} onClick={onToggleCompare} className="w-full" />
    </li>
  );
}

export function SupplierRow({ supplier, compareChecked, compareDisabled, onToggleCompare }: { supplier: Supplier; compareChecked: boolean; compareDisabled: boolean; onToggleCompare: () => void }) {
  return (
    <li className={cx("flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-3.5", BORDER, "hover:bg-zinc-50 dark:hover:bg-white/[0.03]", TRANSITION)}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Image
          src={unsplashPhoto(supplier.photoId, 80)}
          alt={`Portrait of ${supplier.contactName}, ${supplier.contactRole.toLowerCase()} at ${supplier.name}`}
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-lg border border-zinc-200 object-cover dark:border-white/10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <h3 className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{supplier.name}</h3>
            <VerifiedBadge verified={supplier.verified} />
          </div>
          <p className={cx("truncate text-xs", TEXT_CAPTION)}>
            {CATEGORY_META[supplier.category].label} · {REGION_META[supplier.region].label} · {supplier.city}, {supplier.country}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1.5 sm:justify-end">
        <ScoreBadge score={supplier.score} reviewCount={supplier.reviewCount} />
        <span className={cx("whitespace-nowrap text-xs", NUM, TEXT_SECONDARY)}>
          {PRICE_BAND_META[supplier.priceBand].symbol} · {supplier.leadTimeDays}d lead
        </span>
        <CompareToggle checked={compareChecked} disabled={compareDisabled} onClick={onToggleCompare} />
      </div>
    </li>
  );
}
