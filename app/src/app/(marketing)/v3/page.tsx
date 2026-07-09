import type { Metadata } from "next";
import LandingV3Client from "./landing-v3-client";

export const metadata: Metadata = {
  title: "RE:픽 — 다시, 고른다는 것",
  description:
    "중고를 다시 고른다는 것에 대한 에디토리얼 에세이. AI가 당신의 취향을 학습해 수많은 중고 상품 중 지금 당신에게 맞는 것만 다시 골라드립니다.",
};

export default function Landing() {
  return <LandingV3Client />;
}
