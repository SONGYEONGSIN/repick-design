"use client";

import { CircleCheck, GitCompare, Star, X } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { CATEGORY_META, CAPABILITY_META, PRICE_BAND_META, REGION_META, numberFmt, unsplashPhoto, type Supplier } from "./data";
import { ACCENT_TEXT, BORDER, CARD_BG, FOCUS_RING, NUM, PRIMARY_SOLID, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";

const COMPARE_MAX = 4;

type Row = { label: string; render: (s: Supplier) => ReactNode };

export default function CompareTray({
  suppliers,
  open,
  onOpenChange,
  onRemove,
}: {
  suppliers: Supplier[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onRemove: (id: string) => void;
}) {
  if (suppliers.length === 0) return null;

  const rows: Row[] = [
    { label: "Category", render: (s) => CATEGORY_META[s.category].label },
    { label: "Region", render: (s) => REGION_META[s.region].label },
    {
      label: "Rating",
      render: (s) => (
        <span className="inline-flex items-center gap-1">
          <Star size={12} aria-hidden="true" className="fill-emerald-500 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400" />
          <span className={NUM}>{s.score.toFixed(1)}</span>
          <span className={cx("text-[11px]", NUM, TEXT_CAPTION)}>({numberFmt.format(s.reviewCount)})</span>
        </span>
      ),
    },
    { label: "Price band", render: (s) => `${PRICE_BAND_META[s.priceBand].symbol} ${PRICE_BAND_META[s.priceBand].label}` },
    { label: "Lead time", render: (s) => <span className={NUM}>{s.leadTimeDays} days</span> },
    { label: "Min. order", render: (s) => <span className={NUM}>{numberFmt.format(s.minOrderUnits)} units</span> },
    {
      label: "Verified",
      render: (s) =>
        s.verified ? (
          <span className={cx("inline-flex items-center gap-1", ACCENT_TEXT)}>
            <CircleCheck size={13} aria-hidden="true" />
            Verified
          </span>
        ) : (
          <span className={TEXT_CAPTION}>Unverified</span>
        ),
    },
    { label: "Capabilities", render: (s) => s.capabilities.map((c) => CAPABILITY_META[c].label).join(", ") },
  ];

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className={cx("fixed bottom-5 right-4 z-30 flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-lg sm:right-6", PRIMARY_SOLID, "shadow-blue-900/20", TRANSITION, FOCUS_RING)}
        >
          <GitCompare size={16} aria-hidden="true" />
          Compare ({suppliers.length}/{COMPARE_MAX})
        </button>
      ) : null}

      {/* Scrim: only focusable/interactive while the tray is open (inert removes it otherwise). */}
      <button
        type="button"
        aria-label="Close compare tray"
        inert={!open}
        onClick={() => onOpenChange(false)}
        className={cx("fixed inset-0 z-30 bg-zinc-900/30 dark:bg-black/50", TRANSITION, open ? "opacity-100" : "pointer-events-none opacity-0")}
      />

      <aside
        aria-label="Compare tray"
        inert={!open}
        className={cx(
          "fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l shadow-2xl",
          BORDER,
          CARD_BG,
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className={cx("flex h-11 shrink-0 items-center justify-between border-b px-4", BORDER)}>
          <h2 className={cx("flex items-center gap-1.5 text-sm font-semibold", TEXT_PRIMARY)}>
            <GitCompare size={15} aria-hidden="true" />
            Compare ({suppliers.length}/{COMPARE_MAX})
          </h2>
          <button type="button" onClick={() => onOpenChange(false)} aria-label="Close compare tray" className={cx("grid h-9 w-9 place-items-center rounded-lg", TEXT_CAPTION, "hover:bg-zinc-100 dark:hover:bg-white/5", FOCUS_RING)}>
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <caption className="sr-only">Side-by-side comparison of {suppliers.length} selected suppliers</caption>
              <thead>
                <tr className={cx("border-b", BORDER)}>
                  <th scope="col" className={cx("sticky left-0 w-24 min-w-24 shrink-0 px-3 py-2 align-bottom text-[11px] font-semibold uppercase tracking-wider", CARD_BG, TEXT_CAPTION)}>
                    Attribute
                  </th>
                  {suppliers.map((s) => (
                    <th key={s.id} scope="col" className="min-w-[140px] px-3 py-2 align-bottom font-semibold">
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <Image src={unsplashPhoto(s.photoId, 64)} alt={`${s.name} logo thumbnail`} width={24} height={24} className="h-6 w-6 shrink-0 rounded-md object-cover" />
                          <span className={cx("line-clamp-2 text-xs leading-snug", TEXT_PRIMARY)}>{s.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(s.id)}
                          aria-label={`Remove ${s.name} from compare`}
                          className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-md", TEXT_CAPTION, "hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200", FOCUS_RING)}
                        >
                          <X size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.label} className={cx(idx % 2 === 1 ? "bg-zinc-50 dark:bg-white/[0.03]" : undefined)}>
                    <th scope="row" className={cx("sticky left-0 whitespace-nowrap px-3 py-2 align-top font-medium", idx % 2 === 1 ? "bg-zinc-50 dark:bg-white/[0.03]" : CARD_BG, TEXT_SECONDARY)}>
                      {row.label}
                    </th>
                    {suppliers.map((s) => (
                      <td key={s.id} className={cx("px-3 py-2 align-top", TEXT_PRIMARY)}>
                        {row.render(s)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={cx("shrink-0 border-t p-3 text-[11px]", BORDER, TEXT_CAPTION)}>Add up to {COMPARE_MAX} suppliers · remove one with the × above to add another.</div>
      </aside>
    </>
  );
}
