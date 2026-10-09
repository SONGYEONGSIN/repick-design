import type { Metadata } from "next";
import CaliperLanding from "./client";

export const metadata: Metadata = {
  title: "Caliper — Weighted resale matching",
  description:
    "Set three dials for price sensitivity, shipping speed and seller trust and watch Caliper's live leaderboard of matched, graded, verified listings re-rank in real time.",
};

export default function Page() {
  return <CaliperLanding />;
}
