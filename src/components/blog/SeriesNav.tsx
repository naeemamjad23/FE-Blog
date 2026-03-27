import Link from "next/link";
import type { Post, Series } from "@/types";

interface SeriesNavProps {
  series: Series;
  currentPostId: string;
  posts: Post[];
}

export function SeriesNav({ series, currentPostId, posts }: SeriesNavProps) {
  const currentIndex = posts.findIndex((p) => p.id === currentPostId);
  const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="bg-gray-50 rounded-xl p-6 my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Series</p>
          <Link href={`/series/${series.slug}`} className="font-semibold text-gray-900 hover:text-emerald-600">
            {series.title}
          </Link>
        </div>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {posts.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
        <div
          className="bg-emerald-500 h-1.5 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / posts.length) * 100}%` }}
        />
      </div>

      {/* Prev/Next */}
      <div className="flex justify-between gap-4">
        {prev ? (
          <Link
            href={`/${prev.domain?.slug || series.domain.slug}/${prev.slug}`}
            className="text-sm text-gray-600 hover:text-emerald-600"
          >
            &larr; {prev.title}
          </Link>
        ) : <div />}
        {next ? (
          <Link
            href={`/${next.domain?.slug || series.domain.slug}/${next.slug}`}
            className="text-sm text-gray-600 hover:text-emerald-600 text-right"
          >
            {next.title} &rarr;
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
