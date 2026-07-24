import type { Metadata } from "next";
import { BoardApp } from "./board-app";

export const metadata: Metadata = {
  title: "Keel — 영업 파이프라인",
  description:
    "Keel은 리드부터 협상까지 거래 흐름을 칸반 보드로 관리하고, 가중 예측과 승률을 한 화면에서 추적하는 B2B 영업 파이프라인 워크스페이스입니다.",
};

export default function Page() {
  return <BoardApp />;
}
