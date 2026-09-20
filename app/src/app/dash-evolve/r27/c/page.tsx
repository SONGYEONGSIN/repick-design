import type { Metadata } from "next";
import VantageClient from "./VantageClient";

export const metadata: Metadata = {
  title: "Vantage — Vendor Comparison",
  description:
    "Vantage compares three contract-packaging vendors across seven fixed risk axes on a hand-built SVG radar, with a persistent, always-visible score table beneath it as the exact-value fallback — plus a legend-driven radar toggle and an independent table-selection spotlight card.",
};

export default function Page() {
  return <VantageClient />;
}
