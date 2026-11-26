import type { Metadata } from "next";

import Client from "./Client";

export const metadata: Metadata = {
  title: "Repick — Climb the grade ladder",
  description:
    "Four condition grades, one price band each — pick a rung and watch the price band, the resale-value horizon, and the defect-tolerance checklist all recompute together, with an independent accessories toggle layered on top.",
};

export default function Page() {
  return <Client />;
}
