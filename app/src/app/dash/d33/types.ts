import type { Period } from "./data";

export type ViewMode = "board" | "list";
export type SortKey = "amount" | "closeDate" | "probability" | "company" | "stage";
export type SortDir = "asc" | "desc";

export interface SortState {
  key: SortKey;
  dir: SortDir;
}

export interface BoardControls {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  period: Period;
  setPeriod: (p: Period) => void;
  ownerFilter: string; // "all" | ownerId
  setOwnerFilter: (id: string) => void;
  sort: SortState;
  setSort: (s: SortState) => void;
}

/** 정렬 프리셋 — 툴바 드롭다운용. */
export const SORT_PRESETS: { key: SortKey; dir: SortDir; label: string }[] = [
  { key: "amount", dir: "desc", label: "금액 높은순" },
  { key: "closeDate", dir: "asc", label: "마감 임박순" },
  { key: "probability", dir: "desc", label: "확률 높은순" },
];
