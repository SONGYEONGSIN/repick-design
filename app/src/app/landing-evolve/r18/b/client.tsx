"use client";

import { useState } from "react";
import { CATEGORIES, getMatchesForCategory, type CategoryId } from "./data";
import { COLOR } from "./theme";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSplit from "./ValueSplit";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";

export default function MatchingBoardLanding() {
  const [categoryId, setCategoryId] = useState<CategoryId>("all");
  const matches = getMatchesForCategory(categoryId);
  const categoryLabel = CATEGORIES.find((c) => c.id === categoryId)?.label ?? "All matches";

  return (
    <main style={{ background: COLOR.bg, color: COLOR.fg, fontFamily: "var(--font-sans)" }}>
      <Hero
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        matches={matches}
        categoryLabel={categoryLabel}
      />
      <ProductPreview matches={matches} categoryLabel={categoryLabel} />
      <ValueSplit matches={matches} categoryLabel={categoryLabel} />
      <SocialProof />
      <ClosingCTA matches={matches} categoryLabel={categoryLabel} />
    </main>
  );
}
