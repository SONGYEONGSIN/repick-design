"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Aperture,
  ArrowUpDown,
  CircleCheck,
  CircleDashed,
  Coins,
  Download,
  Film,
  Image as ImageIcon,
  Inbox,
  TriangleAlert,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  X,
} from "lucide-react";
import {
  ASSETS,
  PAGE_SIZE,
  SORT_LABELS,
  assetImageUrl,
  matchesFilters,
  sortAssets,
  type Asset,
  type AssetStatus,
  type AssetType,
  type License,
  type Orientation,
  type SortKey,
} from "./data";
import PreviewPane from "./preview-pane";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const TYPE_OPTIONS: AssetType[] = ["Photo", "Video"];
const LICENSE_OPTIONS: License[] = ["Standard", "Extended", "Editorial"];
const ORIENTATION_OPTIONS: Orientation[] = ["Landscape", "Portrait", "Square"];

type FilterGroup = "Type" | "License" | "Orientation";

function toggleSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

const STATUS_ICON: Record<AssetStatus, typeof CircleCheck> = {
  Licensed: CircleCheck,
  Restricted: TriangleAlert,
  Available: CircleDashed,
};
const STATUS_LABEL: Record<AssetStatus, string> = {
  Licensed: "Licensed",
  Restricted: "Restricted",
  Available: "Available",
};
const STATUS_TONE: Record<AssetStatus, string> = {
  Licensed: "text-emerald-700",
  Restricted: "text-orange-700",
  Available: "text-zinc-500",
};

const ORIENTATION_ICON: Record<Orientation, typeof RectangleHorizontal> = {
  Landscape: RectangleHorizontal,
  Portrait: RectangleVertical,
  Square: Square,
};

const TYPE_ICON: Record<AssetType, typeof Film> = {
  Photo: ImageIcon,
  Video: Film,
};

export default function Page() {
  const [types, setTypes] = useState<Set<AssetType>>(() => new Set());
  const [licenses, setLicenses] = useState<Set<License>>(() => new Set());
  const [orientations, setOrientations] = useState<Set<Orientation>>(() => new Set());
  const [sort, setSort] = useState<SortKey>("relevance");
  const [selectedId, setSelectedId] = useState<string>(ASSETS[0].id);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [listScrolled, setListScrolled] = useState(false);

  const filtered = useMemo(() => {
    const matched = ASSETS.filter((a) => matchesFilters(a, { types, licenses, orientations }));
    return sortAssets(matched, sort);
  }, [types, licenses, orientations, sort]);

  const visible = filtered.slice(0, visibleCount);
  const selectedAsset = ASSETS.find((a) => a.id === selectedId) ?? null;
  const remaining = filtered.length - visibleCount;

  function resetPagination() {
    setVisibleCount(PAGE_SIZE);
  }

  function toggleFilter(group: FilterGroup, value: string) {
    resetPagination();
    if (group === "Type") setTypes((prev) => toggleSet(prev, value as AssetType));
    else if (group === "License") setLicenses((prev) => toggleSet(prev, value as License));
    else setOrientations((prev) => toggleSet(prev, value as Orientation));
  }

  function clearAll() {
    resetPagination();
    setTypes(new Set());
    setLicenses(new Set());
    setOrientations(new Set());
  }

  function selectAsset(id: string) {
    setSelectedId(id);
    setMobileView("detail");
  }

  const appliedChips: { group: FilterGroup; value: string }[] = [
    ...[...types].map((value) => ({ group: "Type" as const, value })),
    ...[...licenses].map((value) => ({ group: "License" as const, value })),
    ...[...orientations].map((value) => ({ group: "Orientation" as const, value })),
  ];

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-white text-zinc-900">
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-zinc-200 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-rose-600 text-white">
            <Aperture className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1
              style={{ fontFamily: "var(--font-display-mono)" }}
              className="truncate text-lg font-semibold tracking-tight text-zinc-900"
            >
              Fathom
            </h1>
            <p className="hidden truncate text-xs text-zinc-500 sm:block">
              Stock media archive for production teams
            </p>
          </div>
        </div>
        <p className="hidden shrink-0 text-xs text-zinc-500 md:block">Internal library · Full access</p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div
          className={`min-h-0 flex-col border-zinc-200 md:flex md:w-[420px] md:shrink-0 md:border-r ${
            mobileView === "detail" ? "hidden md:flex" : "flex"
          }`}
        >
          <h2 className="sr-only">Results</h2>

          <div
            className={`shrink-0 space-y-4 border-b border-zinc-200 bg-white p-4 transition-shadow motion-reduce:transition-none ${
              listScrolled ? "shadow-[0_6px_16px_-10px_rgba(24,24,27,0.18)]" : ""
            }`}
          >
            <FilterRow
              label="Type"
              options={TYPE_OPTIONS}
              active={types}
              onToggle={(v) => toggleFilter("Type", v)}
            />
            <FilterRow
              label="License"
              options={LICENSE_OPTIONS}
              active={licenses}
              onToggle={(v) => toggleFilter("License", v)}
            />
            <FilterRow
              label="Orientation"
              options={ORIENTATION_OPTIONS}
              active={orientations}
              onToggle={(v) => toggleFilter("Orientation", v)}
            />

            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-sm text-zinc-600">
                <span className="tabular-nums font-semibold text-zinc-900">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "result" : "results"}
              </p>
              <label className="flex items-center gap-1.5 text-sm text-zinc-600">
                <span className="sr-only">Sort by</span>
                <ArrowUpDown className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                <select
                  value={sort}
                  onChange={(e) => {
                    resetPagination();
                    setSort(e.target.value as SortKey);
                  }}
                  className={`min-w-0 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-700 ${FOCUS_RING}`}
                >
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                    <option key={key} value={key}>
                      {SORT_LABELS[key]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {appliedChips.length > 0 && (
            <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-zinc-200 bg-white px-4 py-3">
              {appliedChips.map((chip) => (
                <button
                  key={`${chip.group}-${chip.value}`}
                  type="button"
                  onClick={() => toggleFilter(chip.group, chip.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100 ${FOCUS_RING}`}
                >
                  <span className="text-rose-500">{chip.group}:</span>
                  {chip.value}
                  <X className="size-3" aria-hidden="true" />
                  <span className="sr-only">Remove {chip.group} filter: {chip.value}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className={`rounded text-xs font-medium text-zinc-500 underline-offset-2 hover:text-zinc-900 hover:underline ${FOCUS_RING}`}
              >
                Clear all
              </button>
            </div>
          )}

          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white"
            onScroll={(e) => setListScrolled(e.currentTarget.scrollTop > 4)}
          >
            {filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <Inbox className="size-8 text-zinc-300" aria-hidden="true" />
                <p className="text-sm font-medium text-zinc-900">No assets match your filters</p>
                <p className="max-w-xs text-sm text-zinc-500">
                  Try removing one or more filters to widen the results.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className={`mt-1 inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 ${FOCUS_RING}`}
                >
                  <X className="size-3.5" aria-hidden="true" />
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-zinc-100">
                  {visible.map((asset, idx) => (
                    <ResultRow
                      key={asset.id}
                      asset={asset}
                      index={idx}
                      selected={asset.id === selectedId}
                      onSelect={() => selectAsset(asset.id)}
                    />
                  ))}
                </ul>
                <div className="p-4">
                  {remaining > 0 ? (
                    <button
                      type="button"
                      onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length))}
                      className={`w-full rounded-md border border-zinc-300 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 ${FOCUS_RING}`}
                    >
                      Load {Math.min(PAGE_SIZE, remaining)} more
                      <span className="ml-1.5 tabular-nums text-zinc-500">({remaining} remaining)</span>
                    </button>
                  ) : (
                    <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
                      <CircleCheck className="size-3.5 text-emerald-700" aria-hidden="true" />
                      All <span className="tabular-nums">{filtered.length}</span> results shown
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className={`min-h-0 min-w-0 flex-1 ${mobileView === "list" ? "hidden md:flex" : "flex"}`}>
          <PreviewPane asset={selectedAsset} onBack={() => setMobileView("list")} />
        </div>
      </main>
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  active,
  onToggle,
}: {
  label: string;
  options: T[];
  active: Set<T>;
  onToggle: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isActive = active.has(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => onToggle(option)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${FOCUS_RING} ${
                isActive
                  ? "border-rose-600 bg-rose-50 text-rose-700"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultRow({
  asset,
  index,
  selected,
  onSelect,
}: {
  asset: Asset;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const StatusIcon = STATUS_ICON[asset.status];
  const OrientationIcon = ORIENTATION_ICON[asset.orientation];
  const TypeIcon = TYPE_ICON[asset.type];

  return (
    <li>
      <button
        type="button"
        aria-current={selected ? "true" : undefined}
        onClick={onSelect}
        style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
        className={`motion-safe:[animation:gallery-fade_0.4s_ease-out_both] flex w-full min-w-0 items-start gap-3 border-l-2 p-3 text-left transition-colors ${FOCUS_RING} ${
          selected ? "border-l-rose-600 bg-rose-50/60" : "border-l-transparent hover:bg-zinc-50"
        }`}
      >
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-zinc-100">
          <Image
            fill
            src={assetImageUrl(asset.imageId, { w: 128, h: 128 })}
            alt={`${asset.title} — ${asset.collection} thumbnail`}
            sizes="64px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="min-w-0 truncate text-sm font-semibold text-zinc-900">{asset.title}</span>
            <span className="flex shrink-0 items-center gap-1 tabular-nums text-sm font-semibold text-rose-700">
              <Coins className="size-3.5 text-rose-600" aria-hidden="true" />
              {asset.credits}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-zinc-500">
            {asset.collection} · {asset.creator}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <TypeIcon className="size-3 text-zinc-400" aria-hidden="true" />
              {asset.type}
            </span>
            <span className="inline-flex items-center gap-1">
              <OrientationIcon className="size-3 text-zinc-400" aria-hidden="true" />
              {asset.orientation}
            </span>
            <span className={`inline-flex items-center gap-1 font-medium ${STATUS_TONE[asset.status]}`}>
              <StatusIcon className="size-3" aria-hidden="true" />
              {STATUS_LABEL[asset.status]}
            </span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Download className="size-3 text-zinc-400" aria-hidden="true" />
              {asset.downloads.toLocaleString("en-US")}
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}
