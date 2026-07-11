"use client";

import { useEffect, useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // 마스터-디테일 셸은 페이지 자체를 스크롤하지 않는다 — 레일/디테일 두 컬럼만 각자 overflow-y-auto로
  // 스크롤한다. html·body가 (콘텐츠는 실제로 넘치지 않아도) 브라우저 문서 높이 계산상 미세하게
  // 더 크게 잡혀 스크롤 가능 상태가 되는 경우까지 봉쇄해, 클래식(항상-표시) 스크롤바 환경에서
  // 페이지 스크롤바 + 내부 패널 스크롤바가 겹쳐 보이는 "이중 스크롤바"를 제거한다.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="flex h-dvh min-h-0 bg-zinc-950 text-zinc-100">
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
