import type { Metadata } from "next";
import PipelineClient from "./components/PipelineClient";

export const metadata: Metadata = {
  title: "Millrace — Pipeline Orchestration",
  description:
    "Millrace는 데이터 파이프라인 오케스트레이션 SaaS다. nightly_orders_pipeline의 태스크 DAG를 그래프로 보여주고, 노드를 클릭하면 오른쪽 상세 패널과 의존 엣지가 동기화된다.",
};

export default function Page() {
  return <PipelineClient />;
}
