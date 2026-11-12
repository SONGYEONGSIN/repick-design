import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "repick — Describe it. Matches surface instantly.",
  description:
    "Type a brand, category or model into repick's live search and watch verified sold/listed comps narrow in real time, each with its match percentage, condition grade, seller verification and discount already attached — repick's AI-assisted resale marketplace.",
};

export default function Page() {
  return <LandingClient />;
}
