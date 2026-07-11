import type { Metadata } from "next";
import { DashboardShell } from "./components/DashboardShell";

export const metadata: Metadata = {
  title: "Waypoint — 프로젝트 대시보드",
  description:
    "Waypoint는 프로젝트 진행률, 팀 워크로드, 마감 임박 작업을 한 화면에서 관리하는 팀 협업 대시보드입니다.",
};

export default function Page() {
  return <DashboardShell />;
}
