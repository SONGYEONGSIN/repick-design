import type { Metadata } from "next";
import TrustScoreConsoleLanding from "./client";

export const metadata: Metadata = {
  title: "Trust Score Console — Repick",
  description: "A composite Trust Score you can re-weight yourself — drag seller history, authenticity, condition, and price fairness and watch a real listing's score recompute live.",
};

export default function Page() {
  return <TrustScoreConsoleLanding />;
}
