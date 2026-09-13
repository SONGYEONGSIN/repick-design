import type { Metadata } from "next";
import LedgerlineClient from "./LedgerlineClient";

export const metadata: Metadata = {
  title: "Ledgerline — Payments Operations Console",
  description:
    "Ledgerline is a payments-operations console. A live ledger of charges, refunds, payouts and disputes is the main feed, flanked by a platform-health rail on the left and a revenue-mix sunburst (region, channel, plan tier) on the right — pinning a ledger row updates only the account rollup card, and drilling into the sunburst never filters the feed. The sunburst ships with its required fallback: the same hierarchy as a collapsible indented list with every percentage printed as standing text.",
};

export default function Page() {
  return <LedgerlineClient />;
}
