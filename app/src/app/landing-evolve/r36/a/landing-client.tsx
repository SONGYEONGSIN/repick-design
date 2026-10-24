"use client";

import { useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import {
  buildCtaLabel,
  categoryById,
  computeCategoryRows,
  gradeById,
  summarizeCategory,
  type CategoryId,
  type GradeId,
} from "./data";
import { Header } from "./header";
import { Hero } from "./hero";
import { ValueSection } from "./value-section";
import { ProductPreview } from "./product-preview";
import { SocialProof } from "./social-proof";
import { ClosingCTA } from "./closing-cta";
import { FOCUS_RING, MUTED_TEXT } from "./tokens";

const SKIP_LINK = `sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-full focus-visible:bg-zinc-950 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS_RING}`;

export function LandingClient() {
  const [categoryId, setCategoryId] = useState<CategoryId>("sneakers");
  const [gradeId, setGradeId] = useState<GradeId>("excellent");
  const [hoveredGradeId, setHoveredGradeId] = useState<GradeId | null>(null);

  // Single source of truth: every section below reads from these same three derived values
  // instead of recomputing (or re-hardcoding) its own copy of the current selection.
  const rows = useMemo(() => computeCategoryRows(categoryId), [categoryId]);
  const selectedRow = useMemo(() => rows.find((r) => r.grade.id === gradeId) ?? rows[0], [rows, gradeId]);
  const summary = useMemo(() => summarizeCategory(rows), [rows]);
  const ctaLabel = useMemo(
    () => buildCtaLabel(categoryById(categoryId), gradeById(gradeId)),
    [categoryId, gradeId]
  );

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      <div className="min-h-screen bg-white text-zinc-950">
        <Header />

        <main id="main">
          <Hero
            categoryId={categoryId}
            gradeId={gradeId}
            onCategoryChange={setCategoryId}
            onGradeChange={setGradeId}
            hoveredGradeId={hoveredGradeId}
            onHoverGrade={setHoveredGradeId}
            rows={rows}
            selectedRow={selectedRow}
            summary={summary}
            ctaLabel={ctaLabel}
          />
          <ValueSection categoryId={categoryId} selectedRow={selectedRow} />
          <ProductPreview />
          <SocialProof />
          <ClosingCTA categoryId={categoryId} selectedRow={selectedRow} ctaLabel={ctaLabel} />
        </main>

        <footer className="border-t border-zinc-200">
          <div className={`mx-auto max-w-[1280px] px-4 py-8 text-xs font-normal ${MUTED_TEXT} sm:px-6 lg:px-8`}>
            &copy; 2026 repick. AI-adjusted prices are a pricing guide, not an appraisal or an offer
            to buy.
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
