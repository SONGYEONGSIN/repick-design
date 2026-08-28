import type { Metadata } from "next";
import LandingClient from "./landing-client";

export const metadata: Metadata = {
  title: "repick — Priced Against What Sold Nearby",
  description:
    "repick compares every listing to verified comparable sales inside a radius you control. Drag the radius and watch the comparable count, price band, and top matches recompute together.",
};

export default function Page() {
  return <LandingClient />;
}
