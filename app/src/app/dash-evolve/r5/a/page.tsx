import type { Metadata } from "next";
import BallastClient from "./components/BallastClient";

export const metadata: Metadata = {
  title: "Ballast — Treasury FX & Cash Risk Desk",
  description:
    "Ballast는 다국적 기업 재무팀을 위한 다통화 FX 및 현금 포지션 리스크 데스크다. 워치리스트에서 통화쌍을 선택하면 중앙 크로스헤어 차트와 우측 상세/체결 패널, 하단 전사 포지션 테이블이 동시에 동기화된다.",
};

export default function Page() {
  return <BallastClient />;
}
