"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE_NAME, NAV_LINKS, ICON_MAP, SUB_DOMAINS } from "@/lib/constants";
import type { Domain } from "@/types";

interface HeaderProps {
  domains?: Domain[];
}

export function Header({ domains = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [domainsOpen, setDomainsOpen] = useState(false);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:shadow-md transition-shadow">
              S
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block tracking-tight">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Domains dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDomainsOpen(true)}
              onMouseLeave={() => setDomainsOpen(false)}
            >
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                Domains
                <svg className={`w-3.5 h-3.5 transition-transform ${domainsOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {domainsOpen && (
                  <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-72 rounded-xl bg-white shadow-xl border border-gray-100 py-2 animate-scale-in">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cybersecurity Domains</p>
                    </div>
                    {domains.map((domain) => (
                      <div
                        key={domain.slug}
                        className="relative"
                        onMouseEnter={() => setHoveredDomain(domain.slug)}
                        onMouseLeave={() => setHoveredDomain(null)}
                      >
                        <Link
                          href={`/${domain.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg hover:bg-gray-50 transition-colors group/item"
                          onClick={() => setDomainsOpen(false)}
                        >
                          <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                            style={{ backgroundColor: `${domain.color}12`, color: domain.color || "#6B7280" }}
                          >
                            {ICON_MAP[domain.icon || ""] || "📁"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 group-hover/item:text-emerald-700 transition-colors">{domain.name}</p>
                            <p className="text-xs text-gray-400 truncate">{domain._count?.posts || 0} articles</p>
                          </div>
                          {SUB_DOMAINS[domain.slug] && (
                            <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </Link>
                        {/* Cascading submenu */}
                        {SUB_DOMAINS[domain.slug] && hoveredDomain === domain.slug && (
                          <div className="absolute left-full top-0 ml-1 w-56 rounded-xl bg-white shadow-xl border border-gray-100 py-2 z-50 animate-scale-in">
                            <div className="px-3 py-1.5 mb-1">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{domain.name}</p>
                            </div>
                            {SUB_DOMAINS[domain.slug].map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/${sub.slug}`}
                                className="flex items-center gap-2.5 px-3 py-2 mx-1 rounded-lg hover:bg-gray-50 transition-colors group/sub"
                                onClick={() => setDomainsOpen(false)}
                              >
                                <span className="text-sm">{sub.icon}</span>
                                <span className="text-sm font-medium text-gray-700 group-hover/sub:text-emerald-700 transition-colors">{sub.label}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  </div>
              )}
            </div>

            {NAV_LINKS.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search link */}
            <Link
              href="/search"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <Link href="/newsletter" className="hidden sm:block">
              <Button size="sm">
                Subscribe
                <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>

            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 animate-fade-in">
            <div className="space-y-0.5 mb-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Domains</p>
              <div className="grid grid-cols-2 gap-1">
                {domains.map((domain) => (
                  <Link
                    key={domain.slug}
                    href={`/${domain.slug}`}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    {domain.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
