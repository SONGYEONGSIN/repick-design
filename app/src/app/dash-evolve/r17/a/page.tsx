import type { Metadata } from "next";
import ConsoleClient from "./ConsoleClient";

export const metadata: Metadata = {
  title: "Backhaul — Recovery Pipeline",
  description:
    "Backhaul is a returns and refurbishment operations console: a six-stage recovery funnel from RMA request to sellable stock, with per-stage drop-off reason codes, a conversion trend, and the individual units held in whichever stage is selected.",
};

export default function Page() {
  return <ConsoleClient />;
}
