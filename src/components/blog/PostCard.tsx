import Link from "next/link";
import Image from "next/image";
import { DomainBadge } from "./DomainBadge";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <Link
      href={`/${post.domain.slug}/${post.slug}`}
      className={`group block rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 hover:border-gray-200 hover:-translate-y-0.5 ${
        featured ? "md:flex" : ""
      }`}
    >
      {/* Image */}
      {post.coverImage ? (
        <div className={`relative overflow-hidden ${featured ? "md:w-1/2" : "aspect-[16/9]"}`}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {post.isPremium && (
            <span className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Premium
            </span>
          )}
        </div>
      ) : (
        <div className={`bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ${featured ? "md:w-1/2 aspect-auto min-h-[200px]" : "aspect-[16/9]"}`}>
          <span
            className="text-4xl opacity-30"
            style={{ color: post.domain.color || "#6B7280" }}
          >
            {post.domain.icon === "Shield" && "🛡️"}
            {post.domain.icon === "Network" && "🌐"}
            {post.domain.icon === "Cloud" && "☁️"}
            {post.domain.icon === "Search" && "🔍"}
            {post.domain.icon === "FileCheck" && "📋"}
            {post.domain.icon === "Target" && "🎯"}
            {post.domain.icon === "AlertTriangle" && "⚠️"}
            {post.domain.icon === "Code" && "💻"}
          </span>
        </div>
      )}

      {/* Content */}
      <div className={`p-5 ${featured ? "md:w-1/2 md:p-6 md:flex md:flex-col md:justify-center" : ""}`}>
        <div className="flex items-center gap-2 mb-3">
          <DomainBadge name={post.domain.name} slug={post.domain.slug} color={post.domain.color || undefined} />
          {post.isSponsored && (
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Sponsored</span>
          )}
        </div>

        <h3 className={`font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug ${
          featured ? "text-xl mb-3" : "text-base mb-2"
        }`}>
          {post.title}
        </h3>

        <p className={`text-gray-500 line-clamp-2 mb-4 ${featured ? "text-sm" : "text-sm"}`}>
          {post.excerpt}
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
          {/* Author avatar */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ backgroundColor: post.domain.color || "#6B7280" }}
            >
              {post.author.name.charAt(0)}
            </div>
            <span className="font-medium text-gray-500">{post.author.name}</span>
          </div>

          <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />

          {post.readTimeMin && <span>{post.readTimeMin} min</span>}

          {post.publishedAt && (
            <>
              <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
              <span>{formatDate(post.publishedAt)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
