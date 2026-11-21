import { Briefcase, Camera, Footprints, Shirt, Watch, type LucideIcon } from "lucide-react";
import type { Product } from "./data";

// Generative, deterministic imagery (no photo service, no next/image needed — this is inline
// vector content, not a raster asset). Each category gets a fixed flat fill + a centered
// lucide glyph; a solid icon mark, not a line-art/blueprint outline treatment.
const CATEGORY: Record<Product["category"], { Icon: LucideIcon; fill: string }> = {
  jacket: { Icon: Shirt, fill: "#1E2A33" },
  bag: { Icon: Briefcase, fill: "#2A241E" },
  footwear: { Icon: Footprints, fill: "#20242A" },
  watch: { Icon: Watch, fill: "#262026" },
  camera: { Icon: Camera, fill: "#1E1E24" },
};

export function ProductThumb({ product }: { product: Product }) {
  const { Icon, fill } = CATEGORY[product.category];
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-lg"
      style={{ backgroundColor: fill }}
      role="img"
      aria-label={`${product.title}, ${product.brand}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="h-10 w-10 text-white/35" strokeWidth={1.75} aria-hidden="true" />
      </div>
    </div>
  );
}
