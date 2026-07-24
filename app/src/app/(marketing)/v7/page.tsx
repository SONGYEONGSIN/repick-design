import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "RE:픽 — AI 매칭 대조표로 바로 비교하는 일반 거래 vs repick",
  description:
    "가격 근거·컨디션 확인·판매자 신뢰·검색 시간·취향 적합도 다섯 기준을 일반 중고거래와 repick AI 매칭으로 나란히 대조합니다. 카테고리 탭을 바꾸면 표 전체가 실시간으로 재계산됩니다.",
};

export default function Page() {
  return <LandingClient />;
}
