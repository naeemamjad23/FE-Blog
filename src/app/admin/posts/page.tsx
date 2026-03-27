"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Post, PaginatedResponse } from "@/types";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    api.get(`/api/posts/admin?page=${page}&limit=20`)
      .then(({ data }) => {
        const result = data.data || data;
        setPosts(result.posts || []);
        setTotalPages(result.pagination?.totalPages || 1);
      })
      .catch(() => {});
  }, [page]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/api/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <Link href="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Domain</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Views</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-900 max-w-xs truncate">{post.title}</td>
                <td className="py-3">
                  <Badge color={post.domain?.color || "#6B7280"}>{post.domain?.name}</Badge>
                </td>
                <td className="py-3">
                  <Badge className={post.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="py-3 text-gray-500">{post.viewCount}</td>
                <td className="py-3 text-gray-500">{post.publishedAt ? formatDate(post.publishedAt) : "—"}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/posts/${post.id}`} className="text-emerald-600 hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts.length === 0 && <p className="text-gray-500 text-center py-8">No posts yet.</p>}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm text-gray-500 py-1">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
