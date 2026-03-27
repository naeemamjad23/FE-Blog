"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";
import type { Domain } from "@/types";

interface HeaderProps {
  domains?: Domain[];
}

export function Header({ domains = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [domainsOpen, setDomainsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">🥭 {SITE_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Domains dropdown */}
            <div className="relative">
              <button
                onClick={() => setDomainsOpen(!domainsOpen)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                Domains
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {domainsOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setDomainsOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-lg bg-white shadow-lg border border-gray-200 py-2 z-50">
                    {domains.map((domain) => (
                      <Link
                        key={domain.slug}
                        href={`/${domain.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setDomainsOpen(false)}
                      >
                        <span className="font-medium">{domain.name}</span>
                        {domain._count && (
                          <span className="ml-2 text-gray-400">{domain._count.posts} posts</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {NAV_LINKS.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link href="/newsletter" className="hidden sm:block">
              <Button size="sm">Subscribe</Button>
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {domains.map((domain) => (
              <Link
                key={domain.slug}
                href={`/${domain.slug}`}
                className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                onClick={() => setMobileOpen(false)}
              >
                {domain.name}
              </Link>
            ))}
            <hr className="my-2" />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-2 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
