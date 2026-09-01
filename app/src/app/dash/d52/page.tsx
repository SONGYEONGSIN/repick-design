import type { Metadata } from "next";
import FloorlineTerminal from "./client";

export const metadata: Metadata = {
  title: "Floorline — Comp Terminal",
  description:
    "Internal pricing-intelligence terminal for repick's pricing ops team: repick avg, external market comps, and floor price bands per tracked model.",
};

export default function Page() {
  return <FloorlineTerminal />;
}
