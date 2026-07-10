import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import OnggiDashboard from "./client";

// 1970s 레시피북 무드의 두꺼운 한글 세리프 — 라틴 전용 폰트에 한글을 넣지
// 않기 위해 한글 자체를 지원하는 세리프(Noto Serif KR)를 별도 로드한다.
// 이 폴더(dash/d11) 안에서만 쓰는 CSS 변수로 전역 --font-display와 분리.
const vintageSerif = Noto_Serif_KR({
  weight: ["600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-vintage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "장독대 관제 | 옹기",
  description: "옹기 — 된장·고추장·간장·막걸리 장독대를 관제하는 발효 배양 대시보드. 독별 온습도·산도·당도와 숙성 진행률, 품질 등급을 한눈에.",
};

export default function Dashboard() {
  return (
    <div className={vintageSerif.variable}>
      <OnggiDashboard />
    </div>
  );
}
