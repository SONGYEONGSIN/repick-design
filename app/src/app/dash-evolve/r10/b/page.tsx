import type { Metadata } from "next";
import StackyardClient from "./StackyardClient";

export const metadata: Metadata = {
  title: "Stackyard — 존 운영 현황",
  description:
    "Stackyard는 풀필먼트 창고를 위한 존/빈 적재율 운영 콘솔이다. 좌측 존 레일에서 구역을 선택하면 중앙의 빈 적재 히트맵이 해당 통로 구간을 강조하고, 우측 피킹 큐가 그 존의 활성 작업으로 즉시 동기화된다.",
};

export default function Page() {
  return <StackyardClient />;
}
