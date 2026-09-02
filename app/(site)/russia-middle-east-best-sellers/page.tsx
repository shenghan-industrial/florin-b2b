import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products-db";
import CollectionPage from "@/components/CollectionPage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Russia & Middle East Best Sellers | Florin Wholesale",
  description: "Press-on nail styles proven in Russia and the Middle East.",
};

export default async function RuMeBestSellersPage() {
  const products = (await getAllProducts()).filter((p) => p.region === "ru-me");
  return (
    <CollectionPage
      products={products}
      pageSlug="russia-middle-east-best-sellers"
      showCategoryFilter
      breadcrumb={[{ name: "Russia & Middle East Best Sellers", href: "/russia-middle-east-best-sellers/" }]}
    />
  );
}
