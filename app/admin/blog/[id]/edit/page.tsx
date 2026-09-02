import BlogEditClient from "./blog-edit-client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function EditBlogPage() {
  return <BlogEditClient />;
}