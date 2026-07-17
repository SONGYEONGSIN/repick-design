import type { Metadata } from "next";
import BisectClient from "./components/BisectClient";

export const metadata: Metadata = {
  title: "Bisect — Experiment Comparison",
  description:
    "Bisect is an experimentation platform for product teams. This view mirrors Variant A and Variant B side by side — matching KPI cards, same-scale trend charts, and segment breakdowns — with a shared significance readout across the bottom.",
};

export default function Page() {
  return <BisectClient />;
}
