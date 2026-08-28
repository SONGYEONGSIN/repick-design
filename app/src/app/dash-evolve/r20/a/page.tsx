import type { Metadata } from "next";
import RidgeClient from "./RidgeClient";

export const metadata: Metadata = {
  title: "Ridge — Cohort Retention Matrix",
  description:
    "Ridge is a subscription retention console. A triangular cohort-by-month grid carries every logo or revenue retention reading as always-visible white text on a color-banded fill; pinning a cohort row rewrites the grid's own color scale and axis onto a percentage-points-vs-baseline reading, without threading the selection into the KPI strip or the independent cohort ledger below.",
};

export default function Page() {
  return <RidgeClient />;
}
