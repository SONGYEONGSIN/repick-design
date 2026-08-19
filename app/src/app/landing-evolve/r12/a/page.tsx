import type { Metadata } from "next";
import { SkipLink, SiteHeader, SiteFooter } from "./Chrome";
import LiveFeedLanding from "./LiveFeedLanding";
import ProofClosing from "./ProofClosing";

export const metadata: Metadata = {
  title: "Cascade — The Resale Market, Live",
  description:
    "Cascade streams AI-matched, condition-graded, seller-verified resale listings into a live feed the moment they're listed — filterable, pausable, and always showing its proof.",
};

export default function Page() {
  return (
    <div className="bg-[#0B0B0F]">
      <SkipLink />
      <SiteHeader />
      <main id="main-content">
        <LiveFeedLanding />
        <ProofClosing />
      </main>
      <SiteFooter />
    </div>
  );
}
