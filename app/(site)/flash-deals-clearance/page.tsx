import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products-db";
import CollectionPage from "@/components/CollectionPage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Flash Deals & Clearance | Florin Wholesale",
  description:
    "Limited-quantity clearance stock for margin-focused buyers. MOQ shown on every item.",
};

export default async function FlashDealsPage() {
  const products = (await getAllProducts()).filter((p) => p.clearance);
  return (
    <CollectionPage
      products={products}
      pageSlug="flash-deals-clearance"
      showCategoryFilter
      breadcrumb={[{ name: "Flash Deals & Clearance", href: "/flash-deals-clearance/" }]}
    />
  );
}
