import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Domain } from "@/types";

interface DomainCardProps {
  domain: Domain;
}

export function DomainCard({ domain }: DomainCardProps) {
  return (
    <Link href={`/${domain.slug}`}>
      <Card hover className="h-full">
        <CardContent className="flex flex-col items-center text-center py-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-3"
            style={{ backgroundColor: `${domain.color}15`, color: domain.color || "#6B7280" }}
          >
            {domain.icon === "Shield" && "🛡️"}
            {domain.icon === "Network" && "🌐"}
            {domain.icon === "Cloud" && "☁️"}
            {domain.icon === "Search" && "🔍"}
            {domain.icon === "FileCheck" && "📋"}
            {domain.icon === "Target" && "🎯"}
            {domain.icon === "AlertTriangle" && "⚠️"}
            {domain.icon === "Code" && "💻"}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{domain.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{domain.description}</p>
          {domain._count && (
            <p className="text-xs text-gray-400 mt-2">{domain._count.posts} posts</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
