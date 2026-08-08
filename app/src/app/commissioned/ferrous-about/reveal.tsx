"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "./data";

/**
 * Scroll-linked entrance, arranged so that nothing ever depends on it.
 *
 * The resting styles are the *finished* state: the element renders visible on the server and stays
 * visible if JavaScript never runs, if `IntersectionObserver` is missing, or if the observer simply
 * never fires. The animation class is added only once the element has entered the viewport, and the
 * `rise` keyframe in globals.css supplies the offset it starts from. That is the opposite of the
 * usual `opacity-0` + `.is-visible` pattern, which leaves a crawler and a no-JS reader looking at an
 * invisible page — and which `page-brief-core` §3 bans for exactly that reason.
 *
 * `motion-reduce:animate-none` therefore lands on an element that is already in its final state
 * rather than on one that is invisible.
 */
export default function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setEntered(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cx(className, entered && "animate-[rise_0.5s_ease-out_both] motion-reduce:animate-none")}
      style={entered && delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
