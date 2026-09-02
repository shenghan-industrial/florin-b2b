import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products-db";
import CollectionPage from "@/components/CollectionPage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "False Lashes Wholesale | Florin Wholesale",
  description:
    "Ready-stock false lashes with clear MOQ, sample availability and OEM private-label support. Filter by MOQ, shape and OEM.",
};

export default async function LashesPage() {
  const products = (await getAllProducts()).filter((p) => p.category === "lashes");
  return (
    <CollectionPage
      products={products}
      pageSlug="false-lashes-wholesale"
      breadcrumb={[{ name: "False Lashes", href: "/false-lashes-wholesale/" }]}
    />
  );
}
