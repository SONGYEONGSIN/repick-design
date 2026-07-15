import {
  Waypoints,
  Map,
  PackageSearch,
  Truck,
  Users,
  BarChart3,
  Settings,
  X,
} from "lucide-react";
import { cn, FOCUS_RING } from "./cn";
import { Avatar, Popover } from "./ui";

const NAV_ITEMS = [
  { label: "Live map", icon: Map, active: true },
  { label: "Deliveries", icon: PackageSearch, active: false },
  { label: "Fleet", icon: Truck, active: false },
  { label: "Drivers", icon: Users, active: false },
  { label: "Reports", icon: BarChart3, active: false },
] as const;

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950 transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[44px] items-center justify-between gap-2 px-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-cyan-400/15 text-cyan-300">
              <Waypoints aria-hidden="true" className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-zinc-50">Waylight</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className={cn(FOCUS_RING, "rounded-md p-1 text-zinc-400 hover:bg-white/5 lg:hidden")}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="px-3 pt-5">
          <Popover
            label={<span className="truncate">Northline Logistics</span>}
            align="left"
            fixedHeight={false}
            triggerClassName="w-full justify-between"
            panelClassName="w-full"
          >
            {(close) => (
              <div className="py-1">
                <p className="px-2 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  Workspaces
                </p>
                {["Northline Logistics", "Cascade Freight Co."].map((ws) => (
                  <button
                    key={ws}
                    type="button"
                    onClick={close}
                    className={cn(
                      FOCUS_RING,
                      "block w-full rounded-md px-2 py-1.5 text-left text-sm text-zinc-200 hover:bg-white/5",
                    )}
                  >
                    {ws}
                  </button>
                ))}
              </div>
            )}
          </Popover>
        </div>

        <nav aria-label="Primary" className="mt-4 flex-1 space-y-0.5 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  FOCUS_RING,
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-cyan-400/10 text-cyan-200"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Popover
            label={
              <span className="flex min-w-0 items-center gap-2.5">
                <Avatar name="Yuna Song" size={28} />
                <span className="flex min-w-0 flex-col items-start leading-tight">
                  <span className="truncate text-sm font-medium text-zinc-100">Yuna Song</span>
                  <span className="truncate text-xs text-zinc-400">Dispatch lead</span>
                </span>
              </span>
            }
            align="left"
            side="top"
            fixedHeight={false}
            triggerClassName="w-full justify-between"
            panelClassName="w-full"
          >
            {(close) => (
              <div className="py-1">
                <button
                  type="button"
                  onClick={close}
                  className={cn(
                    FOCUS_RING,
                    "block w-full rounded-md px-2 py-1.5 text-left text-sm text-zinc-200 hover:bg-white/5",
                  )}
                >
                  Account settings
                </button>
                <button
                  type="button"
                  onClick={close}
                  className={cn(
                    FOCUS_RING,
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-zinc-200 hover:bg-white/5",
                  )}
                >
                  <Settings aria-hidden="true" className="size-4" />
                  Preferences
                </button>
                <button
                  type="button"
                  onClick={close}
                  className={cn(
                    FOCUS_RING,
                    "block w-full rounded-md px-2 py-1.5 text-left text-sm text-zinc-200 hover:bg-white/5",
                  )}
                >
                  Sign out
                </button>
              </div>
            )}
          </Popover>
        </div>
      </aside>
    </>
  );
}
