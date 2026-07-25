"use client";

import { useMemo, useState } from "react";
import type { SortDirection } from "./types";

/**
 * Generic table sort hook. Takes a map of column key → comparison-value
 * accessor functions, toggles asc/desc on click, and returns the sorted array.
 */
export function useSortable<T, K extends string>(
  rows: T[],
  accessors: Record<K, (row: T) => string | number>,
  initial: { key: K; direction?: SortDirection }
) {
  const [sortKey, setSortKey] = useState<K>(initial.key);
  const [direction, setDirection] = useState<SortDirection>(initial.direction ?? "desc");

  function toggle(key: K) {
    if (key === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("desc");
    }
  }

  const sorted = useMemo(() => {
    const accessor = accessors[sortKey];
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      let cmp: number;
      if (typeof av === "number" && typeof bv === "number") {
        cmp = av - bv;
      } else {
        cmp = String(av).localeCompare(String(bv), "en-US");
      }
      return direction === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, accessors, sortKey, direction]);

  return { sorted, sortKey, direction, toggle };
}
