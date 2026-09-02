import ProductEditClient from "./product-edit-client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function EditProductPage() {
  return <ProductEditClient />;
}