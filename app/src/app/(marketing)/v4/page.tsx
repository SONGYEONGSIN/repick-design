import type { Metadata } from "next";
import LandingV4Client from "./landing-v4-client";

export const metadata: Metadata = {
  title: "RE:픽 — 질문 3개로 완성하는 나만의 추천",
  description:
    "설명 대신 직접 답해보세요. AI 큐레이터가 묻는 질문 3개에 답하면, 지금 당신에게 맞는 상품이 실시간으로 바뀝니다.",
};

export default function Landing() {
  return <LandingV4Client />;
}
