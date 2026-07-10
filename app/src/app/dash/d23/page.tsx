import type { Metadata } from "next";
import DashClient from "./DashClient";

export const metadata: Metadata = {
  title: "DATUM — 프로젝트·시공 관제",
  description: "건축사사무소를 위한 설계·인허가·시공 단계 통합 관제 대시보드.",
};

export default function Page() {
  return <DashClient />;
}
