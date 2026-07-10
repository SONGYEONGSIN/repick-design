import type { Metadata } from "next";
import LandingClient from "./landing-client";

export const metadata: Metadata = {
  title: "덕지 — 오리고 붙이면, 오늘이 된다",
  description:
    "덕지는 필름 인화·마스킹테이프·손글씨 스티커를 매달 우편함으로 보내고, 앱으로 오늘의 조각을 모아 나만의 콜라주 다이어리를 완성하게 하는 정기구독입니다.",
};

export default function Landing() {
  return <LandingClient />;
}
