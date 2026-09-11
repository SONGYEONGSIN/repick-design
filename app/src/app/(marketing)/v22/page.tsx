import type { Metadata } from "next";
import ReverseAuctionLedgerLanding from "./client";

export const metadata: Metadata = {
  title: "Reverse Auction Ledger — repick",
  description:
    "A live order book of verified sellers competing for the same sale — re-rank it yourself by weighting price, speed, and trust, and watch the composite score recompute in real time.",
};

export default function Page() {
  return <ReverseAuctionLedgerLanding />;
}
