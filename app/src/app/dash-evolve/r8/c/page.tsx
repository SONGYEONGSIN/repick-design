import type { Metadata } from "next";
import TreeClient from "./TreeClient";

export const metadata: Metadata = {
  title: "Canopy — 조직도 & 캐파시티",
  description:
    "Canopy는 People Ops 팀을 위한 조직·캐파시티 인텔리전스 대시보드다. Solace Systems의 보고 구조를 최상단 회사 노드에서 부문·팀으로 뻗어나가는 branching 트리로 시각화하며, 각 카드는 헤드카운트와 가동률을 색+막대 2차원으로 즉시 읽을 수 있게 인코딩한다. 노드를 선택하면 상세 패널과 팀 로스터 테이블이 함께 동기화된다.",
};

export default function Page() {
  return <TreeClient />;
}
