import type { Metadata } from "next";
import DashboardClient from "./client";

export const metadata: Metadata = {
  title: "VELA — 딥스페이스 운영 콘솔",
  description: "심우주 안테나망 스케줄링, 우주선 함대 상태, 태양풍 우주 기상 예보를 한 화면에서 관제하는 VELA 운영 대시보드.",
};

export default function Dashboard() {
  return <DashboardClient />;
}
