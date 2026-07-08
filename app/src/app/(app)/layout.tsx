import type { Metadata } from "next";

// 📊 SaaS 대시보드 카테고리 — 로그인 후 앱 (/dashboard 등)
// 향후 공통 앱 셸(사이드바 + 상단바)이 여기에 들어가 모든 대시보드 뷰가 공유한다.
export const metadata: Metadata = {
  title: {
    default: "대시보드 — RE:픽",
    template: "%s — RE:픽",
  },
};

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
