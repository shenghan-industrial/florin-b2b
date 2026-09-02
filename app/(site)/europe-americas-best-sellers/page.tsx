import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products-db";
import CollectionPage from "@/components/CollectionPage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Europe & Americas Best Sellers | Florin Wholesale",
  description: "Press-on nail styles proven in Europe and North America.",
};

export default async function EuNaBestSellersPage() {
  const products = (await getAllProducts()).filter((p) => p.region === "eu-na");
  return (
    <CollectionPage
      products={products}
      pageSlug="europe-americas-best-sellers"
      showCategoryFilter
      breadcrumb={[{ name: "Europe & Americas Best Sellers", href: "/europe-americas-best-sellers/" }]}
    />
  );
}
