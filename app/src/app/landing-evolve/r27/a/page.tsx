import type { Metadata } from "next";
import SignalMapLanding from "./client";

export const metadata: Metadata = {
  title: "repick — The Signal Map",
  description:
    "repick scores every listing on five axes — condition, authenticity, price fit, seller trust and demand velocity — then lets you reweight them live and watch the shape redraw.",
};

export default function Page() {
  return <SignalMapLanding />;
}
