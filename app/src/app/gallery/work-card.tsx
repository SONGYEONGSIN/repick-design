"use client";

import { useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/works";
import { STRINGS, type Lang } from "./gallery-i18n";

/** Desktop preview is authored at this width; the card scales it down to whatever width the grid gives it. */
const PREVIEW_W = 1440;
/**
 * Page height rendered inside the preview iframe. Deliberately much taller than the visible card
 * window: an iframe only ~1 viewport tall means its own viewport ends at the fold, so scroll-linked
 * reveals (`whileInView`, IntersectionObserver) below the fold never fire and the lower half of the
 * page paints blank. Rendering tall puts those sections inside the iframe's viewport, so they are
 * already revealed by the time the card scrolls through them.
 */
const CAPTURE_H = 2400;

export function WorkCard({ work, lang, label }: { work: Work; lang: Lang; label: string }) {
  const [loaded, setLoaded] = useState(false);
  const [hover, setHover] = useState(false);
  const [reduced, setReduced] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  // Scale from the measured card width, never a constant — a hardcoded factor goes stale the moment
  // the grid changes and silently crops the right edge of every desktop preview.
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / PREVIEW_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const h = work.previewH ?? 300;
  // Scroll-through: on hover, walk the preview down the page at a constant speed so works whose
  // value lives below the fold (catalog grids, scroll-linked landings) are visible from the card.
  const windowH = scale > 0 ? h / scale : 0; // page px visible in the card at rest
  // Travel only as far as the page actually goes — a work shorter than CAPTURE_H would otherwise
  // scroll into empty background. Previews are same-origin, so the real height is readable.
  // Two flags fit the iframe's viewport to the card box, so the whole screen lands in the preview
  // height with nothing left over and nothing cropped: `singleScreen` (a page that never scrolls)
  // and `viewportPreview` (a page laid out in viewport units). They differ only in what hover does —
  // the first has nowhere to go, the second scrolls its own document.
  //
  // Everything else keeps the tall capture height, which is a *substitute* for scrolling and holds
  // only for layouts that ignore viewport height. A page whose sections are `min-h-dvh` reads 2400
  // as the screen and stretches to match, putting its centred content below the card's window.
  const fitViewport = (work.singleScreen || work.viewportPreview) && scale > 0;
  const frameH = fitViewport ? Math.round(h / scale) : CAPTURE_H;
  const [pageH, setPageH] = useState(frameH);
  function measurePage(e: React.SyntheticEvent<HTMLIFrameElement>) {
    setLoaded(true);
    try {
      const doc = e.currentTarget.contentDocument;
      if (!doc) return;
      const real = doc.documentElement.scrollHeight;
      // A scrolling preview's document is legitimately taller than its viewport; capping it at the
      // frame would strand the scroll-through on the first screen.
      setPageH(work.viewportPreview ? real : Math.min(frameH, Math.max(windowH, real)));
    } catch {
      /* cross-origin preview — keep the default capture height */
    }
  }
  const range = Math.max(0, pageH - windowH); // page px available to travel
  const travel = hover && !reduced ? -range : 0;
  const travelMs = Math.round(Math.min(6000, (range / 420) * 1000)); // constant speed, capped

  // Scrolling preview: drive the iframe's own scroll rather than translating the frame. Timed off
  // the rAF timestamp, not a clock call, so nothing here reads the wall time.
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (!work.viewportPreview || reduced || !loaded) return;
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    const to = hover ? range : 0;
    const from = win.scrollY;
    const dur = hover ? travelMs : 420;
    if (dur <= 0 || from === to) {
      win.scrollTo(0, to);
      return;
    }
    let raf = 0;
    let t0 = 0;
    const step = (now: number) => {
      if (!t0) t0 = now;
      const k = Math.min(1, (now - t0) / dur);
      win.scrollTo(0, from + (to - from) * k);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [hover, reduced, loaded, range, travelMs, work.viewportPreview]);
  const t = STRINGS[lang];
  // Catalog works route to their detail page; evolve candidates (id has "/") have no detail page.
  const href = work.id.includes("/") ? work.route : `/gallery/${work.id}`;
  return (
    <a href={href}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)} onBlur={() => setHover(false)}
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0">
      {/* `min-h` rather than a fixed height, and the grid is `items-start` so a row never stretches its
          shorter cards. A mobile work (previewH 520) beside desktop ones (340) used to leave 182px of
          measured dead space under the badge; stretching the *preview* into that slack only moved the
          gap inside the frame, because a one-screen page scaled to 240px cannot fill a 520px box.
          Cards sized to their own content is the only version with no dead space in either place.
          (`h-full` had to go with it: under `items-start` it still resolves against the row, which is
          the tallest card, so it re-stretched everything this was meant to fix.) */}
      <div
        ref={frameRef}
        aria-hidden="true"
        className="relative w-full overflow-hidden border-b border-zinc-100 bg-zinc-50"
        style={{ height: h }}
      >
        {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-zinc-100 to-zinc-50 motion-reduce:animate-none" />}
        {work.category === "mobile" ? (
          <iframe src={work.route} loading="lazy" title={`${work.brand} preview`} tabIndex={-1}
            onLoad={() => setLoaded(true)}
            className={`pointer-events-none absolute left-1/2 top-0 origin-top transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ width: "390px", height: "844px", transform: `translateX(-50%) scale(${h / 844})`, border: 0 }} />
        ) : (
          <iframe ref={iframeRef} src={work.route} loading="lazy" title={`${work.brand} preview`} tabIndex={-1} scrolling="no" onLoad={measurePage}
            className={`pointer-events-none absolute left-0 top-0 origin-top-left ${loaded && scale > 0 ? "opacity-100" : "opacity-0"}`}
            style={{
              width: PREVIEW_W,
              height: frameH,
              // scale first, then translate in page pixels — the travel distance stays authoring-space.
              // A scrolling preview moves its own document, so the frame itself must stay put.
              transform: `scale(${scale}) translateY(${work.viewportPreview ? 0 : travel}px)`,
              transition: `opacity 300ms, transform ${hover ? travelMs : 420}ms linear`,
              border: 0,
            }} />
        )}
      </div>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-bold">{work.brand}</p>
          {work.status && <StatusBadge status={work.status} label={t.status[work.status]} />}
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500 group-hover:line-clamp-none">{work.desc[lang]}</p>
        {label && (
          <div className="mt-2.5">
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
          </div>
        )}
      </div>
    </a>
  );
}

function StatusBadge({ status, label }: { status: NonNullable<Work["status"]>; label: string }) {
  if (status === "winner") return <span className="shrink-0 rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold text-white">{label}</span>;
  if (status === "dropped") return <span className="shrink-0 rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-500">{label}</span>;
  return <span className="shrink-0 rounded-md border border-dashed border-zinc-300 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">{label}</span>;
}
