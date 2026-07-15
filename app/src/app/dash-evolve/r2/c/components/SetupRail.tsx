"use client";

import { CalendarClock, Mail, Users } from "lucide-react";
import type { CampaignDraft, SendType, SetupTab } from "../lib/data";
import { SEGMENTS } from "../lib/data";
import { formatNumber } from "../lib/format";
import { Card, Field, Segmented, Tabs, TabPanel, inputClass } from "./ui";

const TAB_ITEMS = [
  { value: "audience" as const, label: "대상", Icon: Users },
  { value: "content" as const, label: "콘텐츠", Icon: Mail },
  { value: "schedule" as const, label: "일정", Icon: CalendarClock },
];

export default function SetupRail({
  draft,
  onPatch,
  activeTab,
  onTabChange,
}: {
  draft: CampaignDraft;
  onPatch: (patch: Partial<CampaignDraft>) => void;
  activeTab: SetupTab;
  onTabChange: (tab: SetupTab) => void;
}) {
  return (
    <Card as="section" className="flex w-full flex-col lg:w-[380px] lg:shrink-0" aria-labelledby="setup-heading">
      <div className="flex items-center justify-between gap-2 px-4 pb-1 pt-4">
        <h2 id="setup-heading" className="text-sm font-semibold text-zinc-900">
          캠페인 설정
        </h2>
      </div>

      <Tabs items={TAB_ITEMS} value={activeTab} onChange={onTabChange} idBase="setup" />

      <div className="flex-1 px-4 py-4">
        {activeTab === "audience" ? (
          <TabPanel id="setup-panel-audience" labelledBy="setup-tab-audience" className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">대상 세그먼트</h3>
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">발송 대상 세그먼트 선택</legend>
              {SEGMENTS.map((segment) => {
                const checked = draft.segmentId === segment.id;
                return (
                  <label
                    key={segment.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors motion-reduce:transition-none ${
                      checked ? "border-indigo-300 bg-indigo-50/60" : "border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="segment"
                      value={segment.id}
                      checked={checked}
                      onChange={() => onPatch({ segmentId: segment.id })}
                      className="mt-0.5 size-4 shrink-0 accent-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-medium text-zinc-800">{segment.name}</span>
                        <span className="shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums text-zinc-900">
                          {formatNumber(segment.size)}명
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs text-zinc-500">{segment.description}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </TabPanel>
        ) : null}

        {activeTab === "content" ? (
          <TabPanel id="setup-panel-content" labelledBy="setup-tab-content" className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">이메일 콘텐츠</h3>

            <div className="grid grid-cols-2 gap-3">
              <Field id="from-name" label="보내는 사람">
                <input
                  id="from-name"
                  type="text"
                  value={draft.fromName}
                  onChange={(e) => onPatch({ fromName: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field id="from-email" label="보내는 이메일">
                <input
                  id="from-email"
                  type="email"
                  value={draft.fromEmail}
                  onChange={(e) => onPatch({ fromEmail: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field id="subject" label="제목">
              <input
                id="subject"
                type="text"
                value={draft.subject}
                onChange={(e) => onPatch({ subject: e.target.value })}
                className={inputClass}
                maxLength={80}
              />
            </Field>

            <Field id="preheader" label="프리헤더" hint="받은편지함 목록에서 제목 옆에 표시됩니다">
              <input
                id="preheader"
                type="text"
                value={draft.preheader}
                onChange={(e) => onPatch({ preheader: e.target.value })}
                className={inputClass}
                maxLength={100}
              />
            </Field>

            <Field id="body-heading" label="본문 제목">
              <input
                id="body-heading"
                type="text"
                value={draft.bodyHeading}
                onChange={(e) => onPatch({ bodyHeading: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field id="body-text" label="본문 내용">
              <textarea
                id="body-text"
                value={draft.bodyText}
                onChange={(e) => onPatch({ bodyText: e.target.value })}
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field id="cta-label" label="버튼 텍스트">
                <input
                  id="cta-label"
                  type="text"
                  value={draft.ctaLabel}
                  onChange={(e) => onPatch({ ctaLabel: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field id="cta-url" label="버튼 링크">
                <input
                  id="cta-url"
                  type="text"
                  value={draft.ctaUrl}
                  onChange={(e) => onPatch({ ctaUrl: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
          </TabPanel>
        ) : null}

        {activeTab === "schedule" ? (
          <TabPanel id="setup-panel-schedule" labelledBy="setup-tab-schedule" className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">발송 일정</h3>

            <Segmented<SendType>
              label="발송 방식"
              value={draft.sendType}
              onChange={(v) => onPatch({ sendType: v })}
              options={[
                { value: "now", label: "즉시 발송" },
                { value: "scheduled", label: "예약 발송" },
              ]}
            />

            {draft.sendType === "scheduled" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="send-date" label="발송 날짜">
                    <input
                      id="send-date"
                      type="date"
                      value={draft.date}
                      onChange={(e) => onPatch({ date: e.target.value })}
                      className={`${inputClass} tabular-nums`}
                    />
                  </Field>
                  <Field id="send-time" label="발송 시각">
                    <input
                      id="send-time"
                      type="time"
                      value={draft.time}
                      onChange={(e) => onPatch({ time: e.target.value })}
                      className={`${inputClass} tabular-nums`}
                    />
                  </Field>
                </div>
                <Field id="send-timezone" label="시간대">
                  <select
                    id="send-timezone"
                    value={draft.timezone}
                    onChange={(e) => onPatch({ timezone: e.target.value })}
                    className={inputClass}
                  >
                    <option value="Asia/Seoul (UTC+09:00)">Asia/Seoul (UTC+09:00)</option>
                  </select>
                </Field>
              </>
            ) : (
              <p className="rounded-lg bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600">
                저장 후 발송을 확정하면 즉시 대상 세그먼트로 전송됩니다.
              </p>
            )}
          </TabPanel>
        ) : null}
      </div>
    </Card>
  );
}
