import type { Metadata } from "next";
import { SaleFloor } from "./sale-floor";

export const metadata: Metadata = {
  title: "ROSTRUM — Sale 214 세일플로어",
  description:
    "ROSTRUM 세일플로어 OS — 경매 카탈로그와 로트 보드를 한 화면에서, 추정가 밴드 대비 낙찰 분포와 응찰 채널을 실시간으로 확인합니다.",
};

export default function Page() {
  return <SaleFloor />;
}
