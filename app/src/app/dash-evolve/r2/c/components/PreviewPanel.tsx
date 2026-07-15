"use client";

import { Monitor, Smartphone } from "lucide-react";
import type { CampaignDraft, PreviewDevice } from "../lib/data";
import { segmentById } from "../lib/data";
import { formatDateLong, formatNumber } from "../lib/format";
import { Card, Segmented } from "./ui";

export default function PreviewPanel({
  draft,
  device,
  onDeviceChange,
}: {
  draft: CampaignDraft;
  device: PreviewDevice;
  onDeviceChange: (d: PreviewDevice) => void;
}) {
  const segment = segmentById(draft.segmentId);

  return (
    <Card as="section" className="flex min-w-0 flex-1 flex-col" aria-labelledby="preview-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-4">
        <h2 id="preview-heading" className="text-sm font-semibold text-zinc-900">
          실시간 미리보기
        </h2>
        <Segmented<PreviewDevice>
          label="미리보기 화면 크기"
          size="sm"
          value={device}
          onChange={onDeviceChange}
          options={[
            { value: "desktop", label: "데스크톱", Icon: Monitor },
            { value: "mobile", label: "모바일", Icon: Smartphone },
          ]}
        />
      </div>

      {/* 예상 도달 인원 — 세그먼트 선택과 동기화되는 두 번째 위젯 */}
      <div className="mx-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-zinc-50 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">예상 도달 인원</p>
          <p className="text-2xl font-semibold tabular-nums text-zinc-900">
            {formatNumber(segment.size)}
            <span className="ml-1 text-sm font-normal text-zinc-500">명</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-800">{segment.name}</p>
          <p className="max-w-[220px] text-xs text-zinc-500">{segment.description}</p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 pt-4">
        <div className={`mx-auto transition-[max-width] motion-reduce:transition-none ${device === "mobile" ? "max-w-[360px]" : "max-w-full"}`}>
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <div className="space-y-1 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
              <p className="truncate">
                <span className="text-zinc-400">보낸사람 </span>
                <span className="font-medium text-zinc-700">
                  {draft.fromName || "이름 없음"} &lt;{draft.fromEmail || "no-reply@relay.app"}&gt;
                </span>
              </p>
              <p className="truncate">
                <span className="text-zinc-400">받는사람 </span>
                <span className="font-medium text-zinc-700">{segment.name}</span>
                <span className="tabular-nums"> ({formatNumber(segment.size)}명)</span>
              </p>
              <p className="truncate">
                <span className="text-zinc-400">제목 </span>
                <span className="font-medium text-zinc-800">{draft.subject || "(제목 없음)"}</span>
              </p>
              {draft.preheader ? <p className="truncate text-zinc-400">{draft.preheader}</p> : null}
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-8">
              <p className="text-lg font-semibold leading-snug text-zinc-900 sm:text-xl">
                {draft.bodyHeading || "본문 제목을 입력하세요"}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                {draft.bodyText || "본문 내용을 입력하면 여기에 실시간으로 표시됩니다."}
              </p>
              {draft.ctaLabel ? (
                <div
                  className="mt-5 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white"
                  aria-hidden="true"
                >
                  {draft.ctaLabel}
                </div>
              ) : null}
              <p className="mt-6 truncate text-xs text-zinc-400">{draft.ctaUrl}</p>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-zinc-400">
            {draft.sendType === "scheduled"
              ? `${formatDateLong(draft.date)} ${draft.time} 발송 예약 · ${draft.timezone}`
              : "저장 즉시 발송됩니다"}
          </p>
        </div>
      </div>
    </Card>
  );
}
