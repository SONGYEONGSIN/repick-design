import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "RE:픽 — AI 매칭 정확도 다이얼로 확인하는 중고 매칭",
  description:
    "취향 프로필·사이즈·예산·컨디션 등급·시세 다섯 기준이 실시간으로 채워지는 원형 다이얼로 AI 매칭 점수를 계산합니다. 기준을 선택하면 근거가 바로 열립니다.",
};

export default function Page() {
  return <LandingClient />;
}
