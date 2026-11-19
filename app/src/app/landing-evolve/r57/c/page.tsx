import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "repick — Your Selling Timeline",
  description:
    "Pick the seller you are — first listing, regular seller, or trade-in bulk — and watch the real horizontal timeline from listing to payout recompute its stage widths and day counts for that exact path.",
};

export default function Page() {
  return <Client />;
}
