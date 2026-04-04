import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { DomainBadge } from "./DomainBadge";
import type { Post } from "@/types";

interface PostMetaProps {
  post: Post;
}

export function PostMeta({ post }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
      {/* Author */}
      <Link href={`/author/${post.author.slug}`} className="flex items-center gap-2 hover:text-gray-900">
        {post.author.avatar ? (
          <img src={post.author.avatar} alt={post.author.name} width={32} height={32} className="rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
            {post.author.name.charAt(0)}
          </div>
        )}
        <span className="font-medium">{post.author.name}</span>
      </Link>

      <span className="text-gray-300">|</span>

      {/* Date */}
      {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}

      <span className="text-gray-300">|</span>

      {/* Read time */}
      {post.readTimeMin && <span>{post.readTimeMin} min read</span>}

      <span className="text-gray-300">|</span>

      {/* Domain */}
      <DomainBadge name={post.domain.name} slug={post.domain.slug} color={post.domain.color || undefined} />

      {/* Share buttons */}
      <div className="ml-auto flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://blog.securemango.com/${post.domain.slug}/${post.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-500 transition-colors"
          aria-label="Share on Twitter"
        >
          𝕏
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://blog.securemango.com/${post.domain.slug}/${post.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-700 transition-colors"
          aria-label="Share on LinkedIn"
        >
          in
        </a>
      </div>
    </div>
  );
}
