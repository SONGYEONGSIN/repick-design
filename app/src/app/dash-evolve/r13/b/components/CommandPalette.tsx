"use client";

import { GitCommitHorizontal, Search, Waypoints, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ENVIRONMENTS, EVENTS, formatRelative, SERVICE_BY_ID, type EnvironmentId } from "../data";
import { ACCENT_SUBTLE, BORDER, FOCUS_RING, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "../tokens";
import { EyebrowLabel, StatusDot } from "../ui";
import { ENV_STATUS_TONE } from "./EnvironmentPanel";

export default function CommandPalette({
  onClose,
  onJumpToEvent,
  onJumpToEnvironment,
}: {
  onClose: () => void;
  onJumpToEvent: (id: string) => void;
  onJumpToEnvironment: (id: EnvironmentId) => void;
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

  const matchedEnvironments = useMemo(() => (q === "" ? ENVIRONMENTS : ENVIRONMENTS.filter((e) => e.name.toLowerCase().includes(q))), [q]);

  const matchedEvents = useMemo(() => {
    if (q === "") return EVENTS.slice(0, 6);
    return EVENTS.filter((e) => {
      const service = SERVICE_BY_ID[e.serviceId].name.toLowerCase();
      return service.includes(q) || e.author.name.toLowerCase().includes(q) || e.branch.toLowerCase().includes(q) || e.commitMessage.toLowerCase().includes(q);
    }).slice(0, 8);
  }, [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg shadow-black/50", BORDER, "bg-zinc-900")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Jump to a deploy, build, service, or environment…"
            aria-label="Search deploys, builds, services, or environments"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          <div className="mb-1">
            <div className="px-2.5 py-1">
              <EyebrowLabel>Environments</EyebrowLabel>
            </div>
            {matchedEnvironments.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching environments.</p>
            ) : (
              matchedEnvironments.map((env) => (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => onJumpToEnvironment(env.id)}
                  className={cx("flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                >
                  <span className="flex min-w-0 items-center gap-2 truncate">
                    <Waypoints size={14} aria-hidden="true" className={TEXT_CAPTION} />
                    <StatusDot tone={ENV_STATUS_TONE[env.status]} label={env.name} />
                  </span>
                  <span className={cx("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium", ACCENT_SUBTLE)}>Filter feed</span>
                </button>
              ))
            )}
          </div>

          <div>
            <div className="px-2.5 py-1">
              <EyebrowLabel>{q === "" ? "Recent activity" : "Matching activity"}</EyebrowLabel>
            </div>
            {matchedEvents.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching deploys or builds.</p>
            ) : (
              matchedEvents.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => onJumpToEvent(e.id)}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                >
                  <GitCommitHorizontal size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  <span className="min-w-0 flex-1 truncate">
                    {SERVICE_BY_ID[e.serviceId].name} &middot; {e.commitMessage}
                  </span>
                  <span className={cx("shrink-0 text-xs", TEXT_CAPTION)}>{formatRelative(e.startedAtMs)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
