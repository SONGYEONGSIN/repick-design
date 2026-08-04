// app/src/app/blog-evolve/r1/a/featured-post.tsx
//
// The pinned/most-recent post, rendered large and unconditionally on load — never gated behind an
// interaction (page-brief-core round note: hiding core content behind an interaction has cost a
// structurally novel candidate the round before).
import { ArrowRight, Clock, Star } from "lucide-react";
import CoverArt from "./cover-art";
import Avatar from "./avatar";
import { categoryOf, authorOf, type Post } from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F3A21] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF7F1]";

export default function FeaturedPost({ post }: { post: Post }) {
  const category = categoryOf(post.categoryId);
  const author = authorOf(post.authorId);
  const Icon = category.icon;

  return (
    <section aria-labelledby="featured-heading" className="grid gap-7 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
      <CoverArt
        seed={post.id}
        hue={category.hue}
        icon={Icon}
        title={post.title}
        className="aspect-[16/10] sm:aspect-[2/1] lg:aspect-[4/3.1]"
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#AE4526] px-3 py-1 text-xs font-bold tracking-wide text-[#FBF7F1] uppercase">
            <Star aria-hidden="true" strokeWidth={2} className="h-3.5 w-3.5" />
            Featured
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-[#5B4F41]">
            <Icon aria-hidden="true" strokeWidth={2} className="h-3.5 w-3.5" />
            {category.label}
          </span>
        </div>

        <h2
          id="featured-heading"
          className="mt-4 text-3xl font-bold text-balance text-[#221D18] sm:text-4xl"
          style={{ fontFamily: "var(--font-display-wide)" }}
        >
          {post.title}
        </h2>

        <p className="mt-4 max-w-xl text-base font-normal text-pretty text-[#5B4F41]">{post.excerpt}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-2.5">
            <Avatar initials={author.initials} hue={author.hue} name={author.name} size={36} />
            <div className="leading-tight">
              <p className="text-sm font-medium text-[#221D18]">{author.name}</p>
              <p className="text-xs font-normal text-[#5B4F41]">{author.role}</p>
            </div>
          </div>
          <span aria-hidden="true" className="h-4 w-px bg-[#E6D9C4]" />
          <p className="text-sm font-normal text-[#5B4F41]">
            <span>{post.dateLabel}</span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span className="inline-flex items-center gap-1 align-middle">
              <Clock aria-hidden="true" strokeWidth={2} className="h-3.5 w-3.5" />
              <span className="tabular-nums">{post.readMinutes} min read</span>
            </span>
          </p>
        </div>

        <a
          href="#"
          className={`mt-7 inline-flex items-center gap-2 rounded-lg bg-[#221D18] px-5 py-2.5 text-sm font-medium text-[#FBF7F1] transition-colors hover:bg-[#3A322A] ${FOCUS}`}
        >
          Read article
          <ArrowRight aria-hidden="true" strokeWidth={2} className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
