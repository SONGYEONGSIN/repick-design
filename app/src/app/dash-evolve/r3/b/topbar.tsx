import { Menu, Search, Bell, Plus, Settings, LogOut } from "lucide-react";
import { cn, FOCUS_RING } from "./cn";
import { Avatar, Popover } from "./ui";

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "WL-104 delayed at Port Terminal",
    detail: "Held at security checkpoint · 31 min behind schedule",
    time: "4m ago",
  },
  {
    id: "n2",
    title: "Delivery DEL-3370 failed",
    detail: "Riverside Flowers — recipient unavailable",
    time: "22m ago",
  },
  {
    id: "n3",
    title: "WL-112 entered maintenance",
    detail: "Scheduled service until 16:00",
    time: "1h ago",
  },
] as const;

export function Topbar({
  onOpenSidebar,
  onOpenPalette,
}: {
  onOpenSidebar: () => void;
  onOpenPalette: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-[65px] items-center gap-3 border-b border-white/10 bg-zinc-950/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
        className={cn(
          FOCUS_RING,
          "flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/5 lg:hidden",
        )}
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={cn(
          FOCUS_RING,
          "flex h-[44px] w-full min-w-0 max-w-sm items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-400 transition-colors hover:bg-white/10",
        )}
      >
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <span className="truncate">Search vehicles, deliveries, drivers…</span>
        <kbd className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-sans text-[11px] text-zinc-400 sm:inline-flex">
          &#8984;K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className={cn(
            FOCUS_RING,
            "hidden h-[44px] items-center gap-2 rounded-lg bg-cyan-400 px-3.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-300 sm:inline-flex",
          )}
        >
          <Plus aria-hidden="true" className="size-4" />
          New dispatch
        </button>

        <Popover
          label={null}
          icon={Bell}
          triggerLabel="Notifications"
          showChevron={false}
          align="right"
          triggerClassName="relative w-[44px] justify-center px-0"
        >
          {(close) => (
            <div className="w-72">
              <p className="px-2 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Notifications
              </p>
              <ul className="max-h-72 space-y-0.5 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={close}
                      className={cn(
                        FOCUS_RING,
                        "block w-full rounded-md px-2 py-2 text-left hover:bg-white/5",
                      )}
                    >
                      <p className="text-sm font-medium text-zinc-100">{n.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">{n.detail}</p>
                      <p className="mt-1 text-[11px] text-zinc-400">{n.time}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Popover>

        <Popover
          label={<Avatar name="Maya Torres" size={28} />}
          triggerLabel="Account menu"
          showChevron={false}
          align="right"
          triggerClassName="w-[44px] justify-center px-0"
        >
          {(close) => (
            <div className="py-1">
              <div className="px-2 pb-2 pt-1">
                <p className="text-sm font-medium text-zinc-100">Maya Torres</p>
                <p className="text-xs text-zinc-400">maya.torres@northline.io</p>
              </div>
              <div className="border-t border-white/10 pt-1">
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
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-zinc-200 hover:bg-white/5",
                  )}
                >
                  <LogOut aria-hidden="true" className="size-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </Popover>
      </div>
    </header>
  );
}
