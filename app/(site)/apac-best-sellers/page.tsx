import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products-db";
import CollectionPage from "@/components/CollectionPage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Asia-Pacific Best Sellers | Florin Wholesale",
  description: "Press-on nail styles proven in Japan, Korea and Southeast Asia.",
};

export default async function ApacBestSellersPage() {
  const products = (await getAllProducts()).filter((p) => p.region === "apac");
  return (
    <CollectionPage
      products={products}
      pageSlug="apac-best-sellers"
      showCategoryFilter
      breadcrumb={[{ name: "Asia-Pacific Best Sellers", href: "/apac-best-sellers/" }]}
    />
  );
}
