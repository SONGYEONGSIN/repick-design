import type { Metadata } from "next";
import { LedgerflowClient } from "./LedgerflowClient";

export const metadata: Metadata = {
  title: "Ledgerflow — Revenue overview",
  description:
    "Ledgerflow is a subscription billing and revenue console. Its home view leads with one hero MRR figure and four inline movement stats, then a per-plan revenue-bridge waterfall grid and a sortable accounts table — deliberately no single dominant chart.",
};

export default function Page() {
  return <LedgerflowClient />;
}
