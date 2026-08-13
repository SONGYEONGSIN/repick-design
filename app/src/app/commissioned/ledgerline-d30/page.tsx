import type { Metadata } from "next";

import LedgerlineApp from "./LedgerlineApp";

export const metadata: Metadata = {
  title: "Ledgerline — business banking dashboard",
  description:
    "Operating, payroll and reserve accounts on one screen: money in, money out, net movement, available balance and the full movement ledger, in English or Korean.",
};

export default function LedgerlinePage() {
  return <LedgerlineApp />;
}
