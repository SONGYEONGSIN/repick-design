import type { Metadata, Viewport } from "next";
import ForemeDashboard from "./dashboard-client";
import { nameplateFont, serifKrFont } from "./fonts";

export const metadata: Metadata = {
  title: "FORME · 편집국 조판 데스크",
  description: "오늘자 지면 대장 — 취재부터 인쇄까지 기사 파이프라인과 1면 배치를 한 화면에서 관리합니다.",
};

export const viewport: Viewport = {
  themeColor: "#f7f3e8",
};

export default function Page() {
  return (
    <div className={`${nameplateFont.variable} ${serifKrFont.variable}`}>
      <ForemeDashboard />
    </div>
  );
}
