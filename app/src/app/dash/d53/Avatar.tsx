import Image from "next/image";
import type { Agent } from "./data";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

const TONE_CLASSES = [
  "bg-teal-50 text-teal-700",
  "bg-sky-50 text-sky-700",
  "bg-zinc-100 text-zinc-600",
  "bg-orange-50 text-orange-700",
];

function toneFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % TONE_CLASSES.length;
  return TONE_CLASSES[hash];
}

export function AgentAvatar({ agent, size = 28 }: { agent: Agent; size?: number }) {
  const src = `https://images.unsplash.com/photo-${agent.photoId}?q=80&w=128&auto=format&fit=facearea&facepad=2.4`;
  return (
    <Image
      src={src}
      alt={`${agent.name}, assigned agent`}
      width={size}
      height={size}
      className="shrink-0 rounded-full border border-zinc-200 object-cover"
      style={{ width: size, height: size }}
    />
  );
}

export function InitialsAvatar({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-zinc-200 font-medium ${toneFor(name)}`}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.38) }}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </span>
  );
}
