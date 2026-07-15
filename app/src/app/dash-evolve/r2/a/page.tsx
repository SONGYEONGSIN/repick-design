import type { Metadata } from "next";
import CadenceClient from "./components/CadenceClient";

export const metadata: Metadata = {
  title: "Cadence — 발행 캘린더",
  description: "Cadence는 소셜 채널 게시물을 월간·주간 캘린더에서 계획하고 발행하는 콘텐츠 스케줄링 대시보드입니다.",
};

export default function Page() {
  return <CadenceClient />;
}
