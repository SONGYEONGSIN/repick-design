import type { Metadata } from "next";

// 📄 랜딩페이지 카테고리 — 마케팅 사이트 (공개, /)
export const metadata: Metadata = {
  title: "RE:픽 — AI가 다시 고르는 중고",
};

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
