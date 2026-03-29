"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ICON_MAP, SUB_DOMAINS } from "@/lib/constants";
import type { Domain } from "@/types";

interface DomainCardProps {
  domain: Domain;
}

export function DomainCard({ domain }: DomainCardProps) {
  const color = domain.color || "#6B7280";
  const subs = SUB_DOMAINS[domain.slug];
  const [showSubs, setShowSubs] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleEnter() {
    if (!subs) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowSubs(true);
  }

  function handleLeave() {
    if (!subs) return;
    timeoutRef.current = setTimeout(() => setShowSubs(false), 150);
  }

  return (
    <div
      className={`relative ${showSubs ? "z-50" : "z-0"}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link href={`/${domain.slug}`} className="group block">
        <div className="relative rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 hover:-translate-y-1 hover:border-gray-200 overflow-hidden h-full">
          {/* Subtle gradient accent */}
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
            style={{ backgroundColor: color }}
          />

          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${color}10` }}
              >
                {ICON_MAP[domain.icon || ""] || "📁"}
              </div>
              {subs && (
                <span className="text-gray-300 group-hover:text-emerald-500 transition-colors mt-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-emerald-700 transition-colors">
              {domain.name}
            </h3>

            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
              {domain.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">
                {domain._count?.posts || 0} articles · {subs?.length || 0} sub-domains
              </span>
              <span className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Submenu popover */}
      {subs && showSubs && (
        <div className="absolute left-0 right-0 top-full z-50 pt-1 animate-fade-in">
          <div
            className="rounded-xl bg-white shadow-xl border border-gray-100 py-2 overflow-hidden"
            style={{ borderTop: `2px solid ${color}` }}
          >
            {subs.map((sub) => {
              const focusKey = sub.slug.split("focus=")[1] || "";
              const count = domain.subDomainCounts?.[focusKey] || 0;
              return (
              <Link
                key={sub.slug}
                href={`/${sub.slug}`}
                className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition-colors group/sub"
              >
                <span className="text-sm">{sub.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover/sub:text-emerald-700 transition-colors flex-1">
                  {sub.label}
                </span>
                {count > 0 && (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{count}</span>
                )}
                <svg className="w-3.5 h-3.5 text-gray-300 group-hover/sub:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
