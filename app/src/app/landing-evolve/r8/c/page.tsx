import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "repick — See the Match, Layer by Layer",
  description:
    "repick's AI grades every listing on five criteria — Style Fit, Size, Condition, Price, Trend — stacked like transparent film sheets. Pull any layer forward to read the exact reasoning behind its score.",
};

export default function Page() {
  return <LandingClient />;
}
