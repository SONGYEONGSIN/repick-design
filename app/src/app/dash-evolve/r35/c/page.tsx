import type { Metadata } from "next";
import CommandDeckClient from "./command-deck";

export const metadata: Metadata = {
  title: "Quadrant — Campaign Correlation",
  description:
    "Quadrant plots every active campaign on a hand-built scatter chart — spend against conversion rate, bubble size showing conversion volume, marker shape showing channel — inside a filter-driven command deck: a filter rail narrows which campaigns appear and recalculates an aggregate cohort panel, while clicking a bubble only pins that one label, on a fully independent axis.",
};

export default function Page() {
  return <CommandDeckClient />;
}
