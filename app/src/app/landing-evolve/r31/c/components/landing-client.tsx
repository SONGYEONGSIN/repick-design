"use client";

import { useCallback, useState } from "react";
import { DEFAULT_SELECTIONS, type Selections } from "./data";
import { ClosingCta } from "./closing-cta";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import { RecentSold } from "./recent-sold";
import { SocialProof } from "./social-proof";
import { ValueSplit } from "./value-split";

export function LandingClient() {
  const [selections, setSelections] = useState<Selections>(DEFAULT_SELECTIONS);

  const onSelect = useCallback((key: keyof Selections, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }) as Selections);
  }, []);

  const onReset = useCallback(() => {
    setSelections(DEFAULT_SELECTIONS);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#AE9BFF] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0B0B0F]"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero selections={selections} onSelect={onSelect} onReset={onReset} />
        <RecentSold />
        <ValueSplit />
        <SocialProof />
        <ClosingCta selections={selections} />
      </main>
      <Footer />
    </>
  );
}
