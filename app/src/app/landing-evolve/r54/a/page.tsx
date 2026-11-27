import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Switchback — Spotlight the gear buyers already want",
  description:
    "Switchback is a resale marketplace for used trail and camp gear. Drag your weekly spotlight credits across categories and watch your demand fit score and projected views update live.",
};

export default function Page() {
  return <Client />;
}
