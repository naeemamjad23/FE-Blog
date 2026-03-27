import Link from "next/link";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import type { Series } from "@/types";

export const metadata: Metadata = { title: "Series" };

export default async function SeriesListPage() {
  let seriesList: Series[] = [];
  try {
    const data = await fetchAPI<{ data: Series[] } | Series[]>("/api/series");
    seriesList = Array.isArray(data) ? data : data.data;
  } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Series</h1>
      <p className="text-gray-600 mb-8">Structured learning paths from beginner to advanced across cybersecurity domains.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seriesList.map((series) => (
          <Link key={series.id} href={`/series/${series.slug}`}>
            <Card hover className="h-full">
              <CardContent className="py-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge color={series.domain?.color || "#6B7280"}>{series.domain?.name}</Badge>
                  <Badge className="bg-gray-100 text-gray-600">{series.difficulty}</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{series.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{series.description}</p>
                <p className="text-xs text-gray-400 mt-2">{series._count?.posts || 0} posts</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {seriesList.length === 0 && (
        <p className="text-gray-500 text-center py-12">No series yet. Check back soon!</p>
      )}
    </div>
  );
}
