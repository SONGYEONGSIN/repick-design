import type { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "개요 — Conduit",
  description: "워크플로 자동화 파이프라인 실행 현황 대시보드",
};

export default function Page() {
  return <DashboardClient />;
}
