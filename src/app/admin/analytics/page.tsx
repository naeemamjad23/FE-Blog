"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import type {
  AnalyticsOverview,
  TimeSeriesPoint,
  DomainViews,
  SourceBreakdown,
  TopPost,
  AffiliateStats,
} from "@/types";

type Period = "7" | "30" | "90";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30");
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [subscriberTrend, setSubscriberTrend] = useState<TimeSeriesPoint[]>([]);
  const [postTrend, setPostTrend] = useState<TimeSeriesPoint[]>([]);
  const [commentTrend, setCommentTrend] = useState<TimeSeriesPoint[]>([]);
  const [domainViews, setDomainViews] = useState<DomainViews[]>([]);
  const [sources, setSources] = useState<SourceBreakdown[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [affiliateStats, setAffiliateStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/analytics/overview"),
      api.get(`/api/analytics/subscribers-by-day?days=${period}`),
      api.get(`/api/analytics/posts-by-day?days=${period}`),
      api.get(`/api/analytics/comments-by-day?days=${period}`),
      api.get("/api/analytics/views-by-domain"),
      api.get("/api/analytics/subscribers-by-source"),
      api.get("/api/analytics/top-posts?limit=10"),
      api.get("/api/analytics/affiliate-stats"),
    ])
      .then(([ov, sub, post, cmt, dom, src, top, aff]) => {
        setOverview(ov.data.data || ov.data);
        setSubscriberTrend(sub.data.data || sub.data);
        setPostTrend(post.data.data || post.data);
        setCommentTrend(cmt.data.data || cmt.data);
        setDomainViews(dom.data.data || dom.data);
        setSources(src.data.data || src.data);
        setTopPosts(top.data.data || top.data);
        setAffiliateStats(aff.data.data || aff.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* KPI Cards */}
      {overview && <KPICards overview={overview} />}

      {/* Row 1: Subscriber Trend + Subscriber Sources */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SparklineCard
            title="Subscriber Growth"
            data={subscriberTrend}
            color="#059669"
            period={period}
          />
        </div>
        <SourcesCard sources={sources} />
      </div>

      {/* Row 2: Posts Published + Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SparklineCard
          title="Posts Published"
          data={postTrend}
          color="#3b82f6"
          period={period}
        />
        <SparklineCard
          title="Comments"
          data={commentTrend}
          color="#8b5cf6"
          period={period}
        />
      </div>

      {/* Row 3: Views by Domain + Top Posts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DomainViewsCard domains={domainViews} />
        <TopPostsCard posts={topPosts} />
      </div>

      {/* Row 4: Affiliate Performance */}
      {affiliateStats && affiliateStats.totals.totalLinks > 0 && (
        <AffiliateCard stats={affiliateStats} />
      )}
    </div>
  );
}

/* ─── Period Selector ─── */
function PeriodSelector({ value, onChange }: { value: Period; onChange: (v: Period) => void }) {
  const options: { label: string; value: Period }[] = [
    { label: "7 days", value: "7" },
    { label: "30 days", value: "30" },
    { label: "90 days", value: "90" },
  ];
  return (
    <div className="flex bg-gray-100 rounded-lg p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            value === opt.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── KPI Cards ─── */
function KPICards({ overview }: { overview: AnalyticsOverview }) {
  const kpis = [
    { label: "Total Views", value: overview.totalViews.toLocaleString(), icon: "👁", color: "emerald" },
    { label: "Subscribers", value: overview.totalSubscribers.toLocaleString(), icon: "📧", color: "blue" },
    { label: "Published", value: overview.publishedPosts, icon: "📄", color: "violet" },
    { label: "Comments", value: overview.totalComments, icon: "💬", color: "amber" },
    { label: "Drafts", value: overview.draftPosts, icon: "📝", color: "gray" },
    { label: "Pending Review", value: overview.pendingComments, icon: "⏳", color: "rose" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardContent className="py-4 px-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{kpi.icon}</span>
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─── Sparkline Bar Chart ─── */
function SparklineCard({
  title,
  data,
  color,
  period,
}: {
  title: string;
  data: TimeSeriesPoint[];
  color: string;
  period: Period;
}) {
  const total = useMemo(() => data.reduce((s, d) => s + d.count, 0), [data]);
  const max = useMemo(() => Math.max(...data.map((d) => d.count), 1), [data]);

  // For 90-day view, group by week
  const displayData = useMemo(() => {
    if (period !== "90") return data;
    const weeks: TimeSeriesPoint[] = [];
    for (let i = 0; i < data.length; i += 7) {
      const chunk = data.slice(i, i + 7);
      weeks.push({
        date: chunk[0].date,
        count: chunk.reduce((s, d) => s + d.count, 0),
      });
    }
    return weeks;
  }, [data, period]);

  const displayMax = Math.max(...displayData.map((d) => d.count), 1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <span className="text-lg font-bold" style={{ color }}>{total}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-end gap-[2px] h-28">
          {displayData.map((d, i) => (
            <div key={d.date} className="flex-1 flex flex-col items-center group relative">
              <div
                className="w-full rounded-sm transition-all duration-200 group-hover:opacity-80 min-h-[2px]"
                style={{
                  height: `${(d.count / displayMax) * 100}%`,
                  backgroundColor: color,
                  opacity: d.count === 0 ? 0.15 : 1,
                }}
              />
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {formatShortDate(d.date)}: {d.count}
              </div>
            </div>
          ))}
        </div>
        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-gray-400">{displayData.length > 0 ? formatShortDate(displayData[0].date) : ""}</span>
          <span className="text-[10px] text-gray-400">{displayData.length > 0 ? formatShortDate(displayData[displayData.length - 1].date) : ""}</span>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Subscriber Sources ─── */
function SourcesCard({ sources }: { sources: SourceBreakdown[] }) {
  const total = sources.reduce((s, src) => s + src.count, 0) || 1;
  const colors = ["#059669", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#6b7280", "#ec4899", "#14b8a6"];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-gray-900">Subscriber Sources</h3>
      </CardHeader>
      <CardContent>
        {/* Stacked bar */}
        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          {sources.map((src, i) => (
            <div
              key={src.source}
              style={{ width: `${(src.count / total) * 100}%`, backgroundColor: colors[i % colors.length] }}
              className="transition-all duration-300"
            />
          ))}
        </div>
        {/* Legend */}
        <div className="space-y-2">
          {sources.slice(0, 6).map((src, i) => (
            <div key={src.source} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                <span className="text-gray-600 capitalize">{src.source.replace(/-/g, " ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{src.count}</span>
                <span className="text-xs text-gray-400 w-10 text-right">{Math.round((src.count / total) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Domain Views (Horizontal Bars) ─── */
function DomainViewsCard({ domains }: { domains: DomainViews[] }) {
  const max = Math.max(...domains.map((d) => d.views), 1);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-gray-900">Views by Domain</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {domains.map((d) => (
            <div key={d.slug}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">{d.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{d.postCount} posts</span>
                  <span className="text-sm font-semibold text-gray-900">{d.views.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(d.views / max) * 100}%`,
                    backgroundColor: d.color || "#6b7280",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Top Posts Table ─── */
function TopPostsCard({ posts }: { posts: TopPost[] }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-gray-900">Top Posts by Views</h3>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left font-medium text-gray-400 text-xs uppercase tracking-wider px-6 pb-2">#</th>
                <th className="text-left font-medium text-gray-400 text-xs uppercase tracking-wider px-2 pb-2">Title</th>
                <th className="text-left font-medium text-gray-400 text-xs uppercase tracking-wider px-2 pb-2">Domain</th>
                <th className="text-right font-medium text-gray-400 text-xs uppercase tracking-wider px-6 pb-2">Views</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-2.5 text-gray-400 font-mono text-xs">{i + 1}</td>
                  <td className="px-2 py-2.5">
                    <span className="text-gray-800 font-medium line-clamp-1">{post.title}</span>
                  </td>
                  <td className="px-2 py-2.5">
                    <span
                      className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: post.domain.color || "#6b7280" }}
                    >
                      {post.domain.name}
                    </span>
                  </td>
                  <td className="px-6 py-2.5 text-right font-semibold text-gray-900 font-mono text-xs">
                    {post.viewCount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400 text-sm">No published posts yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Affiliate Performance ─── */
function AffiliateCard({ stats }: { stats: AffiliateStats }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Affiliate Performance</h3>
          <div className="flex gap-4 text-xs">
            <span className="text-gray-500">Links: <strong className="text-gray-900">{stats.totals.totalLinks}</strong></span>
            <span className="text-gray-500">Clicks: <strong className="text-emerald-600">{stats.totals.totalClicks}</strong></span>
            <span className="text-gray-500">Conversions: <strong className="text-blue-600">{stats.totals.totalConversions}</strong></span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left font-medium text-gray-400 text-xs uppercase tracking-wider px-6 pb-2">Product</th>
              <th className="text-left font-medium text-gray-400 text-xs uppercase tracking-wider px-2 pb-2">Network</th>
              <th className="text-left font-medium text-gray-400 text-xs uppercase tracking-wider px-2 pb-2">Post</th>
              <th className="text-right font-medium text-gray-400 text-xs uppercase tracking-wider px-2 pb-2">Clicks</th>
              <th className="text-right font-medium text-gray-400 text-xs uppercase tracking-wider px-6 pb-2">Conv.</th>
            </tr>
          </thead>
          <tbody>
            {stats.links.map((link) => (
              <tr key={link.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-2.5 font-medium text-gray-800">{link.productName}</td>
                <td className="px-2 py-2.5 text-gray-500">{link.network || "—"}</td>
                <td className="px-2 py-2.5 text-gray-500 line-clamp-1">{link.post?.title || "—"}</td>
                <td className="px-2 py-2.5 text-right font-mono text-xs font-semibold text-emerald-600">{link.clickCount}</td>
                <td className="px-6 py-2.5 text-right font-mono text-xs font-semibold text-blue-600">{link.conversionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

/* ─── Loading Skeleton ─── */
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="py-4 px-4">
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-3" />
              <div className="h-7 w-12 bg-gray-200 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2"><CardContent className="py-20"><div className="h-28 bg-gray-100 animate-pulse rounded" /></CardContent></Card>
        <Card><CardContent className="py-20"><div className="h-28 bg-gray-100 animate-pulse rounded" /></CardContent></Card>
      </div>
    </div>
  );
}

/* ─── Helpers ─── */
function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
