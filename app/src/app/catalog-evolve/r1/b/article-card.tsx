"use client";

import Image from "next/image";
import { Bookmark, Clock, Lock, TrendingUp, Unlock } from "lucide-react";
import { useState } from "react";
import { formatViews, type Article, type CardVariant } from "./data";

const TOPIC_STYLES: Record<Article["topic"], string> = {
  Technology: "border-sky-800/60 text-sky-300",
  Culture: "border-fuchsia-800/60 text-fuchsia-300",
  Business: "border-amber-800/60 text-amber-300",
  Science: "border-teal-800/60 text-teal-300",
  Design: "border-orange-800/60 text-orange-300",
  Politics: "border-rose-800/60 text-rose-300",
};

const RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

function AccessBadge({ access }: { access: Article["access"] }) {
  if (access === "members") {
    return (
      <span className="inline-flex items-center gap-1 text-amber-300">
        <Lock className="size-3.5" aria-hidden="true" />
        Members
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-zinc-400">
      <Unlock className="size-3.5" aria-hidden="true" />
      Free
    </span>
  );
}

function SaveButton({ title, saved, onToggle }: { title: string; saved: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove "${title}" from saved dispatches` : `Save "${title}" for later`}
      onClick={onToggle}
      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors ${RING} ${
        saved
          ? "border-amber-400 bg-amber-400 text-zinc-950"
          : "border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
      }`}
    >
      <Bookmark className="size-4" fill={saved ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}

function Metrics({ article }: { article: Article }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-normal text-zinc-400">
      <span className="inline-flex items-center gap-1 tabular-nums">
        <Clock className="size-3.5" aria-hidden="true" />
        {article.readMinutes} min read
      </span>
      <span className="inline-flex items-center gap-1 tabular-nums">
        <TrendingUp className="size-3.5" aria-hidden="true" />
        {formatViews(article.views)} reads
      </span>
      <AccessBadge access={article.access} />
    </div>
  );
}

function Thumb({
  article,
  aspect,
  sizes,
}: {
  article: Article;
  aspect: string;
  sizes: string;
}) {
  return (
    <div className={`relative w-full ${aspect} shrink-0 overflow-hidden rounded-lg bg-zinc-800`}>
      <Image
        src={`https://images.unsplash.com/photo-${article.imageId}?auto=format&fit=crop&w=1200&q=60`}
        alt={article.imageAlt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

export function ArticleCard({
  article,
  variant,
  index,
}: {
  article: Article;
  variant: CardVariant;
  index: number;
}) {
  const [saved, setSaved] = useState(false);
  const delay = Math.min(index, 7) * 45;
  const topicClass = TOPIC_STYLES[article.topic];

  const spanClass =
    variant === "standard" ? "" : "sm:col-span-2 lg:col-span-2";
  const imageAspect = variant === "feature" ? "aspect-[16/10]" : variant === "wide" ? "aspect-[21/9]" : "aspect-[4/3]";
  const titleClass =
    variant === "feature"
      ? "text-2xl sm:text-3xl"
      : variant === "wide"
        ? "text-xl"
        : "text-base";

  return (
    <article
      className={`group relative flex min-w-0 flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 motion-safe:animate-[rise_0.5s_ease-out_backwards] motion-reduce:opacity-100 sm:p-4 ${spanClass}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Thumb
        article={article}
        aspect={imageAspect}
        sizes={variant === "standard" ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 50vw, 100vw"}
      />

      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${topicClass}`}>
          {article.topic}
        </span>
        <span className="text-xs font-normal text-zinc-400">{article.format}</span>
      </div>

      <div className="flex min-w-0 items-start justify-between gap-3">
        <h3 className={`min-w-0 font-semibold tracking-tight text-zinc-50 ${titleClass}`}>{article.title}</h3>
        <SaveButton title={article.title} saved={saved} onToggle={() => setSaved((v) => !v)} />
      </div>

      {(variant === "feature" || variant === "wide") && (
        <p className="line-clamp-2 text-sm font-normal text-zinc-300">{article.dek}</p>
      )}

      <div className="mt-auto flex flex-col gap-2 border-t border-zinc-800 pt-3">
        <p className="text-xs font-normal text-zinc-400">
          {article.author} <span aria-hidden="true">&middot;</span> {article.dateLabel}
        </p>
        <Metrics article={article} />
      </div>
    </article>
  );
}

export function ArticleRow({ article, index }: { article: Article; index: number }) {
  const [saved, setSaved] = useState(false);
  const delay = Math.min(index, 9) * 35;
  const topicClass = TOPIC_STYLES[article.topic];

  return (
    <article
      className="flex min-w-0 flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 motion-safe:animate-[rise_0.4s_ease-out_backwards] motion-reduce:opacity-100 sm:flex-row sm:items-center sm:gap-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Thumb article={article} aspect="aspect-[16/10] sm:aspect-square sm:w-28" sizes="(min-width: 640px) 112px, 100vw" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${topicClass}`}>
            {article.topic}
          </span>
          <span className="text-xs font-normal text-zinc-400">{article.format}</span>
        </div>
        <div className="flex min-w-0 items-start justify-between gap-3">
          <h3 className="min-w-0 truncate text-base font-semibold tracking-tight text-zinc-50">{article.title}</h3>
          <SaveButton title={article.title} saved={saved} onToggle={() => setSaved((v) => !v)} />
        </div>
        <p className="text-xs font-normal text-zinc-400">
          {article.author} <span aria-hidden="true">&middot;</span> {article.dateLabel}
        </p>
        <Metrics article={article} />
      </div>
    </article>
  );
}
