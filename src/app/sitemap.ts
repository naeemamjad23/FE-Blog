import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const API_URL = process.env.API_URL || "http://localhost:4001";

  try {
    const [domainsRes, postsRes, seriesRes] = await Promise.all([
      fetch(`${API_URL}/api/domains`).then((r) => r.json()),
      fetch(`${API_URL}/api/posts?limit=1000`).then((r) => r.json()),
      fetch(`${API_URL}/api/series`).then((r) => r.json()),
    ]);

    const domains = domainsRes.data || domainsRes;
    const posts = (postsRes.data || postsRes).posts || [];
    const series = seriesRes.data || seriesRes;

    const entries: MetadataRoute.Sitemap = [
      { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ];

    for (const d of domains) {
      entries.push({ url: `${SITE_URL}/${d.slug}`, lastModified: d.updatedAt, changeFrequency: "weekly", priority: 0.8 });
    }
    for (const p of posts) {
      entries.push({ url: `${SITE_URL}/${p.domain?.slug || "blog"}/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly", priority: 0.7 });
    }
    for (const s of series) {
      entries.push({ url: `${SITE_URL}/series/${s.slug}`, lastModified: s.updatedAt, changeFrequency: "weekly", priority: 0.6 });
    }

    return entries;
  } catch {
    return [{ url: SITE_URL, lastModified: new Date() }];
  }
}
