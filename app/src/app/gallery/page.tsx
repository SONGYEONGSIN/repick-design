import type { Metadata } from "next";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { catalogWorks, LAST_UPDATED, type Work } from "@/lib/works";
import { parseLedger, candidateStatus } from "@/lib/evolve-status";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = { title: "Specimen — Interface design systems for AI agents" };

/** evolve/dash 브랜치 체크아웃에서만 존재하는 자율 루프 후보를 열거 (main/프로덕션 = 자동 숨김) */
function evolveWorks(): Work[] {
  const ledgerPath = join(process.cwd(), "..", "vault", "30-ledger", "auto-ledger.jsonl");
  const ledger = existsSync(ledgerPath) ? parseLedger(readFileSync(ledgerPath, "utf8")) : new Map();
  const out: Work[] = [];
  for (const [dir, label, target] of [
    ["dash-evolve", "DASH", "dash"],
    ["landing-evolve", "LANDING", "landing"],
  ] as const) {
    const base = join(process.cwd(), "src/app", dir);
    if (!existsSync(base)) continue;
    const rounds = readdirSync(base)
      .filter((d) => /^r\d+$/.test(d))
      .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
    for (const round of rounds) {
      const ledgerRound = `auto-${target}-${round}`;
      const info = ledger.get(ledgerRound);
      for (const v of readdirSync(join(base, round)).sort()) {
        if (existsSync(join(base, round, v, "page.tsx"))) {
          out.push({
            id: `${target}-${round}/${v}`,
            route: `/${dir}/${round}/${v}`,
            brand: `${label} ${round.toUpperCase()} · ${v.toUpperCase()}`,
            desc: { ko: "자율 진화 라운드 후보", en: "Autonomous evolution round candidate" },
            status: candidateStatus(ledgerRound, v, ledger),
            round: ledgerRound,
            target,
            category: target === "landing" ? "landing" : "dashboard",
            date: info?.date,
          });
        }
      }
    }
  }
  return out;
}

export default function GalleryPage() {
  const works: Work[] = [...catalogWorks(), ...evolveWorks()];
  return <GalleryClient works={works} lastUpdated={LAST_UPDATED} />;
}
