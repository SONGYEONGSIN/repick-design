import { ShoppingBag, Shirt, Footprints, Watch, type LucideProps } from "lucide-react";
import type { CategoryDef } from "./data";

const ICONS: Record<CategoryDef["icon"], typeof ShoppingBag> = {
  bag: ShoppingBag,
  shirt: Shirt,
  footprints: Footprints,
  watch: Watch,
};

export default function CategoryIcon({ icon, ...props }: { icon: CategoryDef["icon"] } & LucideProps) {
  const Cmp = ICONS[icon];
  return <Cmp {...props} />;
}
