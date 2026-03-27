import { fetchAPI } from "@/lib/api";
import { PostCard } from "@/components/blog/PostCard";
import { DomainCard } from "@/components/blog/DomainCard";
import { NewsletterSignup } from "@/components/lead-gen/NewsletterSignup";
import { AdSlot } from "@/components/monetization/AdSlot";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import type { Domain, Post, PaginatedResponse } from "@/types";

async function getDomains(): Promise<Domain[]> {
  try {
    const data = await fetchAPI<{ data: Domain[] } | Domain[]>("/api/domains");
    return Array.isArray(data) ? data : data.data;
  } catch { return []; }
}

async function getFeaturedPosts(): Promise<Post[]> {
  try {
    const data = await fetchAPI<{ data: PaginatedResponse<Post> } | PaginatedResponse<Post>>(
      "/api/posts?featured=true&limit=3"
    );
    const result = "data" in data && !("posts" in data) ? data.data : data;
    return (result as PaginatedResponse<Post>).posts || [];
  } catch { return []; }
}

async function getRecentPosts(): Promise<Post[]> {
  try {
    const data = await fetchAPI<{ data: PaginatedResponse<Post> } | PaginatedResponse<Post>>(
      "/api/posts?limit=6"
    );
    const result = "data" in data && !("posts" in data) ? data.data : data;
    return (result as PaginatedResponse<Post>).posts || [];
  } catch { return []; }
}

export default async function HomePage() {
  const [domains, featuredPosts, recentPosts] = await Promise.all([
    getDomains(),
    getFeaturedPosts(),
    getRecentPosts(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{SITE_NAME}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">{SITE_DESCRIPTION}</p>
          <div className="max-w-md mx-auto">
            <NewsletterSignup compact source="hero" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Domains Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Cybersecurity Domains</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {domains.map((domain) => (
              <DomainCard key={domain.id} domain={domain} />
            ))}
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        <AdSlot position="header" />

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <NewsletterSignup source="homepage" />
      </div>
    </div>
  );
}
