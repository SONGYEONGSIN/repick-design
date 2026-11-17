import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "GRIDLINE — Pick a zone, resale adjusts with you",
  description:
    "Peer-to-peer sneaker and streetwear resale with neighborhood pickup zones. Pick a zone on the grid and watch pickup time, fees, and matched inventory recompute live.",
};

export default function Page() {
  return <Client />;
}
