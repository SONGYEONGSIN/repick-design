import type { Metadata } from "next";
import ParallelCoordinatesLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Compare on every axis",
  description:
    "repick plots every active listing across price, condition, AI match, seller rating and distance at once — pick a priority axis and watch which listing actually wins it, with real numbers to prove it.",
};

export default function Page() {
  return <ParallelCoordinatesLanding />;
}
