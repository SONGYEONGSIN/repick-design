"use client";

import { useState } from "react";
import { ClosingCTA } from "./ClosingCTA";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { DEFAULT_ITEM_COUNT, deriveTradeIn } from "./lib";
import { ProductPreview } from "./ProductPreview";
import { SocialProof } from "./SocialProof";
import { ValueSplit } from "./ValueSplit";

export default function Client() {
  const [count, setCount] = useState(DEFAULT_ITEM_COUNT);
  const result = deriveTradeIn(count);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#0b0b0f] text-white">
      <Header />
      <main className="flex-1">
        <Hero result={result} onChange={setCount} />
        <ProductPreview />
        <ValueSplit />
        <SocialProof />
        <ClosingCTA result={result} />
      </main>
      <Footer />
    </div>
  );
}
