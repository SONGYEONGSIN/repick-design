import type { Metadata } from "next";
import { LandingClient } from "./components/landing-client";

export const metadata: Metadata = {
  title: "repick — Sell with repick",
  description:
    "Build your listing in four taps — category, condition, brand tier, photos — against a real, itemized payout breakdown that recalculates with every choice.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-zinc-300">
      <LandingClient />
    </div>
  );
}
