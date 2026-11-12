import type { Metadata } from "next";
import { LandingClient } from "./components/landing-client";

export const metadata: Metadata = {
  title: "repick — Why this match",
  description:
    "See exactly which signal is driving an AI match score, live: three weighted dials re-partition a real item's condition, brand-fit and price-fit signals in front of you.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-zinc-300">
      <LandingClient />
    </div>
  );
}
