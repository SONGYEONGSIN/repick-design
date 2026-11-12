import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "Repick — Matched Resale, Proven Live",
  description:
    "Repick matches secondhand listings to what you actually care about — toggle the signals that matter and watch the match score, savings and listings recompute live.",
};

export default function Page() {
  return <LandingClient />;
}
