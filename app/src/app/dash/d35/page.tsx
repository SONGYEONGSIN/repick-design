import type { Metadata } from "next";
import Cockpit from "./cockpit";

export const metadata: Metadata = {
  title: "Tessera — 자산배분 트리맵 콕핏",
  description:
    "Tessera는 개인 자산배분을 대형 트리맵으로 관제하는 웰스 매니지먼트 대시보드입니다. 타일 크기는 평가액, 색조는 손익 방향과 강도를 인코딩하며 종목을 선택하면 상세 패널과 보유 테이블이 동기화됩니다.",
};

export default function Page() {
  return <Cockpit />;
}
