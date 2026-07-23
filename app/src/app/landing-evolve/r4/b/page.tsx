import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "RE:픽 — 포인터로 돌려보는 AI 매칭 스포트라이트",
  description:
    "AI가 고른 매물 하나를 3D로 기울여 살펴보세요. 매칭%·컨디션 등급·인증 셀러·할인율은 언제나 카드 정면에 있습니다. 필름스트립을 넘기면 다른 매물로 즉시 전환됩니다.",
};

export default function Page() {
  return <LandingClient />;
}
