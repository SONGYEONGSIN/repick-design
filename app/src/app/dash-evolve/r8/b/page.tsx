import type { Metadata } from "next";
import Workspace from "./Workspace";

export const metadata: Metadata = {
  title: "Farsight — 매출 코파일럿",
  description:
    "Farsight는 RevOps 팀을 위한 매출 인텔리전스 코파일럿이다. 우측에 상주하는 AI 코파일럿 Fara와 대화하며 리전별 매출 차트·계정 테이블이 실시간으로 동기화된다. 제안 인사이트 카드를 클릭하면 화면 전체가 해당 맥락으로 전환된다.",
};

export default function Page() {
  return <Workspace />;
}
