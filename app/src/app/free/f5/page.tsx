import type { Metadata } from "next";
import LandingF5Client from "./landing-f5-client";

export const metadata: Metadata = {
  title: "TIMBRE — 당신의 목소리로 조향한 향수",
  description:
    "15초의 목소리를 음향 스펙트럼으로 분석해, 세상에 하나뿐인 향수를 조향합니다. TIMBRE, 음성 지문 향수 하우스.",
};

export default function Landing() {
  return <LandingF5Client />;
}
