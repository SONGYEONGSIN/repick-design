import { productsFor, type Category } from "./data";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ category }: { category: Category }) {
  const products = productsFor(category);
  return (
    <ul role="list" className="grid grid-cols-2 gap-3 sm:gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
