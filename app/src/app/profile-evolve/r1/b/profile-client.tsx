"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { CategoryKey } from "./data";
import ActivityHeatmap from "./activity-heatmap";
import IntegrationsPanel from "./integrations-panel";
import Sidebar from "./sidebar";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const DISPLAY_FONT = { fontFamily: "var(--font-display-mono)" } as const;

export default function ProfileClient() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);

  function toggleCategory(key: CategoryKey) {
    setActiveCategory((cur) => (cur === key ? null : key));
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span
              className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-400"
              style={DISPLAY_FONT}
            >
              Loopwire
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-zinc-700" />
            <span className="text-sm font-normal text-zinc-400">Developers</span>
          </div>
          <Link
            href="/catalog"
            className={`inline-flex items-center gap-1 rounded-md text-sm font-medium text-zinc-300 transition-colors hover:text-amber-300 ${FOCUS}`}
          >
            Browse marketplace
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[292px_1fr] lg:gap-8">
          <div className="min-w-0">
            <Sidebar activeCategory={activeCategory} onToggleCategory={toggleCategory} />
          </div>
          <div className="flex min-w-0 flex-col gap-6">
            <ActivityHeatmap />
            <IntegrationsPanel activeCategory={activeCategory} onClearCategory={() => setActiveCategory(null)} />
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800/80">
        <div className="mx-auto max-w-[1180px] px-4 py-6 text-xs font-normal text-zinc-400 sm:px-6 lg:px-8">
          Published integrations are reviewed by Loopwire before appearing in the marketplace.
        </div>
      </footer>
    </div>
  );
}
