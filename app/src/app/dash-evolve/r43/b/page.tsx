import type { Metadata } from "next";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = {
  title: "Driftline — Shrinkage bridge",
  description:
    "Driftline is an inventory shrinkage intelligence console for multi-location retail, built around a per-location shrinkage bridge and an incident-level loss ledger.",
};

export default function Page() {
  return <Dashboard />;
}
