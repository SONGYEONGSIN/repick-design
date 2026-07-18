import type { Metadata } from "next";
import ConsoleLandingClient from "./components/ConsoleLandingClient";

export const metadata: Metadata = {
  title: "RE:픽 — AI가 실시간으로 다시 고르는 중고",
  description:
    "찜과 스킵으로 취향을 학습한 AI가 수만 개의 중고 매물을 실시간으로 스캔해, 지금 당신에게 맞는 것만 다시 골라드립니다. 컨디션 등급과 시세 대비 할인율까지 확인하세요.",
};

export default function Page() {
  return <ConsoleLandingClient />;
}
