import type { Metadata } from "next";
import F9Client from "./f9-client";

export const metadata: Metadata = {
  title: "VOLATILE — 향을 만들지 않습니다, 측정합니다",
  description:
    "VOLATILE은 후각 데이터로 향의 휘발 곡선을 계측하고, 그 좌표 위에서만 향수를 설계하는 정밀 계측 조향 연구소입니다.",
};

export default function Landing() {
  return <F9Client />;
}
