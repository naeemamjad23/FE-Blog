import { fetchAPI } from "@/lib/api";
import { PostCard } from "@/components/blog/PostCard";
import { DomainCard } from "@/components/blog/DomainCard";
import { NewsletterSignup } from "@/components/lead-gen/NewsletterSignup";
import { SITE_DESCRIPTION } from "@/lib/constants";
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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtMzBWNkgyVjRoMzR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-emerald-300 mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Cybersecurity Knowledge Hub
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1] animate-fade-in-up">
              Level Up Your{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Security Skills
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              {SITE_DESCRIPTION}
            </p>

            <div className="max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <NewsletterSignup compact source="hero" />
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {["Free content", "Weekly digest", "No spam"].map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 64" fill="none" className="w-full">
            <path d="M0 64L1440 64L1440 0C1440 0 1080 48 720 48C360 48 0 0 0 0L0 64Z" fill="#fafafa" />
          </svg>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Domains Grid */}
        <section className="py-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Explore Domains</h2>
            <p className="text-gray-500 mt-1">Dive into 9 core areas of cybersecurity</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
            {domains.map((domain) => (
              <DomainCard key={domain.id} domain={domain} />
            ))}
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16 border-t border-gray-100">
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium mb-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Editor&apos;s Picks</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section className="py-16 border-t border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Latest Articles</h2>
              <p className="text-gray-500 mt-1">Fresh insights from our security team</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="py-16 border-t border-gray-100">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">Stay Ahead of Threats</h2>
              <p className="text-slate-300 max-w-lg mx-auto mb-8">
                Join security professionals getting weekly insights on AppSec, Cloud Security, Threat Intel, and more.
              </p>
              <div className="max-w-md mx-auto">
                <NewsletterSignup compact source="homepage-cta" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
