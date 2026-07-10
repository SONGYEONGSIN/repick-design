import type { Metadata } from "next";
import F14Client from "./f14-client";

export const metadata: Metadata = {
  title: "VERTEX — 소리에도, 자리가 있다",
  description:
    "VERTEX는 통화, 음악, 알림에 각자의 3D 좌표를 부여하는 공간 오디오 시스템입니다. 소리가 놓일 자리를 다시 설계했습니다.",
};

export default function Landing() {
  return <F14Client />;
}
