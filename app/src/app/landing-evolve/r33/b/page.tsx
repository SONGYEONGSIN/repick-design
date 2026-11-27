import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "repick — priced against the ledger",
  description:
    "repick prices every listing against a filterable calendar of its own closed-sale history — grade, authenticity, and seller verification each re-count the record live.",
};

export default function Page() {
  return <LandingPage />;
}
