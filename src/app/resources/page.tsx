import { fetchAPI } from "@/lib/api";
import { LeadMagnetCard } from "@/components/lead-gen/LeadMagnetCard";
import { ResourcesFilter } from "@/components/blog/ResourcesFilter";
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

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
      <p className="text-gray-600 mb-10">
        Explore articles across {domains.length} cybersecurity domains.
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

      {/* Explore Domains with Filters */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Explore Domains</h2>
        <ResourcesFilter domains={domains} postsByDomain={postsByDomain} />
      </section>
    </div>
  );
}
