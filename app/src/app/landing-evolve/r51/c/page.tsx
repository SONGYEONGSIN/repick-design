import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "repick — Draw your own budget curve",
  description:
    "Set six independent monthly budget points on repick's live curve editor and watch your total, estimated finds, and savings versus retail recompute from the real shape you draw.",
};

export default function Page() {
  return <LandingClient />;
}
