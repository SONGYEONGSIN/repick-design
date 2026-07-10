import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "solace — 오늘의 리듬",
  description:
    "수면, 활동, 마음 상태를 하나의 24시간 리듬으로 읽는 조용한 바이오 트래킹 대시보드.",
};

export default function Dashboard() {
  return <DashboardClient />;
}
