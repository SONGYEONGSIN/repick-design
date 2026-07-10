import type { Metadata } from "next";
import DashboardClient from "./client";

export const metadata: Metadata = {
  title: "커맨드 덱 — MANIFEST",
  description: "글로벌 허브 네트워크와 매니페스트를 실시간 스냅샷으로 관제하는 MANIFEST 운영 대시보드.",
};

export default function Dashboard() {
  return <DashboardClient />;
}
