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

/** Sort presets — for the toolbar dropdown. */
export const SORT_PRESETS: { key: SortKey; dir: SortDir; label: string }[] = [
  { key: "amount", dir: "desc", label: "Highest amount" },
  { key: "closeDate", dir: "asc", label: "Closing soonest" },
  { key: "probability", dir: "desc", label: "Highest probability" },
];
