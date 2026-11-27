import type { Metadata } from "next";
import FunnelLanding from "./client";

export const metadata: Metadata = {
  title: "repick — The Funnel",
  description:
    "repick runs every listing through four real stages — AI pre-screen, condition verification, seller authentication and a confidence bar you set — before it ever reaches a feed. Pick a category, set the bar, watch the funnel narrow live.",
};

export default function Page() {
  return <FunnelLanding />;
}
