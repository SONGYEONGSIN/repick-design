"use client";

import { useCallback, useMemo, useState } from "react";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { CHECKPOINTS, DEFAULT_STATUSES, type CheckpointId, type CheckpointStatus } from "./checkpoint-data";
import { computeVerdict } from "./checkpoint-math";
import { DISPLAY, FOCUS_RING, MUTED_TEXT, ACCENT_FILL, ON_ACCENT_TEXT } from "./tokens";

export function LandingExperience() {
  // Single source of truth for the whole page. Default is 2 of 4 checkpoints already
  // confirmed — a real, non-trivial partial state — never a blank/zero deck on first paint.
  const [statuses, setStatuses] = useState<Record<CheckpointId, CheckpointStatus>>(DEFAULT_STATUSES);

  const verdict = useMemo(() => {
    const inputs = CHECKPOINTS.map((c) => ({ id: c.id, baseScore: c.baseScore, status: statuses[c.id] }));
    return computeVerdict(inputs);
  }, [statuses]);

  const setStatus = useCallback((id: CheckpointId, status: CheckpointStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  }, []);

  const handleConfirm = useCallback((id: CheckpointId) => setStatus(id, "confirmed"), [setStatus]);
  const handleFlag = useCallback((id: CheckpointId) => setStatus(id, "flagged"), [setStatus]);
  const handleUndo = useCallback((id: CheckpointId) => setStatus(id, "pending"), [setStatus]);
  // A reset always returns to the same representative partial-progress default, never to an
  // empty/zero state.
  const handleReset = useCallback(() => setStatuses(DEFAULT_STATUSES), []);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-amber-500 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-zinc-900 ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-zinc-200 px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <span className={`${DISPLAY} text-lg font-extrabold tracking-[-0.02em] text-zinc-900`}>repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#catalog" className={`text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-zinc-900 ${FOCUS_RING} rounded-sm`}>
              Catalog
            </a>
            <a href="#proof-heading" className={`text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-zinc-900 ${FOCUS_RING} rounded-sm`}>
              Reviews
            </a>
          </nav>
          <a
            href="#hero-heading"
            className={`rounded-full ${ACCENT_FILL} px-4 py-2 text-sm font-semibold ${ON_ACCENT_TEXT} transition-colors duration-200 hover:bg-amber-400 ${FOCUS_RING}`}
          >
            List an item
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero
          checkpoints={CHECKPOINTS}
          statuses={statuses}
          verdict={verdict}
          onConfirm={handleConfirm}
          onFlag={handleFlag}
          onUndo={handleUndo}
          onReset={handleReset}
        />
        <ProductPreview />
        <ValueSplit verdict={verdict} />
        <SocialProof />
        <ClosingCTA verdict={verdict} />
      </main>

      <footer className="border-t border-zinc-200 px-4 py-10 sm:px-6 lg:px-10">
        <div className={`mx-auto flex max-w-[1440px] flex-col gap-2 text-xs font-normal ${MUTED_TEXT} sm:flex-row sm:items-center sm:justify-between`}>
          <span>© 2026 repick. Checkpoint results are an estimate, confirmed at final inspection.</span>
          <span>Trust score and price range are illustrative figures for this demo listing.</span>
        </div>
      </footer>
    </div>
  );
}
