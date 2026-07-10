"use client";

import { useId } from "react";
import { Building2, ClipboardList, FileText, Globe, History, Phone, ShieldCheck, Ticket, Users } from "lucide-react";
import { DeltaBadge } from "./estimate-spread";
import {
  DEPARTMENTS,
  type Lot,
  STATUS_META,
  deltaVsMid,
  estimateLabel,
  formatUSD,
} from "./data";

interface DocketPanelProps {
  lot: Lot | null;
}

const CHANNELS: Array<{ key: "room" | "phone" | "online" | "absentee"; label: string; icon: typeof Users }> = [
  { key: "room", label: "현장", icon: Users },
  { key: "phone", label: "전화", icon: Phone },
  { key: "online", label: "온라인", icon: Globe },
  { key: "absentee", label: "서면", icon: FileText },
];

export function DocketPanel({ lot }: DocketPanelProps) {
  const headingId = useId();

  return (
    <section id="docket" aria-labelledby={headingId} className="scroll-mt-24 border border-[var(--rule)] bg-[var(--paper-card)]">
      <div className="border-b border-[var(--rule)] px-4 py-3 sm:px-5">
        <h2 id={headingId} className="text-sm font-semibold tracking-wide text-[var(--ink)]">
          선택 로트 도켓
        </h2>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">프로비넌스 · 컨디션 · 응찰 채널 구성</p>
      </div>

      {lot == null ? (
        <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
          <ClipboardList aria-hidden="true" className="h-6 w-6 text-[var(--ink-muted)]" />
          <p className="text-sm text-[var(--ink-muted)]">
            로트 보드 또는 카탈로그에서 로트를 선택하면 상세 도켓이 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="grid gap-x-8 gap-y-6 px-4 py-5 sm:px-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0 space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ink-muted)]">
                <span className="font-mono tabular-nums">LOT {String(lot.lotNo).padStart(3, "0")}</span>
                <span aria-hidden="true">·</span>
                <span>{DEPARTMENTS.find((d) => d.code === lot.department)?.label}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Building2 aria-hidden="true" className="h-3 w-3" />
                  위탁자 {lot.consignor}
                </span>
              </div>
              <p className="mt-1 font-display text-2xl italic leading-tight text-[var(--ink)]">{lot.title}</p>
              <p className="text-sm text-[var(--ink-muted)]">
                {lot.artist}, {lot.year} · {lot.medium}, {lot.dimensions}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-[var(--rule)] py-4 text-sm">
              <div>
                <dt className="text-xs text-[var(--ink-muted)]">추정가</dt>
                <dd className="font-mono tabular-nums text-[var(--ink)]">{estimateLabel(lot)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-muted)]">
                  {lot.status === "live" ? "현재 응찰가" : lot.status === "hammered" ? "낙찰가" : "상태"}
                </dt>
                <dd className="flex flex-wrap items-center gap-2 font-mono tabular-nums text-[var(--ink)]">
                  {lot.status === "hammered" && lot.hammerPrice != null ? (
                    <>
                      {formatUSD(lot.hammerPrice)}
                      {(() => {
                        const d = deltaVsMid(lot);
                        return d != null ? <DeltaBadge ratio={d} /> : null;
                      })()}
                    </>
                  ) : lot.status === "live" && lot.currentBid != null ? (
                    <span className="text-[var(--accent-red)]">{formatUSD(lot.currentBid)}</span>
                  ) : (
                    <span className="font-sans text-[var(--ink-muted)]">{STATUS_META[lot.status].description}</span>
                  )}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-[var(--ink-muted)]">컨디션</dt>
                <dd className="flex items-start gap-1.5 text-[var(--ink)]">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--ink-muted)]" />
                  {lot.condition}
                </dd>
              </div>
            </dl>

            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[var(--ink-muted)]">
                <History aria-hidden="true" className="h-3.5 w-3.5" />
                프로비넌스
              </h3>
              <ol className="mt-2.5 space-y-3 border-l border-[var(--rule-strong)] pl-4">
                {lot.provenance.map((p, i) => (
                  <li key={i} className="relative text-sm text-[var(--ink)]">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-[1.15rem] h-1.5 w-1.5 rounded-full bg-[var(--ink-muted)]"
                    />
                    {p}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[var(--ink-muted)]">
              <Ticket aria-hidden="true" className="h-3.5 w-3.5" />
              응찰 채널 구성
            </h3>

            {lot.bidChannels ? (
              <div className="mt-3">
                <div
                  role="img"
                  aria-label={`응찰 채널 구성 — 현장 ${lot.bidChannels.room}%, 전화 ${lot.bidChannels.phone}%, 온라인 ${lot.bidChannels.online}%, 서면 ${lot.bidChannels.absentee}%`}
                  className="space-y-2.5"
                >
                  {CHANNELS.map(({ key, label, icon: Icon }) => {
                    const value = lot.bidChannels?.[key] ?? 0;
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--ink-muted)]" />
                        <span className="w-10 shrink-0 text-xs text-[var(--ink-muted)]">{label}</span>
                        <span className="relative h-2 flex-1 bg-[var(--rule)]">
                          <span
                            className="absolute inset-y-0 left-0 bg-[var(--accent-green)]"
                            style={{ width: `${value}%` }}
                          />
                        </span>
                        <span className="w-9 shrink-0 text-right font-mono text-xs tabular-nums text-[var(--ink)]">
                          {value}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                <table className="sr-only">
                  <caption>{lot.title} 응찰 채널 구성 비율</caption>
                  <thead>
                    <tr>
                      <th scope="col">채널</th>
                      <th scope="col">비율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHANNELS.map(({ key, label }) => (
                      <tr key={key}>
                        <th scope="row">{label}</th>
                        <td>{lot.bidChannels?.[key] ?? 0}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-3 border border-dashed border-[var(--rule-strong)] px-3 py-4 text-center">
                <p className="font-mono text-lg tabular-nums text-[var(--ink)]">{lot.preRegisteredBids ?? 0}건</p>
                <p className="mt-1 text-xs text-[var(--ink-muted)]">
                  사전 등록 응찰 — 실시간 응찰은 로트 상정 전까지 시작되지 않습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
