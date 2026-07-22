import type { Metadata } from "next";
import QuorumClient from "./QuorumClient";

export const metadata: Metadata = {
  title: "Quorum — Renewal Health Console",
  description:
    "Quorum is a customer-success renewal-health console for CS managers. A hero zone surfaces at-risk ARR for the quarter with an inline trend sparkline, below which a health-score x ARR quadrant scatter plots every account into Champions, At Risk, Nurture, and Stable segments with always-visible axis ticks and risk labels. Selecting a point syncs an account detail rail (health trend, renewal date, ARR, recent support/usage signals), clicking a quadrant label filters the account table, and a this-quarter / trailing-12mo toggle re-plots the whole view against a different snapshot.",
};

export default function Page() {
  return <QuorumClient />;
}
