'use client';

import type { LucideIcon } from 'lucide-react';

type CategoryArtProps = {
  icon: LucideIcon;
  label: string;
  size?: number;
};

/**
 * Generative, code-drawn product art instead of a photo — no external image
 * host dependency, and a fixed `aspect-ratio` + solid reserved background
 * color, so there is never a loading/failure state to guard against. Kept
 * flat and near-monochrome (no gradients, no line-art/blueprint motifs): a
 * single large icon centered on a solid tint.
 */
export default function CategoryArt({ icon: Icon, label, size = 56 }: CategoryArtProps) {
  return (
    <div
      className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-zinc-100"
      role="img"
      aria-label={label}
    >
      <Icon size={size} strokeWidth={1.5} className="text-zinc-400" />
    </div>
  );
}
