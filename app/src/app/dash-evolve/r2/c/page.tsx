import type { Metadata } from "next";
import DashboardClient from "./components/dashboard-client";

export const metadata: Metadata = {
  title: "Relay — 캠페인 빌더",
  description: "대상·콘텐츠·일정을 편집하면 실시간 미리보기에 즉시 반영되는 이메일 캠페인 빌더 대시보드입니다.",
};

export default function Page() {
  return <DashboardClient />;
}
