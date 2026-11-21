"use client";

import { useEffect, useState } from "react";
import { CalendarRange, ChevronLeft, Filter, Headphones, PinOff, Trophy } from "lucide-react";
import { Sidebar, MobileSidebarDrawer } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette, type PaletteCommand } from "./CommandPalette";
import { CallListRail, type SentimentFilter, type SortMode } from "./CallListRail";
import { SpotlightCard } from "./SpotlightCard";
import { CoachingDigest } from "./CoachingDigest";
import { CALLS, callById, type Call, type Period } from "./data";
import { FOCUS } from "./ui";

const DIGEST_ANCHOR_ID = "coaching-digest";

/**
 * Macro layout: a fixed-width list rail (`lg:w-80 lg:shrink-0`) plus a `flex-1 min-w-0` detail
 * pane — classic master-detail. The selection fan-out inside it deliberately uses two
 * independently-scoped axes on two different widget clusters, instead of one shared rebuild:
 *
 * 1. `pinnedId` — set only by clicking/activating a row in the list rail. Its one and only
 *    consumer is `<SpotlightCard>`, a header-area summary widget. It never reaches
 *    `<CoachingDigest>`, which stays the same team-wide view no matter which call is pinned.
 * 2. `hoveredTopic` — set only by hovering or keyboard-focusing a segment of the topic-mix bar
 *    inside `<CoachingDigest>`. It is ephemeral (cleared on blur/mouse-leave, never persisted) and
 *    feeds only that bar's own inline inspector; it never touches `pinnedId` or the Spotlight card.
 *
 * `period` is a third, separate toggle that swaps the whole digest dataset — again untouched by
 * either selection above.
 */
export function ClearcallClient() {
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("week");

  const [query, setQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");

  // Mobile-only pushed navigation: the list rail and detail pane are two full-width screens below
  // `lg`, never squashed side by side. Selecting a call pushes into "detail"; a back button in the
  // detail pane returns to "list". At `lg` and up this state is inert — both panes are always
  // shown via the `lg:block` override on each wrapper below.
  const [mobileScreen, setMobileScreen] = useState<"list" | "detail">("list");
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

  function selectCall(call: Call) {
    setPinnedId(call.id);
    setMobileScreen("detail");
  }

  const pinnedCall = pinnedId ? callById(pinnedId) ?? null : null;

  const commands: PaletteCommand[] = [
    ...CALLS.map((call) => ({
      id: `call-${call.id}`,
      group: "Open call",
      label: `${call.title} — ${call.account}`,
      hint: call.date,
      icon: Headphones,
      run: () => selectCall(call),
    })),
    {
      id: "clear-spotlight",
      group: "Spotlight",
      label: "Clear spotlight",
      hint: "Deselect call",
      icon: PinOff,
      run: () => setPinnedId(null),
    },
    {
      id: "period-week",
      group: "Digest",
      label: "View this week's digest",
      hint: "Period",
      icon: CalendarRange,
      run: () => setPeriod("week"),
    },
    {
      id: "period-month",
      group: "Digest",
      label: "View this month's digest",
      hint: "Period",
      icon: CalendarRange,
      run: () => setPeriod("month"),
    },
    {
      id: "clear-filters",
      group: "Calls",
      label: "Clear search & filters",
      hint: "Reset list",
      icon: Filter,
      run: () => {
        setQuery("");
        setSentimentFilter("all");
        setSortMode("recent");
      },
    },
    {
      id: "jump-digest",
      group: "Jump to",
      label: "Coaching digest & leaderboard",
      hint: "Scroll",
      icon: Trophy,
      run: () => {
        setMobileScreen("detail");
        document.getElementById(DIGEST_ANCHOR_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    },
  ];

  return (
    <div className="flex min-h-screen w-full min-w-0 bg-zinc-950 text-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-sky-400 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-zinc-950 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-zinc-50"
      >
        Skip to main content
      </a>

      <Sidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex min-w-0 flex-1 flex-col lg:flex-row">
          <div
            className={`min-w-0 border-white/10 lg:w-80 lg:shrink-0 lg:border-r ${
              mobileScreen === "detail" ? "hidden lg:block" : "block"
            }`}
          >
            <CallListRail
              query={query}
              onQueryChange={setQuery}
              sentimentFilter={sentimentFilter}
              onSentimentFilterChange={setSentimentFilter}
              sortMode={sortMode}
              onSortModeChange={setSortMode}
              pinnedId={pinnedId}
              onSelect={selectCall}
            />
          </div>

          <div className={`min-w-0 flex-1 ${mobileScreen === "list" ? "hidden lg:block" : "block"}`}>
            <div className="flex min-w-0 flex-col gap-4 p-4 sm:p-6 lg:p-8">
              <button
                type="button"
                onClick={() => setMobileScreen("list")}
                className={`${FOCUS} flex h-9 w-fit items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-zinc-400 hover:text-zinc-50 lg:hidden`}
              >
                <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                Back to calls
              </button>

              <SpotlightCard call={pinnedCall} onClear={() => setPinnedId(null)} />
              <CoachingDigest
                id={DIGEST_ANCHOR_ID}
                period={period}
                onPeriodChange={setPeriod}
                hoveredTopic={hoveredTopic}
                onHoverTopic={setHoveredTopic}
              />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
    </div>
  );
}
