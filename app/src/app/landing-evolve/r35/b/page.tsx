import type { Metadata } from "next";
import { LandingPage } from "./LandingPage";

export const metadata: Metadata = {
  title: "Repick — Duel your resale picks",
  description:
    "Pick two competing resale listings and let Repick score the head-to-head across price, condition, seller trust, and delivery speed.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] font-sans text-white antialiased">
      <LandingPage />
    </div>
  );
}
