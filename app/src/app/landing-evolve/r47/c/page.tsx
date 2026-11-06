import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "repick — See where every item actually goes",
  description:
    "A Sankey-style allocation flow sorts your inbound batch into Pass-as-is, Refurbish-then-sell and Fail-rejected, and reflows live as you tighten or relax inspection strictness — repick's AI-assisted resale marketplace.",
};

export default function Page() {
  return <LandingClient />;
}
