import { DISPLAY, TESTIMONIAL } from "./data";

/**
 * Single large pull-quote — one customer's voice, set big and editorial, not a grid of small quote
 * cards. Reveal reuses the repo's shared `rise` keyframe (see globals.css); resting styles are
 * already the finished, fully-visible state, so `motion-reduce:animate-none` lands on legible
 * content instead of anything hidden.
 */
export default function PullQuote() {
  return (
    <section aria-label="Customer testimonial" className="border-t border-white/10">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <figure
          className="mx-auto max-w-[42ch] animate-[rise_0.6s_ease-out_backwards] text-center motion-reduce:animate-none"
        >
          <span aria-hidden="true" style={DISPLAY} className="block text-5xl font-bold text-[#6E56CF] sm:text-6xl">
            &ldquo;
          </span>
          <blockquote>
            <p
              style={DISPLAY}
              className="text-[clamp(1.5rem,3.4vw,2.5rem)] font-bold leading-[1.25] tracking-[-0.01em] text-white"
            >
              {TESTIMONIAL.quote}
            </p>
          </blockquote>
          <figcaption className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
            {TESTIMONIAL.name} · {TESTIMONIAL.role}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
