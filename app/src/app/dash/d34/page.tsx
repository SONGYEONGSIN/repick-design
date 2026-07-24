import type { Metadata } from "next";
import { PulseDashboard } from "./pulse-dashboard";

export const metadata: Metadata = {
  title: "Pulse — 고객 지원 SLA 운영 콘솔",
  description:
    "Pulse는 채널별 대기열, 에이전트 워크로드, 에스컬레이션을 히어로 지표와 벤토 그리드로 한눈에 보여주는 고객 지원 SLA 운영 콘솔입니다.",
};

export default function Page() {
  return <PulseDashboard />;
}
