import type { Metadata } from "next";
import FathomClient from "./FathomClient";

export const metadata: Metadata = {
  title: "Fathom — Treasury Trading Desk",
  description:
    "Fathom is a treasury trading-desk console. A fixed watchlist rail with live sparklines sits left of a candlestick chart that carries its own always-visible price, change, high and low; a hover or keyboard-focused crosshair reads out exact OHLC without touching any other widget's state. The right-hand fill feed shows the whole desk's flow and is deliberately independent of the chart selection.",
};

export default function Page() {
  return <FathomClient />;
}
