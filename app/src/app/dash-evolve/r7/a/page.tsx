import type { Metadata } from "next";
import OrbitClient from "./OrbitClient";

export const metadata: Metadata = {
  title: "Apogee — 고객 라이프사이클 궤도",
  description:
    "Apogee는 고객 성공팀을 위한 라이프사이클 인텔리전스 대시보드다. 고객 계정을 Trial→Activated→Retained→Expanded→Churned 동심원 궤도 위 점으로 시각화하며, 각도는 가입 경과일·반지름은 헬스 스코어로 결정된다. 점을 선택하면 우측 상세 패널과 하단 단계 전환 테이블이 동기화된다.",
};

export default function Page() {
  return <OrbitClient />;
}
