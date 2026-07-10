import {
  CheckCircle2,
  Activity,
  Hourglass,
  Circle,
  AlertTriangle,
  Flag,
} from "lucide-react";
import type { ComponentType } from "react";

export type AnyStatus =
  | "approved"
  | "rendering"
  | "review"
  | "queued"
  | "error"
  | "running"
  | "reviewing"
  | "pending"
  | "rejected";

interface StatusMeta {
  label: string;
  text: string;
  dot: string;
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

// 색상은 d20.module.css의 .theme 스코프에 정의된 CSS 커스텀 프로퍼티를 참조한다.
// (다크 배경 대비 전부 AA 이상 검증됨: 앰버 8.26:1, 틸 8.08:1, 레드 5.25:1, 딤 7.19:1)
export const STATUS_META: Record<AnyStatus, StatusMeta> = {
  approved: {
    label: "승인",
    text: "text-[var(--dg-teal)]",
    dot: "bg-[var(--dg-teal)]",
    Icon: CheckCircle2,
  },
  rendering: {
    label: "렌더링 중",
    text: "text-[var(--dg-amber)]",
    dot: "bg-[var(--dg-amber)]",
    Icon: Activity,
  },
  running: {
    label: "실행 중",
    text: "text-[var(--dg-amber)]",
    dot: "bg-[var(--dg-amber)]",
    Icon: Activity,
  },
  review: {
    label: "검토중",
    text: "text-[var(--dg-amber)]",
    dot: "bg-[var(--dg-amber)]",
    Icon: Hourglass,
  },
  reviewing: {
    label: "검토중",
    text: "text-[var(--dg-amber)]",
    dot: "bg-[var(--dg-amber)]",
    Icon: Hourglass,
  },
  queued: {
    label: "대기",
    text: "text-[var(--dg-text-dim)]",
    dot: "bg-[var(--dg-text-dim)]",
    Icon: Circle,
  },
  pending: {
    label: "대기",
    text: "text-[var(--dg-text-dim)]",
    dot: "bg-[var(--dg-text-dim)]",
    Icon: Circle,
  },
  error: {
    label: "오류",
    text: "text-[var(--dg-red)]",
    dot: "bg-[var(--dg-red)]",
    Icon: AlertTriangle,
  },
  rejected: {
    label: "반려",
    text: "text-[var(--dg-red)]",
    dot: "bg-[var(--dg-red)]",
    Icon: Flag,
  },
};
