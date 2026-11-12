"use client";

import { GitPullRequest, ShieldCheck, History, Settings } from "lucide-react";

// `icon` is typed by inference from the lucide components themselves — the package does not
// export a public `LucideIcon` type to annotate this array with.
export const NAV_ITEMS = [
  { id: "releases" as const, label: "Releases", icon: GitPullRequest },
  { id: "policies" as const, label: "Policies", icon: ShieldCheck },
  { id: "audit" as const, label: "Audit log", icon: History },
  { id: "settings" as const, label: "Settings", icon: Settings },
];

export type NavId = (typeof NAV_ITEMS)[number]["id"];

/** Rendered at two mount points (desktop aside + mobile drawer) — `onNavigate` must be the real
 *  handler at BOTH, never a no-op at one of them (the mobile-works/desktop-silently-doesn't bug
 *  this brief calls out). */
export function Nav({ active, onNavigate }: { active: NavId; onNavigate: (id: NavId) => void }) {
  return (
    <nav aria-label="Primary" className="flex-1 space-y-1 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              isActive ? "bg-blue-50 text-blue-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
