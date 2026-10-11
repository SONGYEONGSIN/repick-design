import Image from "next/image";
import { Percent, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { PRODUCTS } from "./data";

export default function ProductPreview() {
  return (
    <section id="listings" className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal className="max-w-[38rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#176B41]">
            Listings, graded
          </p>
          <h2
            className="mt-3 text-zinc-900"
            style={{
              fontFamily: "var(--font-display-wide)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.5rem)",
            }}
          >
The same four checks, every card
          </h2>
          <p className="mt-3 max-w-[31rem] text-base leading-relaxed text-zinc-600">
            Match percentage, condition grade, seller verification, and the
            discount from retail — shown at rest, on every card, every time.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i, 3) * 0.06} className="min-w-0">
              <article className="flex h-full min-w-0 flex-col rounded-2xl border border-zinc-200 p-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100">
                  <Image
                    src={`https://images.unsplash.com/photo-${product.photoId}?auto=format&fit=crop&w=480&q=70`}
                    alt={`${product.name}, a ${product.categoryLabel.toLowerCase()} listing on repick`}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 85vw"
                    className="object-cover"
                  />
                </div>

                <h3 className="mt-4 truncate text-sm font-semibold text-zinc-900">
                  {product.name}
                </h3>
                <p className="mt-0.5 text-xs text-zinc-500">{product.categoryLabel}</p>

                {/* Badge row — below the photo, never on top of it; always visible, never hover-gated */}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-700">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF6EF] px-2 py-0.5 font-semibold text-[#176B41]">
                    <span className="tabular-nums">{product.matchPct}%</span> match
                  </span>
                  <span className="font-semibold">Grade {product.conditionGrade}</span>
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#176B41]" aria-hidden="true" />
                    Verified
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                  <p className="text-sm text-zinc-500">
                    <span className="tabular-nums line-through">{`$${product.priceBefore}`}</span>{" "}
                    <span className="tabular-nums font-semibold text-zinc-900">
                      {`$${product.priceAfter}`}
                    </span>
                  </p>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[#1E7A4C] px-2.5 py-1 text-xs font-semibold tabular-nums text-white">
                    <Percent className="h-3 w-3" aria-hidden="true" />
                    {product.discountPct}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
