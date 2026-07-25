import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "repick — Instant AI Estimate",
  description:
    "Pick your item's category, condition, and target price and watch a verified AI estimate certificate generate in real time — fair price, condition grade, and match score, itemized.",
};

export default function Page() {
  return <LandingClient />;
}
