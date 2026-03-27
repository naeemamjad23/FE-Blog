import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/monetization/AdSlot";
import type { Domain, Post } from "@/types";

interface SidebarProps {
  domains?: Domain[];
  popularPosts?: Post[];
  currentDomain?: string;
}

export function Sidebar({ domains = [], popularPosts = [], currentDomain }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Domain Navigation */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Domains</h3>
        <nav className="space-y-1">
          {domains.map((domain) => (
            <Link
              key={domain.slug}
              href={`/${domain.slug}`}
              className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                currentDomain === domain.slug
                  ? "bg-emerald-50 text-emerald-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{domain.name}</span>
              <Badge color={domain.color || "#6B7280"}>{domain._count?.posts || 0}</Badge>
            </Link>
          ))}
        </nav>
      </div>

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Posts</h3>
          <div className="space-y-3">
            {popularPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${post.domain.slug}/${post.slug}`}
                className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <p className="font-medium line-clamp-2">{post.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{post.viewCount} views</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ad Slot */}
      <AdSlot position="sidebar" />
    </aside>
  );
}
