import { fetchAPI } from "@/lib/api";
import { PostCard } from "@/components/blog/PostCard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { NewsletterSignup } from "@/components/lead-gen/NewsletterSignup";
import type { Metadata } from "next";
import type { Domain, Post, PaginatedResponse } from "@/types";

interface Props {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain: slug } = await params;
  try {
    const domain = await fetchAPI<{ data: Domain } | Domain>(`/api/domains/${slug}`);
    const d = "data" in domain ? domain.data : domain;
    return {
      title: d.name,
      description: d.description,
      openGraph: { title: d.name, description: d.description },
    };
  } catch {
    return { title: "Domain" };
  }
}

export default async function DomainPage({ params, searchParams }: Props) {
  const { domain: slug } = await params;
  const { page = "1" } = await searchParams;

  let domain: Domain | null = null;
  let posts: Post[] = [];
  let domains: Domain[] = [];
  let totalPages = 1;

  try {
    const [domainRes, postsRes, domainsRes] = await Promise.all([
      fetchAPI<{ data: Domain } | Domain>(`/api/domains/${slug}`),
      fetchAPI<{ data: PaginatedResponse<Post> } | PaginatedResponse<Post>>(`/api/posts/domain/${slug}?page=${page}`),
      fetchAPI<{ data: Domain[] } | Domain[]>("/api/domains"),
    ]);
    domain = "data" in domainRes && !("slug" in domainRes) ? (domainRes as { data: Domain }).data : domainRes as Domain;
    const postData = "data" in postsRes && !("posts" in postsRes) ? (postsRes as { data: PaginatedResponse<Post> }).data : postsRes as PaginatedResponse<Post>;
    posts = postData.posts || [];
    totalPages = postData.pagination?.totalPages || 1;
    domains = Array.isArray(domainsRes) ? domainsRes : (domainsRes as { data: Domain[] }).data;
  } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: domain?.name || slug }]} />

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          {domain && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{domain.name}</h1>
              <p className="text-gray-600">{domain.description}</p>
            </div>
          )}

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">No posts yet in this domain. Check back soon!</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => (
                <a
                  key={i}
                  href={`/${slug}?page=${i + 1}`}
                  className={`px-3 py-1 rounded text-sm ${
                    parseInt(page) === i + 1
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          )}

          <div className="mt-12">
            <NewsletterSignup source={`domain-${slug}`} />
          </div>
        </div>

        <div className="hidden lg:block w-72 shrink-0">
          <Sidebar domains={domains} currentDomain={slug} />
        </div>
      </div>
    </div>
  );
}
