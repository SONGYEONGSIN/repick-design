import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "repick — Watch the route, not just the ETA",
  description:
    "Change the shipping speed and watch the AI-verified route from seller to buyer — and the ETA and cost at every stop along it — recompute live.",
};

export default function Page() {
  return <LandingPage />;
}
