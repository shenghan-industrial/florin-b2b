import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/products-db";
import PdpContent from "@/components/PdpContent";

export const runtime = "edge";
// CMS 数据在 KV 里，必须每次请求动态读取，不能构建时静态化
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const title = `${p.name.en} | Wholesale ${p.catLabel.en} — Florin`;
  const desc = `Buy ${p.name.en} wholesale: MOQ ${p.moq} ${p.unit}, ${p.sample ? "sample available" : "no sample"}${p.oem ? ", OEM private-label supported" : ""}. Factory-direct ${p.catLabel.en} for resellers & salons.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `/product/${slug}/` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();
  const related = (await getAllProducts())
    .filter((x) => x.category === p.category && x.id !== p.id)
    .slice(0, 4);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name.en,
    image: [p.image],
    description: `Buy ${p.name.en} wholesale from Florin. MOQ ${p.moq} ${p.unit}, factory-direct for resellers & salons.`,
    brand: { "@type": "Brand", name: "Florin" },
    category: p.catLabel.en,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "USD",
      minOrderQuantity: p.moq,
      availability: "https://schema.org/InStock",
      url: `https://www.florinwholesale.com/product/${slug}/`,
      seller: { "@type": "Organization", name: "Florin Wholesale" },
    },
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 1000 }}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href={p.category === "lashes" ? "/false-lashes-wholesale/" : p.category === "nails" ? "/press-on-nails-wholesale/" : p.category === "contacts" ? "/colored-contacts-wholesale/" : "/wholesale/"}>
            {p.catLabel.en}
          </a>
          <span>/</span>
          <span>{p.name.en}</span>
        </nav>
        <PdpContent p={p} related={related} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        />
      </div>
    </section>
  );
}
