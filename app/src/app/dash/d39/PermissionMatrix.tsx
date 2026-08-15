"use client";

import { Check, ChevronRight, Lock, Search, X, type LucideIcon } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { EDITABLE_ROLES, PERMISSION_GROUPS, ROLE_BY_ID, ROLES, type EditableRoleId, type MatrixState, type RoleId } from "./data";
import { ACCENT_SUBTLE, ACCENT_TEXT, BORDER, DIVIDE, FOCUS_RING, FOCUS_RING_INSET, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, TRANSITION_TRANSFORM, cx } from "./tokens";
import { CardHeader } from "./ui";

const HIGHLIGHT_COL = "bg-sky-50 dark:bg-sky-500/[0.08]";

export default function PermissionMatrix({
  matrix,
  onToggle,
  selectedRoleId,
  onSelectRole,
  searchQuery,
  onSearchQueryChange,
}: {
  matrix: MatrixState;
  onToggle: (permId: string, roleId: EditableRoleId) => void;
  selectedRoleId: RoleId | null;
  onSelectRole: (roleId: RoleId) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(PERMISSION_GROUPS.map((g) => g.id)));
  const cellRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query !== "";

  const visibleGroups = useMemo(() => {
    return PERMISSION_GROUPS.map((group) => ({
      ...group,
      permissions: isSearching ? group.permissions.filter((p) => p.label.toLowerCase().includes(query)) : group.permissions,
    })).filter((group) => (isSearching ? group.permissions.length > 0 : true));
  }, [query, isSearching]);

  const totalCount = useMemo(() => PERMISSION_GROUPS.reduce((sum, g) => sum + g.permissions.length, 0), []);
  const matchCount = useMemo(() => visibleGroups.reduce((sum, g) => sum + g.permissions.length, 0), [visibleGroups]);

  const flatVisiblePermIds = useMemo(() => visibleGroups.flatMap((g) => g.permissions.map((p) => p.id)), [visibleGroups]);

  function toggleGroup(groupId: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  function moveFocus(permId: string, roleId: EditableRoleId, dir: "up" | "down" | "left" | "right") {
    const rowIdx = flatVisiblePermIds.indexOf(permId);
    const colIdx = EDITABLE_ROLES.indexOf(roleId);
    let targetRow = rowIdx;
    let targetCol = colIdx;
    if (dir === "up") targetRow = Math.max(0, rowIdx - 1);
    if (dir === "down") targetRow = Math.min(flatVisiblePermIds.length - 1, rowIdx + 1);
    if (dir === "left") targetCol = Math.max(0, colIdx - 1);
    if (dir === "right") targetCol = Math.min(EDITABLE_ROLES.length - 1, colIdx + 1);
    const key = `${flatVisiblePermIds[targetRow]}:${EDITABLE_ROLES[targetCol]}`;
    cellRefs.current.get(key)?.focus();
  }

  function handleCellKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, permId: string, roleId: EditableRoleId) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const dir = e.key === "ArrowUp" ? "up" : e.key === "ArrowDown" ? "down" : e.key === "ArrowLeft" ? "left" : "right";
      moveFocus(permId, roleId, dir);
    }
  }

  return (
    <section aria-labelledby="permission-matrix-heading" className="flex min-w-0 flex-1 flex-col gap-3">
      <CardHeader
        titleId="permission-matrix-heading"
        title="Permission matrix"
        description="Click a permission cell to grant or revoke access. Click a role name to see its recent changes."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex h-11 w-full items-center sm:max-w-xs">
          <span className="sr-only" id="permission-search-label">
            Filter permissions by name
          </span>
          <Search size={15} aria-hidden="true" className={cx("pointer-events-none absolute left-3", TEXT_CAPTION)} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            aria-labelledby="permission-search-label"
            placeholder="Filter permissions…"
            className={cx(
              "h-11 w-full rounded-lg border pl-9 pr-9 text-sm",
              BORDER,
              "bg-white dark:bg-zinc-900",
              TEXT_PRIMARY,
              "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
              FOCUS_RING,
            )}
          />
          {isSearching ? (
            <button
              type="button"
              onClick={() => onSearchQueryChange("")}
              aria-label="Clear permission filter"
              className={cx("absolute right-1.5 grid h-8 w-8 place-items-center rounded-md", "hover:bg-zinc-100 dark:hover:bg-white/10", TRANSITION, FOCUS_RING)}
            >
              <X size={14} aria-hidden="true" className={TEXT_CAPTION} />
            </button>
          ) : null}
        </label>
        <p aria-live="polite" className={cx("text-xs", TEXT_CAPTION)}>
          {isSearching ? `${matchCount} of ${totalCount} permissions match "${searchQuery.trim()}"` : `${totalCount} permissions across ${PERMISSION_GROUPS.length} groups`}
        </p>
      </div>

      <div className={cx("overflow-x-auto rounded-xl border", BORDER)}>
        <table className="w-full min-w-[860px] border-collapse text-left lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">
            Role-by-permission access matrix for {ROLES.length} roles across {totalCount} permissions, grouped by resource area.
          </caption>
          <colgroup>
            <col className="lg:w-[30%]" />
            <col className="lg:w-[10%]" />
            <col className="lg:w-[15%]" />
            <col className="lg:w-[15%]" />
            <col className="lg:w-[15%]" />
            <col className="lg:w-[15%]" />
          </colgroup>
          <thead>
              <tr className={cx("border-b", BORDER)}>
                <th scope="col" className={cx("px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION, "bg-zinc-50 dark:bg-zinc-900/60")}>
                  Permission
                </th>
                {ROLES.map((role) => {
                  const selected = selectedRoleId === role.id;
                  return (
                    <th key={role.id} scope="col" className={cx("p-0 bg-zinc-50 dark:bg-zinc-900/60", selected && HIGHLIGHT_COL)}>
                      <button
                        type="button"
                        onClick={() => onSelectRole(role.id)}
                        aria-pressed={selected}
                        title={role.description}
                        className={cx(
                          "flex min-h-11 w-full flex-col items-center justify-center gap-0.5 px-1.5 py-2 text-center",
                          TRANSITION,
                          FOCUS_RING_INSET,
                          selected ? ACCENT_TEXT : TEXT_SECONDARY,
                          "hover:text-sky-700 dark:hover:text-sky-300",
                        )}
                      >
                        <span className="flex items-center gap-1 text-xs font-semibold whitespace-nowrap">
                          {role.locked ? <Lock size={11} aria-hidden="true" /> : null}
                          {role.label}
                        </span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {visibleGroups.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={1 + ROLES.length} className={cx("px-4 py-10 text-center text-sm", TEXT_CAPTION)}>
                    No permissions match &ldquo;{searchQuery.trim()}&rdquo;.
                  </td>
                </tr>
              </tbody>
            ) : (
              visibleGroups.map((group) => {
                const expanded = isSearching ? true : expandedGroups.has(group.id);
                return (
                  <tbody key={group.id} className={cx("border-b last:border-b-0", BORDER)}>
                    <tr className={cx("border-b", BORDER, "bg-zinc-50/70 dark:bg-white/[0.02]")}>
                      <th colSpan={1 + ROLES.length} className="p-0 text-left font-normal">
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.id)}
                          disabled={isSearching}
                          aria-expanded={expanded}
                          className={cx(
                            "flex min-h-11 w-full items-center gap-2 px-3 py-2 text-left",
                            TRANSITION,
                            FOCUS_RING_INSET,
                            isSearching ? "cursor-default" : "hover:bg-zinc-100 dark:hover:bg-white/5",
                          )}
                        >
                          <ChevronRight
                            size={14}
                            aria-hidden="true"
                            className={cx(TEXT_CAPTION, TRANSITION_TRANSFORM, expanded && "rotate-90")}
                          />
                          <GroupIcon Icon={group.Icon} />
                          <span className={cx("text-sm font-semibold", TEXT_PRIMARY)}>{group.label}</span>
                          <span className={cx("ml-auto text-xs", TEXT_CAPTION)}>{group.permissions.length} permissions</span>
                        </button>
                      </th>
                    </tr>
                    {expanded
                      ? group.permissions.map((perm) => (
                          <tr key={perm.id} className={cx("border-b last:border-b-0", DIVIDE, BORDER, "hover:bg-zinc-50/60 dark:hover:bg-white/[0.02]")}>
                            <th scope="row" className="px-3 py-2.5 text-left align-top font-normal">
                              <span className={cx("block text-sm font-medium", TEXT_PRIMARY)}>{perm.label}</span>
                              <span className={cx("mt-0.5 block text-xs leading-snug", TEXT_CAPTION)}>{perm.description}</span>
                            </th>
                            <td className={cx("px-2 py-2.5 text-center align-middle", selectedRoleId === "owner" && HIGHLIGHT_COL)}>
                              <OwnerLockedCell permissionLabel={perm.label} />
                            </td>
                            {EDITABLE_ROLES.map((roleId) => {
                              const allowed = matrix[perm.id]?.[roleId] ?? false;
                              return (
                                <td key={roleId} className={cx("px-2 py-2.5 text-center align-middle", selectedRoleId === roleId && HIGHLIGHT_COL)}>
                                  <ToggleCell
                                    permId={perm.id}
                                    permissionLabel={perm.label}
                                    roleId={roleId}
                                    allowed={allowed}
                                    onToggle={onToggle}
                                    onKeyDown={handleCellKeyDown}
                                    registerRef={(el) => {
                                      const key = `${perm.id}:${roleId}`;
                                      if (el) cellRefs.current.set(key, el);
                                      else cellRefs.current.delete(key);
                                    }}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      : null}
                  </tbody>
                );
              })
            )}
        </table>
      </div>
    </section>
  );
}

function GroupIcon({ Icon }: { Icon: LucideIcon }) {
  return <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />;
}

function OwnerLockedCell({ permissionLabel }: { permissionLabel: string }) {
  return (
    <span
      className={cx("relative inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[11px] font-medium", ACCENT_SUBTLE, "border-sky-200 dark:border-sky-500/25")}
      title={`${permissionLabel}: always allowed for Owner`}
    >
      <Check size={11} aria-hidden="true" />
      <Lock size={10} aria-hidden="true" />
      <span className="sr-only">Always allowed, locked</span>
    </span>
  );
}

function ToggleCell({
  permId,
  permissionLabel,
  roleId,
  allowed,
  onToggle,
  onKeyDown,
  registerRef,
}: {
  permId: string;
  permissionLabel: string;
  roleId: EditableRoleId;
  allowed: boolean;
  onToggle: (permId: string, roleId: EditableRoleId) => void;
  onKeyDown: (e: ReactKeyboardEvent<HTMLButtonElement>, permId: string, roleId: EditableRoleId) => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  const roleLabel = ROLE_BY_ID[roleId].label;
  return (
    <button
      ref={registerRef}
      type="button"
      role="switch"
      aria-checked={allowed}
      // 셀에 보이는 글자는 Yes/No 인데 이름은 Allowed/Denied 라 어긋났다.
          // 보이는 낱말을 앞머리로 두고 뜻을 뒤에 붙인다.
          aria-label={`${permissionLabel} for ${roleLabel}: ${allowed ? "Yes, allowed" : "No, denied"}`}
      onClick={() => onToggle(permId, roleId)}
      onKeyDown={(e) => onKeyDown(e, permId, roleId)}
      className={cx(
        "inline-flex h-7 w-full max-w-[64px] items-center justify-center gap-1 rounded-full border px-1.5 text-[11px] font-semibold",
        TRANSITION,
        FOCUS_RING,
        allowed
          ? cx(ACCENT_SUBTLE, "border-sky-200 dark:border-sky-500/25")
          : cx("border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400", "hover:bg-zinc-100 dark:hover:bg-white/10"),
      )}
    >
      {allowed ? <Check size={11} aria-hidden="true" /> : <X size={11} aria-hidden="true" />}
      {allowed ? "Yes" : "No"}
    </button>
  );
}
