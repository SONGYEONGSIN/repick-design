import type { Metadata } from "next";
import PriceLabLanding from "./client";

export const metadata: Metadata = {
  title: "Price Lab — repick",
  description:
    "Type the exact price you want to ask for a resale item and watch repick recompute your sell probability, days-to-sell and nearest comparable sales live, no slider required.",
};

export default function Page() {
  return <PriceLabLanding />;
}
