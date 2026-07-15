"use client";

import { CheckCircle2, Clock3, FileEdit, type LucideIcon } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";
import type { CampaignStatus } from "../lib/data";

// ── Card ────────────────────────────────────────────────────────────
export function Card({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "aside";
}) {
  return (
    <Tag className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</Tag>
  );
}

// ── 섹션 레이블 (11px uppercase tracking 통일) ─────────────────────
export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-[11px] font-semibold uppercase tracking-wide text-zinc-500 ${className}`}>
      {children}
    </span>
  );
}

// ── 상태 배지 (색 + 텍스트 + 아이콘 병행, 색만으로 구분 금지) ───────
const STATUS_META: Record<CampaignStatus, { label: string; Icon: LucideIcon; className: string }> = {
  sent: {
    label: "발송 완료",
    Icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  },
  scheduled: {
    label: "예약됨",
    Icon: Clock3,
    className: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
  },
  draft: {
    label: "임시 저장",
    Icon: FileEdit,
    className: "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-400/20",
  },
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}
    >
      <meta.Icon className="size-3" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

// ── 세그먼트 컨트롤 ─────────────────────────────────────────────────
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: {
  options: { value: T; label: string; Icon?: LucideIcon }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 rounded-md font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${pad} ${
              active
                ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {opt.Icon ? <opt.Icon className="size-3.5" aria-hidden="true" /> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── 접근성 있는 탭 ──────────────────────────────────────────────────
export interface TabItem<T extends string> {
  value: T;
  label: string;
  Icon: LucideIcon;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  idBase,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
  idBase: string;
}) {
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + items.length) % items.length;
    onChange(items[next].value);
    const el = document.getElementById(`${idBase}-tab-${items[next].value}`);
    el?.focus();
  };

  return (
    <div role="tablist" aria-label="캠페인 설정 단계" className="flex items-center gap-1 border-b border-zinc-200 px-2">
      {items.map((item, index) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            id={`${idBase}-tab-${item.value}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`${idBase}-panel-${item.value}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
              active
                ? "border-indigo-600 text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <item.Icon className="size-4" aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  id,
  labelledBy,
  children,
  className = "",
}: {
  id: string;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} tabIndex={0} className={className}>
      {children}
    </div>
  );
}

// ── 폼 필드 래퍼 (id는 호출부에서 명시적으로 지정) ──────────────────
export function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors motion-reduce:transition-none placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500 focus-visible:border-indigo-400";
