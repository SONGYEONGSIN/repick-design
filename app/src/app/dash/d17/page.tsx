import type { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "로열티 관제 콘솔 | AquaChart",
  description:
    "AquaChart — 인디 레이블을 위한 스트리밍 로열티 관제 콘솔. 스트리밍 파형, 아티스트 로스터, 발매 파이프라인, 정산 대기열을 한 화면에서 확인하세요.",
};

export default function Dashboard() {
  return <DashboardClient />;
}
