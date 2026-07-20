import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "RE:픽 — 취향으로 다시 짜이는 라이브 피드",
  description:
    "무드 필터로 실시간 매서너리 피드를 다시 짜고, 카드를 눌러 AI 매칭 근거·컨디션 등급·인증 배지·할인율을 확인하세요.",
};

export default function Page() {
  return <LandingClient />;
}
