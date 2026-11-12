import type { Metadata } from "next";
import GatelistLanding from "./client";

export const metadata: Metadata = {
  title: "Gatelist — The gate chain",
  description:
    "Switch on the resale requirements you actually care about — verified seller, original packaging, no visible wear, same-day dispatch, price match — and watch each listing pass or stop at every gate, live, with a qualifying count that updates as you go.",
};

export default function Page() {
  return <GatelistLanding />;
}
