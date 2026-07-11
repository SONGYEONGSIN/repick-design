import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "TIMESLOT — 예약 현황",
  description: "팀 미팅 스케줄링 현황 대시보드",
};

export default function Dashboard() {
  return <DashboardClient />;
}
