import type { Metadata } from "next";
import Workspace from "./Workspace";

export const metadata: Metadata = {
  title: "Meshline — 서비스 의존성 그래프",
  description:
    "Meshline은 플랫폼 신뢰성 팀을 위한 서비스 디펜던시 인텔리전스 대시보드다. Bramwell Commerce의 16개 마이크로서비스를 자유 배치된 유기적 웹(force-directed 스타일) 그래프로 시각화하며, 노드 크기는 요청량을, 색은 안정성 또는 응답 지연을 인코딩한다. 노드를 선택하면 상세 패널과 서비스 디렉터리 테이블이 함께 동기화된다.",
};

export default function Page() {
  return <Workspace />;
}
