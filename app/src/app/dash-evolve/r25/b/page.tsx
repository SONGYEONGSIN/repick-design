import type { Metadata } from "next";
import PayoutsClient from "./PayoutsClient";

export const metadata: Metadata = {
  title: "Payline — Payouts Console",
  description:
    "Payline is Repick Marketplace's payout operations console. A single dominant hero number leads the page — net payout volume for the selected window, with a light inline strip of supporting stats beneath it — backed by a volume trend chart and a sortable settlement-run table. Pinning a run opens its breakdown in a side panel without disturbing the aggregate hero figures; hovering a seller name shows an independent, ephemeral preview.",
};

export default function Page() {
  return <PayoutsClient />;
}
