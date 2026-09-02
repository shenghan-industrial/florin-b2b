import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products-db";
import CollectionPage from "@/components/CollectionPage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Best-Sellers for New Buyers | Florin Wholesale",
  description: "The safest first order — proven demand across markets.",
};

export default async function BestSellersPage() {
  const products = (await getAllProducts()).filter((p) => p.bestSeller);
  return (
    <CollectionPage
      products={products}
      pageSlug="best-sellers"
      showCategoryFilter
      breadcrumb={[{ name: "Best-Sellers", href: "/best-sellers/" }]}
    />
  );
}
