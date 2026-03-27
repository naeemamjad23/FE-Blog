import { fetchAPI } from "@/lib/api";
import { PostCard } from "@/components/blog/PostCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import type { Metadata } from "next";
import type { Author } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await fetchAPI<{ data: Author } | Author>(`/api/authors/${slug}`);
    const a = "data" in data && !("slug" in data) ? (data as { data: Author }).data : data as Author;
    return { title: a.name, description: a.bio || `Posts by ${a.name}` };
  } catch {
    return { title: "Author" };
  }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;

  let author: (Author & { posts?: any[] }) | null = null;
  try {
    const data = await fetchAPI<{ data: Author } | Author>(`/api/authors/${slug}`);
    author = ("data" in data && !("slug" in data) ? (data as { data: Author }).data : data) as Author & { posts?: any[] };
  } catch {}

  if (!author) {
    return <div className="text-center py-20 text-gray-500">Author not found</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: author.name }]} />

      <div className="flex items-start gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl shrink-0">
          {author.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{author.name}</h1>
          {author.bio && <p className="text-gray-600 mt-1">{author.bio}</p>}
          <div className="flex gap-3 mt-2 text-sm">
            {author.twitter && (
              <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">Twitter</a>
            )}
            {author.linkedin && (
              <a href={`https://linkedin.com/in/${author.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">LinkedIn</a>
            )}
            {author.github && (
              <a href={`https://github.com/${author.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">GitHub</a>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">Posts by {author.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {author.posts?.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {(!author.posts || author.posts.length === 0) && (
        <p className="text-gray-500 text-center py-12">No posts yet.</p>
      )}
    </div>
  );
}
