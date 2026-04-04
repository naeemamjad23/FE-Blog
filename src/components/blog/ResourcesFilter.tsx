"use client";

import { useState } from "react";
import { PostCard } from "@/components/blog/PostCard";
import { ICON_MAP, SUB_DOMAINS } from "@/lib/constants";
import Link from "next/link";
import type { Domain, Post } from "@/types";

interface ResourcesFilterProps {
  domains: Domain[];
  postsByDomain: Record<string, Post[]>;
}

export function ResourcesFilter({ domains, postsByDomain }: ResourcesFilterProps) {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const filteredDomains = activeDomain
    ? domains.filter((d) => d.slug === activeDomain)
    : domains;

  const activeDomainObj = domains.find((d) => d.slug === activeDomain);

  return (
    <>
      {/* Dropdown filter */}
      <div className="relative inline-block mb-8">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 shadow-sm transition-colors min-w-[240px]"
        >
          {activeDomainObj ? (
            <>
              <span>{ICON_MAP[activeDomainObj.icon || ""] || "📁"}</span>
              <span className="flex-1 text-left">{activeDomainObj.name}</span>
              <span className="text-xs text-gray-400">{(postsByDomain[activeDomainObj.slug] || []).length}</span>
            </>
          ) : (
            <>
              <span>📂</span>
              <span className="flex-1 text-left">All Domains</span>
            </>
          )}
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute top-full left-0 mt-1 w-80 rounded-xl bg-white shadow-xl border border-gray-100 py-1 z-50 animate-scale-in max-h-[70vh] overflow-y-auto">
              <button
                onClick={() => { setActiveDomain(null); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  activeDomain === null ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>📂</span>
                <span className="flex-1">All Domains</span>
              </button>
              <div className="border-t border-gray-100 my-1" />
              {domains.map((domain) => {
                const count = (postsByDomain[domain.slug] || []).length;
                const isActive = activeDomain === domain.slug;
                return (
                  <button
                    key={domain.slug}
                    onClick={() => { setActiveDomain(domain.slug); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      isActive ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0"
                      style={{ backgroundColor: `${domain.color}12`, color: domain.color || "#6B7280" }}
                    >
                      {ICON_MAP[domain.icon || ""] || "📁"}
                    </span>
                    <span className="flex-1">{domain.name}</span>
                    <span className="text-xs text-gray-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Domain sections */}
      <div className="space-y-12">
        {filteredDomains.map((domain) => {
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
                  {subs.map((sub) => {
                    const sdCounts = domain.subDomainCounts || {};
                    const count = sub.tags.reduce((sum, tag) => sum + (sdCounts[tag] || 0), 0);
                    return (
                      <Link
                        key={sub.slug}
                        href={`/${sub.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-100 hover:border-emerald-200 transition-colors"
                      >
                        <span>{sub.icon}</span>
                        {sub.label}
                        {count > 0 && <span className="text-gray-400 ml-0.5">{count}</span>}
                      </Link>
                    );
                  })}
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
    </>
  );
}
