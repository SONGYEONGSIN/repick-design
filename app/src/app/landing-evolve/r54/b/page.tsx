import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "repick — Drag the window, watch the price answer",
  description:
    "Drag a resizable window over 24 months of real resale prices for a Sony a7 III on repick, and watch the before/inside/after comparison -- and the closing call to action -- update live.",
};

export default function Page() {
  return <Client />;
}
