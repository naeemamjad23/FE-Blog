"use client";

import { useState, useEffect } from "react";
import { PostCard } from "@/components/blog/PostCard";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { Post, PaginatedResponse } from "@/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setPosts([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get<{ data: PaginatedResponse<Post> } | PaginatedResponse<Post>>(
          `/api/posts?search=${encodeURIComponent(query)}&limit=12`
        );
        const result = "posts" in data ? data : (data as any).data;
        setPosts(result.posts || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>
      <div className="max-w-md mb-8">
        <Input
          type="search"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {loading && <p className="text-gray-500">Searching...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {query.length >= 2 && !loading && posts.length === 0 && (
        <p className="text-gray-500 text-center py-12">No results found for &ldquo;{query}&rdquo;</p>
      )}
    </div>
  );
}
