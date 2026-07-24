import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "RE:픽 — 옷장 레일을 밀면 AI가 다시 골라줍니다",
  description:
    "일반 옷장처럼 밀집한 매물 구간을 손끝으로 밀면 매칭%·컨디션 등급·인증 배지·before/after 할인율이 상시 노출되는 AI 큐레이션 캡슐 구간이 나타납니다.",
};

export default function Page() {
  return <LandingClient />;
}
