"use client";

import { ChevronsRight, MessagesSquare, Sparkles, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { COPILOT_NAME, INSIGHT_CARDS, QUICK_REPLIES, type ChatMessage, type InsightCard, type QuickReply } from "./data";
import { BORDER, FOCUS_RING, HOVER_ACTIVE_BG, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";

export const CHAT_DOCK_WIDTH = 340;

function InsightCardButton({ card, onClick }: { card: InsightCard; onClick: () => void }) {
  const Icon = card.Icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex w-full min-h-11 items-start gap-2.5 rounded-xl border p-2.5 text-left",
        BORDER,
        "bg-white dark:bg-zinc-900",
        HOVER_ACTIVE_BG,
        TRANSITION,
        FOCUS_RING,
      )}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
        <Icon size={14} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className={cx("block text-xs font-semibold leading-snug", TEXT_PRIMARY)}>{card.title}</span>
        <span className={cx("mt-0.5 block text-[11px] leading-snug", TEXT_CAPTION)}>{card.body}</span>
      </span>
    </button>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cx("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cx("max-w-[86%]", isUser ? "items-end" : "items-start", "flex flex-col gap-1")}>
        <div
          className={cx(
            "rounded-2xl px-3 py-2 text-sm leading-relaxed",
            isUser
              ? "rounded-br-sm bg-blue-600 text-white"
              : cx("rounded-bl-sm border", BORDER, "bg-zinc-50 dark:bg-white/[0.04]", TEXT_PRIMARY),
          )}
        >
          {message.text}
        </div>
        <span className={cx("px-1 text-[10px]", NUM, TEXT_CAPTION)}>{isUser ? "나" : COPILOT_NAME} · {message.time}</span>
      </div>
    </div>
  );
}

function QuickReplyChip({ reply, onClick }: { reply: QuickReply; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-medium",
        BORDER,
        "bg-white dark:bg-zinc-900",
        TEXT_SECONDARY,
        HOVER_ACTIVE_BG,
        TRANSITION,
        FOCUS_RING,
      )}
    >
      {reply.label}
    </button>
  );
}

function DockBody({
  thread,
  onQuickReply,
  onInsightClick,
}: {
  thread: ChatMessage[];
  onQuickReply: (id: string) => void;
  onInsightClick: (id: string) => void;
}) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [thread.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className={cx("shrink-0 border-b p-3", BORDER)}>
        <EyebrowRow>제안 인사이트</EyebrowRow>
        <div className="mt-2 flex flex-col gap-2">
          {INSIGHT_CARDS.map((card) => (
            <InsightCardButton key={card.id} card={card} onClick={() => onInsightClick(card.id)} />
          ))}
        </div>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label={`${COPILOT_NAME}와의 대화`}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 [scrollbar-width:thin]"
      >
        {thread.map((m) => (
          <Bubble key={m.id} message={m} />
        ))}
      </div>

      <div className={cx("shrink-0 border-t p-3", BORDER)}>
        <p className={cx("mb-2 text-[11px]", TEXT_CAPTION)}>빠른 질문</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_REPLIES.map((qr) => (
            <QuickReplyChip key={qr.id} reply={qr} onClick={() => onQuickReply(qr.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EyebrowRow({ children }: { children: React.ReactNode }) {
  return <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{children}</span>;
}

function DockHeader({ onAction, actionIcon: ActionIcon, actionLabel }: { onAction: () => void; actionIcon: typeof X; actionLabel: string }) {
  return (
    <div className={cx("flex h-11 shrink-0 items-center gap-2 border-b px-3", BORDER)}>
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-600 text-white">
        <Sparkles size={14} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cx("truncate text-sm font-semibold leading-none", TEXT_PRIMARY)}>{COPILOT_NAME}</p>
        <p className={cx("mt-0.5 truncate text-[11px] leading-none", TEXT_CAPTION)}>워크스페이스와 실시간 동기화</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        aria-label={actionLabel}
        className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-lg", TEXT_CAPTION, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
      >
        <ActionIcon size={17} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function ChatDock({
  thread,
  onQuickReply,
  onInsightClick,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: {
  thread: ChatMessage[];
  onQuickReply: (id: string) => void;
  onInsightClick: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {/* 데스크톱: 항상 보이는 도크(축소 가능) — xl 이상에서 3번째 고정폭 컬럼 */}
      <div className="hidden h-full shrink-0 xl:block" style={{ width: collapsed ? 56 : CHAT_DOCK_WIDTH }}>
        <aside
          className={cx(
            "flex h-full flex-col border-l",
            BORDER,
            "bg-white dark:bg-zinc-950",
            "transition-[width] motion-reduce:transition-none",
          )}
          style={{ width: collapsed ? 56 : CHAT_DOCK_WIDTH }}
          aria-label={`${COPILOT_NAME} 코파일럿 패널`}
        >
          {collapsed ? (
            <div className="flex h-full flex-col items-center gap-3 py-3">
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={`${COPILOT_NAME} 패널 펼치기`}
                className={cx("grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-white", TRANSITION, FOCUS_RING)}
              >
                <MessagesSquare size={17} aria-hidden="true" />
              </button>
              <span aria-hidden="true" className={cx("text-[11px] font-semibold [writing-mode:vertical-rl]", TEXT_CAPTION)}>
                {COPILOT_NAME}
              </span>
            </div>
          ) : (
            <>
              <DockHeader onAction={onToggleCollapse} actionIcon={ChevronsRight} actionLabel={`${COPILOT_NAME} 패널 접기`} />
              <DockBody thread={thread} onQuickReply={onQuickReply} onInsightClick={onInsightClick} />
            </>
          )}
        </aside>
      </div>

      {/* 모바일/태블릿: 토글형 바텀 시트 — 뷰포트를 상시 절반 차지하지 않음 */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end xl:hidden">
          <button type="button" aria-label="코파일럿 패널 닫기" onClick={onCloseMobile} className="absolute inset-0 bg-zinc-900/40" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${COPILOT_NAME} 코파일럿 패널`}
            className={cx(
              "relative flex max-h-[82vh] flex-col rounded-t-2xl border shadow-xl",
              BORDER,
              "bg-white dark:bg-zinc-950",
            )}
          >
            <DockHeader onAction={onCloseMobile} actionIcon={X} actionLabel="코파일럿 패널 닫기" />
            <DockBody thread={thread} onQuickReply={onQuickReply} onInsightClick={onInsightClick} />
          </div>
        </div>
      ) : null}
    </>
  );
}
