import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products-db";
import CollectionPage from "@/components/CollectionPage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Press-On Nails Wholesale | Florin Wholesale",
  description:
    "Salon-grade press-on nails with clear MOQ, sample availability and OEM supported. 14 sizes per set, no UV lamp required.",
};

export default async function NailsPage() {
  const products = (await getAllProducts()).filter((p) => p.category === "nails");
  return (
    <CollectionPage
      products={products}
      pageSlug="press-on-nails-wholesale"
      breadcrumb={[{ name: "Press-On Nails", href: "/press-on-nails-wholesale/" }]}
    />
  );
}
