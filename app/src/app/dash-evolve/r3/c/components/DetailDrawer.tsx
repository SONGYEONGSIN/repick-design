"use client";

import { Building2, Calendar, Mail, Phone, X } from "lucide-react";
import Image from "next/image";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { activityLogFor, ownerById, stageById, type Deal } from "../lib/data";
import { formatCurrency, formatDateLong } from "../lib/format";
import { PriorityBadge, ProbabilityBar, StageBadge } from "./ui";

export default function DetailDrawer({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const owner = ownerById(deal.ownerId);
  const stage = stageById(deal.stage);
  const activity = activityLogFor(deal);
  const headingId = "deal-drawer-heading";
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [deal.id]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="상세 패널 닫기" onClick={onClose} className="fixed inset-0 bg-zinc-900/30" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        onKeyDown={handleKeyDown}
        className={`relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-zinc-200 bg-white shadow-xl transition-transform duration-200 ease-out motion-reduce:transition-none ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">딜 상세</p>
            <h2 id={headingId} className="mt-0.5 truncate text-lg font-semibold tracking-tight text-zinc-900">
              {deal.company}
            </h2>
            <p className="truncate text-sm text-zinc-500">{deal.contact} 담당</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="상세 패널 닫기"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-5 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <StageBadge stage={deal.stage} label={stage.label} />
            <PriorityBadge priority={deal.priority} />
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">금액</dt>
              <dd className="mt-0.5 text-base font-semibold tabular-nums text-zinc-900">{formatCurrency(deal.value)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">마감 예정일</dt>
              <dd className="mt-0.5 whitespace-nowrap text-sm tabular-nums text-zinc-800">{formatDateLong(deal.closeDate)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">성사 확률</dt>
              <dd className="mt-1.5">
                <ProbabilityBar value={deal.probability} />
              </dd>
            </div>
          </dl>

          <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <Image
              src={owner.photo}
              alt=""
              width={36}
              height={36}
              className="size-9 shrink-0 rounded-full object-cover ring-1 ring-zinc-200"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900">{owner.name}</p>
              <p className="truncate text-xs text-zinc-500">담당 세일즈 오너 · {owner.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">빠른 실행</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500"
              >
                <Phone className="size-4 text-zinc-500" aria-hidden="true" />
                전화
              </button>
              <button
                type="button"
                className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500"
              >
                <Mail className="size-4 text-zinc-500" aria-hidden="true" />
                이메일
              </button>
              <button
                type="button"
                className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500"
              >
                <Calendar className="size-4 text-zinc-500" aria-hidden="true" />
                일정
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">활동 및 다음 단계</h3>
            <ul className="flex flex-col gap-3 border-l border-zinc-200 pl-4">
              {activity.map((entry, index) => (
                <li key={`${entry.label}-${index}`} className="relative">
                  <span className="absolute -left-[19px] top-1 size-2 rounded-full bg-indigo-500 ring-2 ring-white" aria-hidden="true" />
                  <p className="text-xs tabular-nums text-zinc-500">{formatDateLong(entry.date)}</p>
                  <p className="mt-0.5 text-sm font-medium text-zinc-900">{entry.label}</p>
                  <p className="mt-0.5 text-sm text-zinc-600">{entry.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-500">
            <Building2 className="size-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
            유입 경로: {deal.source}
          </div>
        </div>
      </div>
    </div>
  );
}
