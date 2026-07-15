import type { Metadata } from "next";
import DashboardClient from "./components/dashboard-client";

export const metadata: Metadata = {
  title: "Fieldset — 딜 파이프라인",
  description: "상태별로 그룹화된 대형 데이터 그리드에서 세일즈 딜을 정렬·필터링하고 우측 드로어로 상세를 검토하는 CRM 대시보드입니다.",
};

export default function Page() {
  return <DashboardClient />;
}
