import type { Metadata } from "next";
import LandingClient from "./landing-client";

export const metadata: Metadata = {
  title: "RE:픽 — AI가 다시 고르는 중고",
  description:
    "AI가 당신의 취향을 학습해 수많은 중고 상품 중 지금 당신에게 맞는 것만 다시 골라드립니다.",
};

export default function Page() {
  return <LandingClient />;
}
