"use client";

import { Search, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_PERMISSIONS, ROLES, type RoleId } from "./data";
import { ACCENT_SUBTLE, BORDER, FOCUS_RING, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

export default function CommandPalette({
  onClose,
  onSearchPermission,
  onSelectRole,
}: {
  onClose: () => void;
  onSearchPermission: (query: string) => void;
  onSelectRole: (roleId: RoleId) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const matchedPermissions = useMemo(() => (q === "" ? [] : ALL_PERMISSIONS.filter((p) => p.label.toLowerCase().includes(q)).slice(0, 6)), [q]);
  const matchedRoles = useMemo(() => (q === "" ? ROLES : ROLES.filter((r) => r.label.toLowerCase().includes(q))), [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg", BORDER, "bg-white dark:bg-zinc-900")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-700", BORDER)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Jump to a permission or role…"
            aria-label="Search permissions or roles"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400 dark:placeholder:text-zinc-500")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          {q !== "" ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <EyebrowLabel>Permissions</EyebrowLabel>
              </div>
              {matchedPermissions.length === 0 ? (
                <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching permissions.</p>
              ) : (
                matchedPermissions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSearchPermission(p.label)}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                  >
                    <ShieldCheck size={14} aria-hidden="true" className={TEXT_CAPTION} />
                    <span className="truncate">{p.label}</span>
                  </button>
                ))
              )}
            </div>
          ) : null}

          <div>
            <div className="px-2.5 py-1">
              <EyebrowLabel>Roles</EyebrowLabel>
            </div>
            {matchedRoles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRole(r.id)}
                className={cx("flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
              >
                <span className="truncate">{r.label}</span>
                <span className={cx("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium", ACCENT_SUBTLE)}>View changes</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
