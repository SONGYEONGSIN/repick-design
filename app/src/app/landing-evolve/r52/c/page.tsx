import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "repick — type a budget, meet your match",
  description:
    "repick is an AI-matched resale marketplace. Type what you'd actually pay and watch the matches, savings and verification proof recompute live.",
};

export default function Page() {
  return <LandingClient />;
}
