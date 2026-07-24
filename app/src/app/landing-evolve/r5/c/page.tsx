import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "RE:픽 — 조건 칩 하나로 다시 계산되는 라이브 매칭 인덱스",
  description:
    "빈티지 자켓 밑 8만원, 정품 인증 스니커즈, 니트 S급 컨디션 — 자연어 검색 조건 칩을 고르면 매칭 근거·AI 매칭%·컨디션 등급·인증 판매자·before/after 할인율이 담긴 인덱스가 그 자리에서 재계산됩니다.",
};

export default function Page() {
  return <LandingClient />;
}
