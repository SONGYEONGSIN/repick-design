"use client";

import { CandlestickChart, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { INSTRUMENTS } from "../lib/data";
import { formatRate } from "../lib/format";
import { BORDER, FOCUS_RING_INSET, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "../lib/tokens";

export default function CommandPalette({
  onClose,
  onSelectInstrument,
}: {
  onClose: () => void;
  onSelectInstrument: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 이 컴포넌트는 열려 있을 때만 부모(BallastClient)에서 마운트된다 — 매번 새 인스턴스로
  // 시작하므로 검색어가 자연히 빈 값으로 초기화된다(별도의 리셋 effect/ref 불필요).
  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INSTRUMENTS;
    return INSTRUMENTS.filter((i) => i.pair.toLowerCase().includes(q) || i.base.toLowerCase().includes(q) || i.quote.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24">
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="종목 빠른 검색"
        className={cx("relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl", BORDER, "bg-white dark:bg-zinc-900")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 dark:focus-within:ring-blue-400", BORDER)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="통화쌍 검색 (예: USD/KRW, EUR)"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-500 dark:placeholder:text-zinc-400")}
          />
          <kbd className={cx("rounded-md border px-1.5 py-0.5 text-[11px] font-medium", BORDER, TEXT_CAPTION)}>ESC</kbd>
        </div>
        <ul role="listbox" aria-label="검색 결과" className="max-h-80 overflow-y-auto p-1.5 [scrollbar-width:thin]">
          {results.length === 0 ? (
            <li className={cx("px-3 py-6 text-center text-sm", TEXT_CAPTION)}>일치하는 통화쌍이 없습니다.</li>
          ) : (
            results.map((inst) => (
              <li key={inst.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  onClick={() => {
                    onSelectInstrument(inst.id);
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left", "hover:bg-zinc-50 dark:hover:bg-white/5", FOCUS_RING_INSET)}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <CandlestickChart size={15} aria-hidden="true" className={TEXT_CAPTION} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cx("block text-sm font-medium", TEXT_PRIMARY)}>{inst.pair}</span>
                    <span className={cx("block text-xs", TEXT_CAPTION)}>워치리스트 · 헤지 {inst.hedgeRatioPct ?? "—"}%</span>
                  </span>
                  <span className={cx("shrink-0 text-right text-sm font-medium", NUM, TEXT_PRIMARY)}>{formatRate(inst.last, inst)}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
