"use client";

import { useMemo, useState } from "react";
import type { SortDirection } from "./types";

/**
 * 제네릭 테이블 정렬 훅. 컬럼 키 → 비교값 추출 함수 맵을 받아
 * 클릭 시 asc/desc를 토글하고 정렬된 배열을 반환한다.
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
        cmp = String(av).localeCompare(String(bv), "ko-KR");
      }
      return direction === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, accessors, sortKey, direction]);

  return { sorted, sortKey, direction, toggle };
}
