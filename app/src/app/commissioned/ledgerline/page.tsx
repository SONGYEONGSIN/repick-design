import type { Metadata } from "next";

import LedgerlineApp from "./LedgerlineApp";

export const metadata: Metadata = {
  title: "Ledgerline — where the money moved",
  description:
    "Business banking for small teams. A movement stream that shows where money came from and where it left, in English or Korean.",
};

export default function LedgerlinePage() {
  return <LedgerlineApp />;
}
