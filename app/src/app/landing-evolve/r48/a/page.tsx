import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "repick — See where every item actually lands",
  description:
    "A proportional sorting diagram splits your inbound batch into Pass as-is, Refurbish-then-sell and Declined, and reflows live as you tighten or relax inspection strictness — repick's AI-assisted resale marketplace.",
};

export default function Page() {
  return <LandingClient />;
}
