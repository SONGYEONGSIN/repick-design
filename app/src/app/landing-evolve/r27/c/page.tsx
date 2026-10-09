import type { Metadata } from "next";
import SlopeLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Fair-Price Slope",
  description:
    "repick plots every listing's asking price against its AI-verified fair price on two connected axes — pick a pricing scenario and watch every line's slope recalculate live.",
};

export default function Page() {
  return <SlopeLanding />;
}
