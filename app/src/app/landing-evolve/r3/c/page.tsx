import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "RE:픽 — 절약 계산기로 바로 확인하는 AI 매칭가",
  description:
    "카테고리와 예산 구간을 고르면 매장 신품가와 repick AI 매칭가를 실시간으로 대조해 절약액을 계산해 드립니다. 짐작이 아니라 숫자로 확인하세요.",
};

export default function Page() {
  return <LandingClient />;
}
