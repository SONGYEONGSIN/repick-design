import type { Metadata } from "next";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { DASH_WORKS, FREE_WORKS, LANDING_WORKS, LAST_UPDATED, type Work } from "@/lib/works";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = { title: "RE:PICK 전작 도록 — Collected Works" };

/** evolve/dash 브랜치 체크아웃에서만 존재하는 자율 루프 후보를 열거 (main/프로덕션 = 자동 숨김) */
function evolveWorks(): Work[] {
  const base = join(process.cwd(), "src/app/dash-evolve");
  if (!existsSync(base)) return [];
  const out: Work[] = [];
  for (const round of readdirSync(base).filter((d) => /^r\d+$/.test(d)).sort()) {
    for (const v of readdirSync(join(base, round)).sort()) {
      if (existsSync(join(base, round, v, "page.tsx"))) {
        out.push({ id: `${round}/${v}`, route: `/dash-evolve/${round}/${v}`, brand: `${round.toUpperCase()} · ${v.toUpperCase()}`, desc: "자율 진화 라운드 후보 — 주간 반증 대기 (미승격)" });
      }
    }
  }
  return out;
}

export default function GalleryPage() {
  const evolve = evolveWorks();
  const categories = [
    { key: "landing", numeral: "Ⅰ", label: "랜딩", works: LANDING_WORKS },
    { key: "dash", numeral: "Ⅱ", label: "SaaS 대시보드", works: DASH_WORKS },
    { key: "free", numeral: "Ⅲ", label: "자유 창작", works: FREE_WORKS },
    ...(evolve.length > 0 ? [{ key: "evolve", numeral: "Ⅳ", label: "자율 루프 후보", works: evolve }] : []),
  ];
  return <GalleryClient categories={categories} lastUpdated={LAST_UPDATED} />;
}
