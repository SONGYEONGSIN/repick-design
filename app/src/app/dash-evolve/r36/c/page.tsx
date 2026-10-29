import type { Metadata } from "next";
import CommandDeckClient from "./command-deck";

export const metadata: Metadata = {
  title: "Quadrant — Campaign correlation",
  description:
    "A marketing command deck plotting campaigns by spend against conversion rate on a quadrant scatter chart, with a left filter rail that recomputes the cohort summary and chart together while pinning stays local to the chart itself.",
};

export default function Page() {
  return <CommandDeckClient />;
}
