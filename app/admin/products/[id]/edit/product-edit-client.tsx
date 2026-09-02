"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Product } from "@/lib/types";
import ProductForm from "../../../components/ProductForm";

export default function ProductEditClient() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/products/${id}/`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setProduct(j.product))
      .catch(() => setProduct(null));
  }, [id]);

  if (product === undefined) return <p style={{ color: "var(--ink-soft)" }}>加载中…</p>;
  if (product === null) return <p style={{ color: "#c0392b" }}>产品不存在</p>;
  return <ProductForm product={product} />;
}