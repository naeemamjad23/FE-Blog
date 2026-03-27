import { fetchAPI } from "@/lib/api";
import { PostCard } from "@/components/blog/PostCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import type { Metadata } from "next";
import type { Post, PaginatedResponse } from "@/types";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `Posts tagged "${tag}"` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;

  let posts: Post[] = [];
  try {
    const data = await fetchAPI<{ data: PaginatedResponse<Post> } | PaginatedResponse<Post>>(
      `/api/posts?search=${encodeURIComponent(tag)}&limit=20`
    );
    const result = "data" in data && !("posts" in data) ? (data as { data: PaginatedResponse<Post> }).data : data as PaginatedResponse<Post>;
    posts = result.posts || [];
  } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: `Tag: ${tag}` }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Posts tagged &ldquo;{tag}&rdquo;</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {posts.length === 0 && <p className="text-gray-500 text-center py-12">No posts found.</p>}
    </div>
  );
}
