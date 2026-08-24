import type { Metadata } from "next";
import RetentionClient from "./RetentionClient";

export const metadata: Metadata = {
  title: "Trellis — 코호트 리텐션 콘솔",
  description:
    "페이지 전체가 하나의 코호트 잔존 삼각행렬인 SaaS 리텐션 분석 콘솔. 코호트 한 줄을 기준선으로 고정하면 격자의 인코딩 자체가 절대 잔존율에서 기준 대비 델타로 바뀐다.",
};

export default function Page() {
  return <RetentionClient />;
}
