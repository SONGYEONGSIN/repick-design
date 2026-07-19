"use client";

import { ArrowRight, CalendarDays, Coins, UserRound, Users } from "lucide-react";
import Image from "next/image";
import { STAGE_META, customerById, formatCount, formatUsd, unsplashAvatar, type PeriodId } from "./data";
import {
  ACCENT_SOLID,
  BORDER,
  FOCUS_RING,
  NUM,
  SURFACE_INSET,
  TEXT_CAPTION,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TONE,
  TRANSITION,
  cx,
  type Tone,
} from "./tokens";
import { Card, EyebrowLabel, Sparkline, StageBadge } from "./ui";

const PERIOD_LABEL: Record<PeriodId, string> = { "7d": "최근 7일", "30d": "최근 30일", "90d": "최근 90일" };

function healthTone(h: number): Tone {
  if (h >= 70) return "up";
  if (h >= 45) return "warn";
  return "down";
}

function StatCell({ Icon, label, value }: { Icon: typeof Coins; label: string; value: string }) {
  return (
    <div className={cx("rounded-xl border p-3", BORDER, SURFACE_INSET)}>
      <div className={cx("flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide", TEXT_CAPTION)}>
        <Icon size={13} aria-hidden="true" />
        {label}
      </div>
      <p className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}

export default function DetailPanel({ selectedId, period }: { selectedId: string; period: PeriodId }) {
  const c = customerById(selectedId);
  if (!c) return null;

  const m = STAGE_META[c.stage];
  const health = c.health[period];
  const tone = TONE[healthTone(health)];
  const trend = c.trend;
  const prior = trend[trend.length - 2] ?? health;
  const delta = health - prior;

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden" padded={false}>
      {/* 헤더 */}
      <div className={cx("border-b p-4", BORDER)}>
        <div className="flex items-start gap-3">
          <Image
            src={unsplashAvatar(c.avatarId, 88)}
            alt={`${c.contactName} 프로필 사진`}
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full border border-black/5 object-cover dark:border-white/10"
          />
          <div className="min-w-0 flex-1">
            <EyebrowLabel>선택한 계정</EyebrowLabel>
            <h2 className={cx("mt-0.5 truncate text-base font-semibold tracking-tight", TEXT_PRIMARY)}>{c.name}</h2>
            <p className={cx("mt-0.5 truncate text-xs", TEXT_CAPTION)}>
              {c.contactName} · {c.contactTitle}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <StageBadge stage={c.stage} />
        </div>
      </div>

      {/* 스크롤 본문 */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-width:thin]">
        {/* 헬스 스코어 + 스파크라인 */}
        <div className={cx("rounded-xl border p-3.5", BORDER, SURFACE_INSET)}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <EyebrowLabel>헬스 스코어</EyebrowLabel>
              <div className="mt-1 flex items-baseline gap-2">
                <span className={cx("text-3xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>{health}</span>
                <span className={cx("text-xs font-normal", TEXT_CAPTION)}>/ 100</span>
                <span
                  className={cx(
                    "inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[11px] font-semibold",
                    tone.text,
                    tone.bg,
                    tone.border,
                    NUM,
                  )}
                >
                  {delta >= 0 ? "+" : ""}
                  {delta}
                </span>
              </div>
            </div>
            <div className="h-11 w-28 shrink-0">
              <Sparkline values={trend} stroke={m.stroke} fill={m.fill} />
            </div>
          </div>
          <p className={cx("mt-2 text-[11px]", TEXT_CAPTION)}>
            {PERIOD_LABEL[period]} 기준 · 직전 대비 {delta >= 0 ? `+${delta}` : delta}점
          </p>
        </div>

        {/* 핵심 지표 */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <StatCell Icon={Coins} label="ARR" value={formatUsd(c.arr)} />
          <StatCell Icon={Users} label="시트" value={`${formatCount(c.seats)}석`} />
          <StatCell Icon={CalendarDays} label="가입" value={`${formatCount(c.signupDaysAgo)}일차`} />
          <StatCell Icon={UserRound} label="담당 CSM" value={c.csm} />
        </div>

        {/* 최근 이벤트 */}
        <div className="mt-4">
          <EyebrowLabel>최근 이벤트</EyebrowLabel>
          <ul className={cx("mt-1.5 divide-y rounded-xl border", BORDER, "divide-zinc-200 dark:divide-zinc-800")}>
            {c.events.map((e, i) => {
              const et = TONE[e.tone === "info" ? "info" : e.tone === "up" ? "up" : e.tone === "down" ? "down" : "flat"];
              return (
                <li key={i} className="flex items-center gap-2.5 px-3 py-2">
                  <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-md", et.bg)}>
                    <e.Icon size={13} aria-hidden="true" className={et.text} />
                  </span>
                  <span className={cx("min-w-0 flex-1 truncate text-xs", TEXT_SECONDARY)}>{e.label}</span>
                  <span className={cx("shrink-0 text-[11px]", TEXT_CAPTION)}>{e.when}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 다음 액션 */}
        <div className="mt-4">
          <EyebrowLabel>다음 액션</EyebrowLabel>
          <div className={cx("mt-1.5 flex items-center justify-between gap-3 rounded-xl border p-3", m.border, m.bg)}>
            <p className={cx("min-w-0 text-sm font-medium", TEXT_PRIMARY)}>{c.nextAction}</p>
            <button
              type="button"
              className={cx("inline-flex h-9 shrink-0 items-center gap-1 rounded-lg px-3 text-xs font-semibold", ACCENT_SOLID, TRANSITION, FOCUS_RING)}
            >
              실행
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
