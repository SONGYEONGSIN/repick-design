import type { Metadata } from "next";
import LandingClient from "./landing-client";

export const metadata: Metadata = {
  title: "Attune — AI Re-Picks Secondhand, Just for You",
  description:
    "AI learns your taste and re-picks only the secondhand finds that match you right now, out of thousands of listings.",
};

export default function Page() {
  return <LandingClient />;
}
