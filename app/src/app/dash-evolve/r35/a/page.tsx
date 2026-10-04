import type { Metadata } from "next";
import { FluxgateClient } from "./fluxgate-client";

export const metadata: Metadata = {
  title: "Fluxgate — Price Volatility Intelligence",
  description:
    "Fluxgate monitors price volatility across dynamic-pricing surfaces — e-commerce SKUs, airfares, freight lanes, hotel room-nights — and surfaces it as a feed-centric dashboard: a live signal stream drives a candlestick detail panel that only populates once an event is pinned, alongside an always-on watchlist rail and a risk panel.",
};

export default function Page() {
  return <FluxgateClient />;
}
