import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "repick — Drag the timeline, watch trust add up",
  description:
    "Scrub a continuous timeline across one listing's six-stage lifecycle and watch a live itemized trust ledger fill in, stage by stage, as you drag.",
};

export default function Page() {
  return <LandingPage />;
}
