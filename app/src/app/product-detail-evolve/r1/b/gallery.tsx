"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_VIEWS, FOCUS, cx, type Finish } from "./data";
import InterfaceArt from "./interface-art";

/** Full-bleed media gallery: arrow navigation, thumbnail selection, and left/right arrow-key
 * support on the frame itself — three ways to reach the same state, one source of truth. */
export default function Gallery({ finish }: { finish: Finish }) {
  const [index, setIndex] = useState(0);
  const view = GALLERY_VIEWS[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + GALLERY_VIEWS.length) % GALLERY_VIEWS.length);
  }

  return (
    <div>
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 sm:aspect-[16/8]"
        role="group"
        aria-roledescription="carousel"
        aria-label="Aria II product gallery"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(-1);
          }
        }}
      >
        <div key={view.id} className="absolute inset-0 animate-[gallery-fade_0.3s_ease-out_backwards] motion-reduce:animate-none">
          <InterfaceArt view={view.id} finish={finish} />
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          className={cx(
            "absolute top-1/2 left-3 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm backdrop-blur transition-colors hover:bg-white",
            FOCUS,
          )}
          aria-label="Previous view"
        >
          <ChevronLeft className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className={cx(
            "absolute top-1/2 right-3 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm backdrop-blur transition-colors hover:bg-white",
            FOCUS,
          )}
          aria-label="Next view"
        >
          <ChevronRight className="h-4.5 w-4.5" aria-hidden="true" />
        </button>

        <p className="absolute right-3 bottom-3 left-3 rounded-lg bg-white/90 px-3 py-2 text-sm font-normal text-zinc-700 backdrop-blur sm:right-auto sm:max-w-sm">
          {view.caption}
        </p>
      </div>

      <div role="tablist" aria-label="Gallery views" className="mt-3 grid grid-cols-4 gap-2">
        {GALLERY_VIEWS.map((v, i) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={cx(
              "flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-colors",
              i === index ? "border-orange-600 bg-orange-50" : "border-zinc-200 bg-white hover:border-zinc-300",
              FOCUS,
            )}
          >
            <span className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-zinc-100">
              <InterfaceArt view={v.id} finish={finish} />
            </span>
            <span className={cx("text-xs", i === index ? "font-medium text-orange-700" : "font-normal text-zinc-600")}>
              {v.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
