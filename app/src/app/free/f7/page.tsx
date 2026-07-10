import type { Metadata } from "next";
import F7Client from "./f7-client";

export const metadata: Metadata = {
  title: "SPORE — 말은, 뿌리내린다",
  description:
    "스포어는 하루 세 개의 짧은 목소리를 심으면 결이 닮은 사람에게로 균사체처럼 조용히 퍼져나가는 소리의 정원입니다. 팔로워도 좋아요도 없이, 90일 뒤엔 스스로 흙으로 돌아갑니다.",
};

export default function Landing() {
  return <F7Client />;
}
