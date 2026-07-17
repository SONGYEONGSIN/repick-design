"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Mail, MessageCircle, Smartphone } from "lucide-react";
import type { Channel, Status } from "../lib/data";
import { avatarUrl, cn } from "../lib/format";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-zinc-200 bg-white shadow-sm", className)}>{children}</div>;
}

export function EyebrowLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-[11px] font-semibold uppercase tracking-wide text-zinc-500", className)}>
      {children}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "urgent" | "success" | "warning" | "info";
  className?: string;
}) {
  const toneClass: Record<string, string> = {
    neutral: "border-zinc-200 bg-zinc-50 text-zinc-600",
    urgent: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    info: "border-indigo-200 bg-indigo-50 text-indigo-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const STATUS_META: Record<Status, { label: string; tone: "warning" | "info" | "success"; dot: string }> = {
  open: { label: "Open", tone: "info", dot: "bg-indigo-500" },
  pending: { label: "Pending", tone: "warning", dot: "bg-amber-500" },
  resolved: { label: "Resolved", tone: "success", dot: "bg-emerald-500" },
};

export function StatusBadge({ status, className = "" }: { status: Status; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <Badge tone={meta.tone} className={className}>
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}

const CHANNEL_ICON: Record<Channel, typeof Mail> = {
  email: Mail,
  chat: MessageCircle,
  sms: Smartphone,
};

const CHANNEL_LABEL: Record<Channel, string> = {
  email: "Email",
  chat: "Chat",
  sms: "SMS",
};

export function ChannelIcon({ channel, className = "h-3.5 w-3.5" }: { channel: Channel; className?: string }) {
  const Icon = CHANNEL_ICON[channel];
  return <Icon className={className} aria-hidden="true" />;
}

export function ChannelBadge({ channel }: { channel: Channel }) {
  const Icon = CHANNEL_ICON[channel];
  return (
    <Badge tone="neutral">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {CHANNEL_LABEL[channel]}
    </Badge>
  );
}

export function Avatar({ avatarId, name, size = 32 }: { avatarId: string; name: string; size?: number }) {
  return (
    <Image
      src={avatarUrl(avatarId, size * 2)}
      alt=""
      title={name}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}

export function IconButton({
  children,
  label,
  onClick,
  active = false,
  className = "",
  size = "h-11 w-11",
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  size?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
        size,
        active
          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "sm",
}: {
  options: { id: T; label: string; icon?: React.ComponentType<{ className?: string }> }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5"
    >
      {options.map((opt) => {
        const active = opt.id === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
              size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
            )}
          >
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
}: {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex items-center gap-4 border-b border-zinc-200 px-1">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative -mb-px border-b-2 px-1 py-2.5 text-sm font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              active ? "border-indigo-600 text-indigo-700" : "border-transparent text-zinc-500 hover:text-zinc-800",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
