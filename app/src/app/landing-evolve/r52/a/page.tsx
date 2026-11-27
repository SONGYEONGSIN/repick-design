import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "repick — Sell it at the moment buyers actually want it",
  description:
    "repick's AI match engine tracks price and buyer demand together. Drag the listing-age timeline to see match score, price, and buyer pool recompute live.",
};

export default function Page() {
  return <LandingClient />;
}
