import Link from "next/link";
import type { Domain } from "@/types";

interface DomainCardProps {
  domain: Domain;
}

const icons: Record<string, string> = {
  Shield: "🛡️", Network: "🌐", Cloud: "☁️", Search: "🔍",
  FileCheck: "📋", Target: "🎯", AlertTriangle: "⚠️", Code: "💻",
};

export function DomainCard({ domain }: DomainCardProps) {
  const color = domain.color || "#6B7280";

  return (
    <Link href={`/${domain.slug}`} className="group block">
      <div className="relative rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 hover:-translate-y-1 hover:border-gray-200 overflow-hidden h-full">
        {/* Subtle gradient accent */}
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          style={{ backgroundColor: color }}
        />

        <div className="relative">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-3 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${color}10` }}
          >
            {icons[domain.icon || ""] || "📁"}
          </div>

          <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-emerald-700 transition-colors">
            {domain.name}
          </h3>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
            {domain.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">
              {domain._count?.posts || 0} articles
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
  );
}
