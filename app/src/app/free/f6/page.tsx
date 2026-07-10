import type { Metadata } from "next";
import LandingF6Client from "./landing-f6-client";

export const metadata: Metadata = {
  title: "날것 — 정리하지 마라, 그냥 써라",
  description:
    "폴더도 태그도 정렬도 없다. 커서 하나와 자동저장뿐인 메모 앱, 날것. 예쁘게 정리하려다 아무것도 못 쓰는 사람들을 위해 만들었다.",
};

export default function Landing() {
  return <LandingF6Client />;
}
