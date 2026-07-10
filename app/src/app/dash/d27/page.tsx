import type { Metadata } from "next";
import { AsRunApp } from "./as-run-app";
import { WEEK, WEEKLY_SUMMARY, REVIEW_QUEUE, DEFAULT_PROGRAM_ID } from "./data";

export const metadata: Metadata = {
  title: "AS-RUN — 편성 트래픽 로그",
  description: "아우로라방송 8개 채널의 주간 편성표, 시청률, 광고 슬롯 판매, 심의 일정을 한 화면에서 관리하는 편성 운영 시스템.",
};

export default function Page() {
  return (
    <AsRunApp
      week={WEEK}
      summary={WEEKLY_SUMMARY}
      reviewQueue={REVIEW_QUEUE}
      defaultProgramId={DEFAULT_PROGRAM_ID}
    />
  );
}
