"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { AnalyticsOverview } from "@/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    api.get("/api/analytics/overview")
      .then(({ data }) => setStats(data.data || data))
      .catch(() => {});
  }, []);

  const cards = stats
    ? [
        { label: "Published Posts", value: stats.publishedPosts },
        { label: "Draft Posts", value: stats.draftPosts },
        { label: "Total Views", value: stats.totalViews.toLocaleString() },
        { label: "Subscribers", value: stats.totalSubscribers },
        { label: "Comments", value: stats.totalComments },
        { label: "Pending Comments", value: stats.pendingComments },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="py-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="py-4 text-center">
                <div className="h-9 w-16 mx-auto bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-24 mx-auto bg-gray-200 animate-pulse rounded mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
