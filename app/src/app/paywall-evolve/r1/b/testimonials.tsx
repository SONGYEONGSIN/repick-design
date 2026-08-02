import { TESTIMONIALS } from "./data";

/** Static social proof — plain initials avatars (colored circle + text), never a photo, so there is
 * no remote image and nothing to reserve a decode-failure fallback for. */
export default function Testimonials() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {TESTIMONIALS.map((t) => (
        <figure key={t.name} className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <blockquote className="text-sm font-normal leading-relaxed text-zinc-300">&ldquo;{t.quote}&rdquo;</blockquote>
          <figcaption className="mt-auto flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-green-500/10 text-xs font-medium text-green-400"
            >
              {t.initials}
            </span>
            <span>
              <span className="block text-sm font-medium text-zinc-100">{t.name}</span>
              <span className="block text-xs font-normal text-zinc-400">{t.role}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
