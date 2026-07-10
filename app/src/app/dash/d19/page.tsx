import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Planche — Collection Command",
  description: "메종 컬렉션 MD 관제 대시보드 — 셀스루, 런웨이→리테일 파이프라인, 룩북 라인업, 리테일 도어 퍼포먼스.",
};

export default function Dashboard() {
  return <DashboardClient />;
}
