import { fetchAPI } from "@/lib/api";
import { LeadMagnetCard } from "@/components/lead-gen/LeadMagnetCard";
import { PostCard } from "@/components/blog/PostCard";
import { ICON_MAP, SUB_DOMAINS } from "@/lib/constants";
import Link from "next/link";
import type { Metadata } from "next";
import type { LeadMagnet, Domain, Post } from "@/types";

export const metadata: Metadata = {
  title: "Resources",
  description: "Free cybersecurity checklists, guides, and downloadable resources.",
};

export default async function ResourcesPage() {
  let resources: LeadMagnet[] = [];
  let domains: Domain[] = [];
  let postsByDomain: Record<string, Post[]> = {};

  try {
    const [resData, domData] = await Promise.all([
      fetchAPI<{ data: LeadMagnet[] } | LeadMagnet[]>("/api/lead-magnets"),
      fetchAPI<{ data: Domain[] } | Domain[]>("/api/domains"),
    ]);
    resources = Array.isArray(resData) ? resData : resData.data;
    domains = Array.isArray(domData) ? domData : domData.data;

    // Fetch posts for each domain in parallel
    const postResults = await Promise.all(
      domains.map((d) =>
        fetchAPI<{ data: { posts: Post[] } } | { posts: Post[] }>(`/api/posts/domain/${d.slug}?limit=50`)
          .then((res) => {
            const data = "data" in res && !("posts" in res) ? (res as { data: { posts: Post[] } }).data : res as { posts: Post[] };
            return { slug: d.slug, posts: data.posts || [] };
          })
          .catch(() => ({ slug: d.slug, posts: [] as Post[] }))
      )
    );
    for (const r of postResults) {
      postsByDomain[r.slug] = r.posts;
    }
  } catch {}

  const totalPosts = Object.values(postsByDomain).reduce((sum, posts) => sum + posts.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
      <p className="text-gray-600 mb-10">
        Explore {totalPosts} articles across {domains.length} cybersecurity domains.
      </p>

      {/* Free Downloads */}
      {resources.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Free Downloads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <LeadMagnetCard key={resource.id} leadMagnet={resource} />
            ))}
          </div>
        </section>
      )}

      {/* Explore Domains */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-8">Explore Domains</h2>
        <div className="space-y-12">
          {domains.map((domain) => {
            const posts = postsByDomain[domain.slug] || [];
            const subs = SUB_DOMAINS[domain.slug];
            const color = domain.color || "#6B7280";

            return (
              <div key={domain.id}>
                {/* Domain Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: `${color}12`, color }}
                  >
                    {ICON_MAP[domain.icon || ""] || "📁"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/${domain.slug}`} className="text-lg font-bold text-gray-900 hover:text-emerald-700 transition-colors">
                      {domain.name}
                    </Link>
                    <p className="text-sm text-gray-500">{domain.description}</p>
                  </div>
                  <Link
                    href={`/${domain.slug}`}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 shrink-0 hidden sm:block"
                  >
                    View all →
                  </Link>
                </div>

                {/* Sub-domains */}
                {subs && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {subs.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/${sub.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-100 hover:border-emerald-200 transition-colors"
                      >
                        <span>{sub.icon}</span>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Posts */}
                {posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 py-4 border border-dashed border-gray-200 rounded-xl text-center">
                    No articles yet — content coming soon.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
