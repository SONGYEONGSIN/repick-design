"use client";

import { Menu, Rocket } from "lucide-react";
import { FOCUS } from "./focus";
import type { MissionInfo } from "../data";

export function TopBar({
  mission,
  onOpenMenu,
}: {
  mission: MissionInfo;
  onOpenMenu: () => void;
}) {
  return (
    <header
      className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6"
      style={{ borderColor: "var(--hf-border)", background: "var(--hf-bg)" }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md lg:hidden ${FOCUS}`}
          style={{ color: "var(--hf-text-2)" }}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border lg:hidden"
          style={{ borderColor: "var(--hf-border-strong)", background: "var(--hf-panel-2)" }}
        >
          <Rocket className="h-4 w-4" style={{ color: "var(--hf-accent)" }} />
        </span>
        <div className="min-w-0">
          <p
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--hf-text-3)" }}
          >
            {mission.workspace} · {mission.pad}
          </p>
          <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl" style={{ color: "var(--hf-text)" }}>
            {mission.program} — Terminal Count
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-xs font-medium" style={{ color: "var(--hf-text)" }}>
            {mission.operator}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--hf-text-3)" }}>
            {mission.vehicle}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-md border font-mono text-[11px] font-bold"
          style={{ borderColor: "var(--hf-border-strong)", background: "var(--hf-panel)", color: "var(--hf-accent)" }}
        >
          {mission.operatorInitials}
        </span>
      </div>
    </header>
  );
}
