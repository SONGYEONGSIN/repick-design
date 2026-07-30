"use client";

import { Lock, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import AuditRail from "./AuditRail";
import CommandPalette from "./CommandPalette";
import PermissionMatrix from "./PermissionMatrix";
import Sidebar from "./Sidebar";
import SettingsNav from "./SettingsNav";
import Topbar from "./Topbar";
import { ALL_PERMISSIONS, DEFAULT_MATRIX, INITIAL_AUDIT_LOG, PERMISSION_GROUPS, ROLES, type AuditEntry, type MatrixState, type RoleId } from "./data";
import { CARD, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

function countAllowed(matrix: MatrixState, roleId: Exclude<RoleId, "owner">): number {
  return ALL_PERMISSIONS.reduce((sum, p) => sum + (matrix[p.id]?.[roleId] ? 1 : 0), 0);
}

export default function PalisadeClient() {
  const [matrix, setMatrix] = useState<MatrixState>(DEFAULT_MATRIX);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(INITIAL_AUDIT_LOG);
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleToggle(permId: string, roleId: RoleId) {
    if (roleId === "owner") return;
    const permission = ALL_PERMISSIONS.find((p) => p.id === permId);
    if (!permission) return;
    const nextValue = !matrix[permId]?.[roleId];

    setMatrix((prev) => ({
      ...prev,
      [permId]: { ...prev[permId], [roleId]: nextValue },
    }));

    setAuditLog((prev) => [
      {
        id: `local-${prev.length}`,
        actorName: "Mina Aldridge",
        actorAvatarId: "1519085360753-af0119f7cbe7",
        actorInitials: "MA",
        roleId,
        permissionLabel: permission.label,
        action: nextValue ? "granted" : "revoked",
        timeLabel: "Just now",
      },
      ...prev,
    ]);
  }

  function handleSelectRole(roleId: RoleId) {
    setSelectedRoleId((prev) => (prev === roleId ? null : roleId));
  }

  function handleSearchFromPalette(label: string) {
    setSearchQuery(label);
    setPaletteOpen(false);
  }

  function handleSelectRoleFromPalette(roleId: RoleId) {
    setSelectedRoleId(roleId);
    setPaletteOpen(false);
  }

  const adminCount = countAllowed(matrix, "admin");
  const editorCount = countAllowed(matrix, "editor");
  const totalPermissions = ALL_PERMISSIONS.length;

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", "bg-white dark:bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>Roles &amp; Permissions</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Northlane Studio &middot; {ROLES.length} roles &middot; {PERMISSION_GROUPS.length} permission groups</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <InlineStat icon={ShieldCheck} label="Total permissions" value={String(totalPermissions)} />
                <InlineStat icon={Users} label="Admin access" value={`${adminCount} / ${totalPermissions}`} />
                <InlineStat icon={Lock} label="Editor access" value={`${editorCount} / ${totalPermissions}`} />
              </div>
            </header>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
              <SettingsNav />

              <div className="flex min-w-0 flex-1 gap-5 xl:items-start">
                <div className={cx(CARD, "min-w-0 flex-1 p-4 sm:p-5")}>
                  <PermissionMatrix
                    matrix={matrix}
                    onToggle={handleToggle}
                    selectedRoleId={selectedRoleId}
                    onSelectRole={handleSelectRole}
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                  />
                </div>

                <AuditRail entries={auditLog} selectedRoleId={selectedRoleId} onClearRole={() => setSelectedRoleId(null)} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette onClose={() => setPaletteOpen(false)} onSearchPermission={handleSearchFromPalette} onSelectRole={handleSelectRoleFromPalette} />
      ) : null}
    </div>
  );
}

function InlineStat({ icon: Icon, label, value }: { icon: typeof ShieldCheck; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <Icon size={12} aria-hidden="true" className={TEXT_CAPTION} />
        <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{label}</span>
      </div>
      <p className={cx("mt-0.5 truncate text-lg font-semibold tabular-nums", TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}
