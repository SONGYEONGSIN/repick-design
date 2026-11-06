import type { Metadata } from "next";
import { LandingClient } from "./landing-client";

export const metadata: Metadata = {
  title: "repick — A grade is a claim, the price should agree",
  description:
    "Move a condition grade and a category and repick's AI-adjusted price recomputes live against every seller's asking price, line by line, across sixteen real comparables.",
};

export default function Page() {
  return <LandingClient />;
}
