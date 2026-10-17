import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "repick — Sell with a live payout calculator",
  description:
    "Set three counters for Electronics, Fashion and Home and watch repick's itemized seller payout breakdown and category mix update live, with no wizard and no reload.",
};

export default function Page() {
  return <LandingPage />;
}
