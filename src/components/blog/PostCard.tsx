import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { DomainBadge } from "./DomainBadge";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card hover>
      <Link href={`/${post.domain.slug}/${post.slug}`}>
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {post.isPremium && (
              <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                PREMIUM
              </span>
            )}
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <DomainBadge name={post.domain.name} slug={post.domain.slug} color={post.domain.color || undefined} />
            {post.isSponsored && (
              <span className="text-xs text-gray-400">Sponsored</span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-emerald-600">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{post.author.name}</span>
            <div className="flex items-center gap-2">
              {post.readTimeMin && <span>{post.readTimeMin} min read</span>}
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
