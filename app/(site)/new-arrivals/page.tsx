import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products-db";
import CollectionPage from "@/components/CollectionPage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Arrivals | Florin Wholesale",
  description: "New styles with clear MOQ and sample availability — no retail hype.",
};

export default async function NewArrivalsPage() {
  const products = (await getAllProducts()).filter((p) => p.newArrival);
  return (
    <CollectionPage
      products={products}
      pageSlug="new-arrivals"
      showCategoryFilter
      breadcrumb={[{ name: "New Arrivals", href: "/new-arrivals/" }]}
    />
  );
}
