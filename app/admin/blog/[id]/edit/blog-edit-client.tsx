"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { BlogPost } from "@/lib/types";
import BlogForm from "../../../components/BlogForm";

export default function BlogEditClient() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/blog/${id}/`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setPost(j.post))
      .catch(() => setPost(null));
  }, [id]);

  if (post === undefined) return <p style={{ color: "var(--ink-soft)" }}>加载中…</p>;
  if (post === null) return <p style={{ color: "#c0392b" }}>文章不存在</p>;
  return <BlogForm post={post} />;
}