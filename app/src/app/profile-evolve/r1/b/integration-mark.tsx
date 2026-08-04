import type { LucideIcon } from "lucide-react";
import { BarChart3, CreditCard, Headset, ShoppingCart, Terminal, Users } from "lucide-react";
import { CATEGORY_HUE, type CategoryKey } from "./data";

const CATEGORY_ICON: Record<CategoryKey, LucideIcon> = {
  crm: Users,
  support: Headset,
  payments: CreditCard,
  ecommerce: ShoppingCart,
  analytics: BarChart3,
  devops: Terminal,
};

function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Category-hued square tile with a matching lucide glyph — the "app mark" for a card. */
export default function IntegrationMark({
  slug,
  category,
  className,
}: {
  slug: string;
  category: CategoryKey;
  className?: string;
}) {
  const hue = CATEGORY_HUE[category];
  const angle = hash(slug) % 360;
  const Icon = CATEGORY_ICON[category];
  const gradId = `imark-${slug}`;

  return (
    <span className={`relative block ${className ?? ""}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true" className="block h-full w-full">
        <defs>
          <linearGradient id={gradId} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
            <stop offset="0%" stopColor={`hsl(${hue} 62% 38%)`} />
            <stop offset="100%" stopColor={`hsl(${hue} 55% 20%)`} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="20" fill={`url(#${gradId})`} />
      </svg>
      <Icon
        aria-hidden="true"
        strokeWidth={1.75}
        className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 text-white/90"
      />
    </span>
  );
}
