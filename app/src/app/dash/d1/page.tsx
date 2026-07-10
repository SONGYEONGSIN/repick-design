import type { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "포트폴리오 개요 | OBELISK",
  description:
    "OBELISK 자산 관제 센터 — 패밀리오피스와 전문 트레이더를 위한 실시간 리스크·포지션·상관관계 대시보드.",
};

export default function Dashboard() {
  return <DashboardClient />;
}
