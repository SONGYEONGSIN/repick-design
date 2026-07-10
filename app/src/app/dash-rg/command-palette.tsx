"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, CornerDownLeft, Search, X, type LucideIcon } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";

import { ACCOUNTS, NAV_SECTIONS, TRANSACTIONS } from "./data";
import { formatDateShort, formatKRW, formatSignedKRW } from "./format";
import { BORDER, FOCUS_RING, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";

/* ---------------------------------------------------------------------- */
/* 검색 대상 인덱스 — 페이지 · 계좌 · 거래                                        */
/* ---------------------------------------------------------------------- */

type PaletteGroup = "페이지" | "계좌" | "거래";

type PaletteItem = {
  id: string;
  group: PaletteGroup;
  title: string;
  subtitle?: string;
  href: string;
  Icon: LucideIcon;
};

function buildItems(): PaletteItem[] {
  const pages: PaletteItem[] = NAV_SECTIONS.flatMap((section) =>
    section.items
      .filter((item) => !item.disabled)
      .map((item) => ({
        id: `page-${item.id}`,
        group: "페이지" as const,
        title: item.label,
        subtitle: section.title,
        href: item.href,
        Icon: item.Icon,
      })),
  );
  const accounts: PaletteItem[] = ACCOUNTS.map((acc) => ({
    id: `account-${acc.id}`,
    group: "계좌" as const,
    title: acc.name,
    subtitle: `${acc.type} •••• ${acc.mask} · ${formatKRW(acc.balance)}`,
    href: "#accounts",
    Icon: acc.Icon,
  }));
  const transactions: PaletteItem[] = TRANSACTIONS.map((tx) => ({
    id: `tx-${tx.id}`,
    group: "거래" as const,
    title: tx.merchant,
    subtitle: `${tx.category} · ${formatDateShort(tx.date)} · ${formatSignedKRW(tx.amount)}`,
    href: "#transactions",
    Icon: tx.Icon,
  }));
  return [...pages, ...accounts, ...transactions];
}

const ALL_ITEMS = buildItems();

function filterItems(items: PaletteItem[], query: string): PaletteItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.group.toLowerCase().includes(q),
  );
}

/* ---------------------------------------------------------------------- */
/* 커맨드 팔레트                                                             */
/* ---------------------------------------------------------------------- */

export function CommandPalette({
  open,
  onClose,
  onNavigate,
  restoreFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  /** 팔레트를 닫을 때 포커스를 되돌려줄 트리거 요소(어떤 경로로 열렸든 공통 처리). */
  restoreFocusRef: RefObject<HTMLElement | null>;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const wasOpen = useRef(false);
  const [trackedOpen, setTrackedOpen] = useState(open);

  const filtered = useMemo(() => filterItems(ALL_ITEMS, query), [query]);
  const groups = useMemo(() => {
    const map = new Map<PaletteGroup, PaletteItem[]>();
    for (const item of filtered) {
      const arr = map.get(item.group) ?? [];
      arr.push(item);
      map.set(item.group, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // 열릴 때마다 검색어/선택 인덱스를 초기화한다 (렌더 중 상태 조정 패턴).
  if (open !== trackedOpen) {
    setTrackedOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (wasOpen.current && !open) {
      restoreFocusRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open, restoreFocusRef]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function handleSelect(item: PaletteItem) {
    onNavigate(item.href);
    onClose();
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) handleSelect(item);
      return;
    }
    if (e.key === "Tab") {
      const container = panelRef.current;
      if (!container) return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>('input, button, [href], [tabindex]:not([tabindex="-1"])'),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  const activeItem = filtered[activeIndex];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="전체 검색"
            onKeyDown={handleKeyDown}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={cx(
              "relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border shadow-2xl",
              BORDER,
              "bg-white dark:bg-zinc-900",
            )}
          >
            <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER)}>
              <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_SECONDARY)} />
              <label htmlFor="command-palette-input" className="sr-only">
                계좌, 거래, 페이지 검색
              </label>
              <input
                id="command-palette-input"
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="계좌, 거래, 페이지 검색…"
                autoComplete="off"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-palette-listbox"
                aria-activedescendant={activeItem ? `command-item-${activeItem.id}` : undefined}
                className={cx(
                  "h-12 flex-1 bg-transparent text-sm outline-none",
                  TEXT_PRIMARY,
                  "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                )}
              />
              <button
                type="button"
                onClick={onClose}
                className={cx(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                  TEXT_SECONDARY,
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  TRANSITION,
                  FOCUS_RING,
                )}
              >
                <X size={16} aria-hidden="true" />
                <span className="sr-only">검색 닫기</span>
              </button>
            </div>

            <ul id="command-palette-listbox" role="listbox" aria-label="검색 결과" className="max-h-80 overflow-y-auto p-2">
              {groups.map(([groupName, items]) => (
                <li key={groupName} role="presentation">
                  <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {groupName}
                  </p>
                  <ul role="group" aria-label={groupName}>
                    {items.map((item) => {
                      const idx = filtered.indexOf(item);
                      const active = idx === activeIndex;
                      return (
                        <li key={item.id} role="presentation">
                          <button
                            type="button"
                            id={`command-item-${item.id}`}
                            role="option"
                            aria-selected={active}
                            ref={(el) => {
                              itemRefs.current[idx] = el;
                            }}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => handleSelect(item)}
                            className={cx(
                              "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm",
                              TRANSITION,
                              FOCUS_RING,
                              active ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-zinc-50 dark:hover:bg-white/5",
                            )}
                          >
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                              <item.Icon size={14} aria-hidden="true" className={TEXT_SECONDARY} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={cx("block truncate font-medium", TEXT_PRIMARY)}>{item.title}</span>
                              {item.subtitle ? (
                                <span className={cx("block truncate text-xs", TEXT_SECONDARY)}>{item.subtitle}</span>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
            {filtered.length === 0 && (
              <p className={cx("px-4 py-8 text-center text-sm", TEXT_SECONDARY)}>검색 결과가 없어요.</p>
            )}

            <div className={cx("flex items-center gap-4 border-t px-4 py-2.5 text-[11px]", BORDER, TEXT_SECONDARY)}>
              <span className="flex items-center gap-1">
                <ArrowUp size={11} aria-hidden="true" />
                <ArrowDown size={11} aria-hidden="true" />
                이동
              </span>
              <span className="flex items-center gap-1">
                <CornerDownLeft size={11} aria-hidden="true" />
                선택
              </span>
              <span>Esc 닫기</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
