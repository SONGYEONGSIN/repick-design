import type { Metadata } from "next";
import { Sidebar } from "./sidebar";
import { Topbar, MobileTabBar } from "./topbar";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "APRON · 지상운영 관제 대시보드",
  description: "게이트 배정, 출발 관제판, 회전 준비율을 한 화면에서 통제하는 지상운영 관제 대시보드.",
};

export default function Dashboard() {
  return (
    <div className="min-h-dvh bg-black text-neutral-200">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        본문으로 건너뛰기
      </a>

      <div className="mx-auto flex min-h-dvh max-w-[1440px]">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <main
            id="main"
            className="flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-10 lg:px-8"
          >
            <div className="mx-auto max-w-[1200px]">
              <header className="mb-6">
                <h1 className="font-mono text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl">
                  지상운영 관제 대시보드
                </h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                  게이트 배정과 출발 관제판, 회전 준비율을 한 화면에서
                  확인합니다. 아래 필터로 상태별·터미널별로 좁혀 보세요.
                </p>
              </header>

              <DashboardClient />
            </div>
          </main>

          <MobileTabBar />
        </div>
      </div>
    </div>
  );
}
