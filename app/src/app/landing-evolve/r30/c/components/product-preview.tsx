import { EXAMPLE_ITEM, SIGNALS, STATIC_PRODUCTS } from "./data";
import { ProductCard, type ProductCardData } from "./product-card";
import { SectionIntro } from "./ui";

const LIVE_CARD: ProductCardData = {
  id: "patagonia-fleece",
  name: EXAMPLE_ITEM.name,
  meta: EXAMPLE_ITEM.meta,
  categoryGhost: "FLEECE",
  price: EXAMPLE_ITEM.price,
  originalPrice: EXAMPLE_ITEM.originalPrice,
  grade: EXAMPLE_ITEM.grade,
  gradeLabel: EXAMPLE_ITEM.gradeLabel,
  sellerRating: EXAMPLE_ITEM.sellerRating,
  reasons: ["Wear-pattern consistency", "Silhouette fit"],
  signals: [
    { label: SIGNALS[0].short, raw: SIGNALS[0].raw },
    { label: SIGNALS[1].short, raw: SIGNALS[1].raw },
    { label: SIGNALS[2].short, raw: SIGNALS[2].raw },
  ],
  isLive: true,
};

const STATIC_CARDS: ProductCardData[] = STATIC_PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  meta: p.meta,
  categoryGhost: p.categoryGhost,
  price: p.price,
  originalPrice: p.originalPrice,
  grade: p.grade,
  gradeLabel: p.gradeLabel,
  sellerRating: p.sellerRating,
  reasons: p.reasons,
  signals: p.signals,
}));

export function ProductPreview() {
  return (
    <section id="preview" className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="MORE MATCHES, SAME METHOD"
          heading="Every listing gets the same breakdown."
          body="Pick any card below and open its reasoning — the same three signals, the same arithmetic, applied to a camera and a coat instead of a fleece."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard product={LIVE_CARD} />
          {STATIC_CARDS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
