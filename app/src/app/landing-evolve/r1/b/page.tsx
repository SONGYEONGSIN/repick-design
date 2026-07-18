import type { Metadata } from "next";
import JourneyClient from "./components/JourneyClient";

export const metadata: Metadata = {
  title: "RE:픽 — AI 매칭부터 안심 배송까지, 다시 고르는 여정",
  description:
    "AI 매칭 → 전문 검수 → 안심 배송으로 이어지는 중고 거래 여정을 세로 스크롤 타임라인으로 따라가며, 추천 근거와 검수 리포트, 실시간 배송까지 단계별로 확인하세요.",
};

export default function Page() {
  return <JourneyClient />;
}
