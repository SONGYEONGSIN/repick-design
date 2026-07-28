import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "repick — Five Channels, One Verdict",
  description:
    "repick's AI grades every match on five independent channels — taste, size, budget, condition, and price — and mixes them into one score you can inspect, not just trust.",
};

export default function Page() {
  return <LandingClient />;
}
