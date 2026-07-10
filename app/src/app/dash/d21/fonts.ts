import { Libre_Caslon_Display, Noto_Serif_KR } from "next/font/google";

// 나스플레이트(로고) — 클래식 브로드시트 캐즐런
export const nameplateFont = Libre_Caslon_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nameplate",
  display: "swap",
});

// 기사 헤드라인/본문 한글 세리프
export const serifKrFont = Noto_Serif_KR({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif-kr",
  display: "swap",
});
