import type { Metadata } from "next";
import ProofDeck from "./ui";

export const metadata: Metadata = {
  title: "RE:픽 — 숫자로 증명하는 AI 중고 매칭",
  description:
    "RE:픽은 AI 매칭 정확도, 평균 절약 금액, 12단계 검수까지 모든 지표를 데이터로 증명합니다. 구매자·판매자 관점을 전환하며 스크롤로 넘기는 프루프 덱에서 직접 확인하세요.",
};

export default function Page() {
  return <ProofDeck />;
}
