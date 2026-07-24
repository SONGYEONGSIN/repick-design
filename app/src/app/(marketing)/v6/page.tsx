import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "RE:픽 — 밀어서 비교하는 AI 중고 매칭",
  description:
    "왼쪽은 흔한 중고 리스팅, 오른쪽은 repick AI가 컨디션·시세·취향을 검증해 다시 정돈한 매물. 핸들을 직접 밀어 두 가지 중고 거래 방식을 비교해 보세요.",
};

export default function Page() {
  return <LandingClient />;
}
