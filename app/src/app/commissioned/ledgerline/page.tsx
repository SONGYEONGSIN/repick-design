import type { Metadata } from "next";

import LedgerlineDashboard from "./dashboard";

export const metadata: Metadata = {
  title: "Ledgerline — Business banking",
  description:
    "A working balance, the flow that produced it, and every movement behind the number.",
};

export default function Page() {
  return <LedgerlineDashboard />;
}
