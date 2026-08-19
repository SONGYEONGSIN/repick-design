import type { Metadata } from "next";
import LiveFeedLanding from "./LiveFeedLanding";
import ProofClosing from "./ProofClosing";

export const metadata: Metadata = {
  title: "Cascade — The Resale Market, Live",
  description:
    "Cascade streams AI-matched, condition-graded, seller-verified resale listings into a live feed the moment they're listed — filterable, pausable, and always showing its proof.",
};

export default function Page() {
  return (
    <>
      <LiveFeedLanding />
      <ProofClosing />
    </>
  );
}
