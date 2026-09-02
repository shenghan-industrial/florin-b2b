import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products-db";
import CollectionPage from "@/components/CollectionPage";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Colored Contacts Wholesale | Florin Wholesale",
  description:
    "Cosmetic colored contact lenses with clear MOQ and sample availability. Compliance documents on request.",
};

export default async function ContactsPage() {
  const products = (await getAllProducts()).filter((p) => p.category === "contacts");
  return (
    <CollectionPage
      products={products}
      pageSlug="colored-contacts-wholesale"
      breadcrumb={[{ name: "Colored Contacts", href: "/colored-contacts-wholesale/" }]}
    />
  );
}
