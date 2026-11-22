import { Quote } from "lucide-react";
import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

const TESTIMONIALS = [
  {
    name: "Jordan K.",
    role: "Cleared out a storage unit, 14 items",
    quote:
      "I expected to haggle item by item. Instead the whole unit got priced as one box and the total went up once I crossed into the next tier.",
    imageId: "1506794778202-cad84cf45f1d",
  },
  {
    name: "Priya M.",
    role: "Seasonal camera-gear reseller",
    quote:
      "The condition grades matched what a local shop told me almost exactly, and the payout cleared before the buyer even picked up the gear.",
    imageId: "1535713875002-d1d0cf377fde",
  },
  {
    name: "Theo R.",
    role: "Moved apartments, 9 items",
    quote:
      "Watching the per-item average climb as I added more boxes to the count was the first time a trade-in felt like it rewarded bulk instead of punishing it.",
    imageId: "1517841905240-472988babdf9",
  },
] as const;

export function SocialProof() {
  return (
    <section className="border-t border-white/10 bg-[#0b0b0f] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-white sm:text-4xl">
            What sellers say.
          </h2>
        </Reveal>

        <RevealGroup className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <RevealItem key={t.name} className="min-w-0">
              <figure className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <Quote aria-hidden="true" size={18} className="text-green-400" />
                <blockquote className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-300">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <div className="relative aspect-square h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                    <Image
                      src={`https://images.unsplash.com/${t.imageId}?auto=format&fit=crop&w=96&q=70`}
                      alt={`Portrait of ${t.name}`}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-zinc-400">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
