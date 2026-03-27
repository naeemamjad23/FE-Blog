import Link from "next/link";
import { fetchAPI } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import type { Series } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await fetchAPI<{ data: Series } | Series>(`/api/series/${slug}`);
    const s = "data" in data && !("slug" in data) ? (data as { data: Series }).data : data as Series;
    return { title: s.title, description: s.description };
  } catch {
    return { title: "Series" };
  }
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params;

  let series: Series | null = null;
  try {
    const data = await fetchAPI<{ data: Series } | Series>(`/api/series/${slug}`);
    series = "data" in data && !("slug" in data) ? (data as { data: Series }).data : data as Series;
  } catch {}

  if (!series) {
    return <div className="text-center py-20 text-gray-500">Series not found</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: "Series", href: "/series" }, { label: series.title }]} />

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge color={series.domain?.color || "#6B7280"}>{series.domain?.name}</Badge>
          <Badge className="bg-gray-100 text-gray-600">{series.difficulty}</Badge>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{series.title}</h1>
        <p className="text-gray-600">{series.description}</p>
      </div>

      <div className="space-y-4">
        {series.posts?.map((post, index) => (
          <Link
            key={post.id}
            href={`/${series!.domain.slug}/${post.slug}`}
            className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
          >
            <span className="text-2xl font-bold text-gray-300 w-8 text-center shrink-0">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{post.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                {post.readTimeMin && <span>{post.readTimeMin} min read</span>}
                {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(!series.posts || series.posts.length === 0) && (
        <p className="text-gray-500 text-center py-8">No posts in this series yet.</p>
      )}
    </div>
  );
}
