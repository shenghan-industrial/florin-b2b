import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products-db";
import CollectionPage from "@/components/CollectionPage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wholesale Catalog | Florin Wholesale",
  description:
    "Filter the full Florin B2B catalog by category, MOQ, shape and OEM support. False lashes, press-on nails, colored contacts & accessories.",
};

export default async function WholesalePage() {
  const products = await getAllProducts();
  return (
    <CollectionPage
      products={products}
      pageSlug="wholesale"
      showCategoryFilter
      breadcrumb={[{ name: "Wholesale Catalog", href: "/wholesale/" }]}
    />
  );
}
