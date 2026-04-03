import Image from "next/image";
import { fetchAPI } from "@/lib/api";
import { PostContent } from "@/components/blog/PostContent";
import { PostMeta } from "@/components/blog/PostMeta";
import { SeriesNav } from "@/components/blog/SeriesNav";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import { InlineCta } from "@/components/lead-gen/InlineCta";
import { PremiumGate } from "@/components/monetization/PremiumGate";
import { SponsoredBadge } from "@/components/monetization/SponsoredBadge";
import { AdSlot } from "@/components/monetization/AdSlot";
import { SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import type { Post, Series } from "@/types";

interface Props {
  params: Promise<{ domain: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain, slug } = await params;
  try {
    const post = await fetchAPI<{ data: Post } | Post>(`/api/posts/slug/${slug}`);
    const p = "data" in post && !("slug" in post) ? (post as { data: Post }).data : post as Post;
    return {
      title: p.metaTitle || p.title,
      description: p.metaDescription || p.excerpt,
      openGraph: {
        title: p.metaTitle || p.title,
        description: p.metaDescription || p.excerpt,
        type: "article",
        images: p.ogImage || p.coverImage ? [{ url: p.ogImage || p.coverImage! }] : undefined,
        url: `${SITE_URL}/${domain}/${slug}`,
      },
      alternates: { canonical: p.canonicalUrl || `${SITE_URL}/${domain}/${slug}` },
    };
  } catch {
    return { title: "Post" };
  }
}

export default async function PostPage({ params }: Props) {
  const { domain: domainSlug, slug } = await params;

  let post: Post | null = null;
  let relatedPosts: Post[] = [];
  let seriesData: Series | null = null;

  try {
    const postRes = await fetchAPI<{ data: Post } | Post>(`/api/posts/slug/${slug}`);
    post = "data" in postRes && !("slug" in postRes) ? (postRes as { data: Post }).data : postRes as Post;

    if (post) {
      const relatedRes = await fetchAPI<{ data: Post[] } | Post[]>(`/api/posts/${post.id}/related`);
      relatedPosts = Array.isArray(relatedRes) ? relatedRes : (relatedRes as { data: Post[] }).data;

      if (post.seriesId && post.series) {
        const seriesRes = await fetchAPI<{ data: Series } | Series>(`/api/series/${post.series.slug}`);
        seriesData = "data" in seriesRes && !("slug" in seriesRes) ? (seriesRes as { data: Series }).data : seriesRes as Series;
      }
    }
  } catch {}

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <ArticleJsonLd post={post} />
      <Breadcrumbs
        items={[
          { label: post.domain.name, href: `/${domainSlug}` },
          { label: post.title },
        ]}
      />

      {/* Cover image */}
      {post.coverImage && (
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg shadow-gray-200/50">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={675}
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="w-full aspect-[16/9] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      )}

      {/* Header */}
      <header className="mb-10">
        {post.isSponsored && (
          <div className="mb-4">
            <SponsoredBadge sponsorName={post.sponsorName || undefined} sponsorUrl={post.sponsorUrl || undefined} />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-4 leading-tight tracking-tight">{post.title}</h1>
        <PostMeta post={post} />
      </header>

      {/* Content */}
      <PremiumGate isPremium={post.isPremium}>
        <PostContent content={post.content} />
      </PremiumGate>

      {/* Inline CTA */}
      <InlineCta />

      <AdSlot position="in-content" className="my-8" />

      {/* Series navigation */}
      {seriesData && seriesData.posts && (
        <SeriesNav series={seriesData} currentPostId={post.id} posts={seriesData.posts} />
      )}

      {/* Related Posts */}
      <RelatedPosts posts={relatedPosts} />
    </div>
  );
}
