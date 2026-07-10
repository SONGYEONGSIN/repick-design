import type { Metadata } from "next";
import F13Client from "./f13-client";

export const metadata: Metadata = {
  title: "VANISH. — 사라지는 것에도, 연출이 필요하다",
  description:
    "VANISH는 당신의 실종을 기획하는 프로덕션입니다. 목적지도, 일정도, 대사도 없는 14일. 각본은 지금부터 시작됩니다.",
};

export default function Landing() {
  return <F13Client />;
}
