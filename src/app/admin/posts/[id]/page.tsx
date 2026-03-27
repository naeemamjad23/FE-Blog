"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { slugify, estimateReadTime } from "@/lib/utils";
import type { Domain, Author } from "@/types";

export default function PostEditorPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [domains, setDomains] = useState<Domain[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    domainId: "",
    authorId: "",
    coverImage: "",
    published: false,
    featured: false,
    isPremium: false,
    isSponsored: false,
    sponsorName: "",
    sponsorUrl: "",
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    ogImage: "",
    seriesId: "",
    seriesOrder: 0,
    readTimeMin: 0,
  });

  useEffect(() => {
    Promise.all([
      api.get("/api/domains").then(({ data }) => setDomains(data.data || data)),
      api.get("/api/authors").then(({ data }) => setAuthors(data.data || data)),
    ]);

    if (!isNew) {
      api.get(`/api/posts/admin?limit=100`).then(({ data }) => {
        const result = data.data || data;
        const post = result.posts?.find((p: any) => p.id === params.id);
        if (post) {
          setForm({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            domainId: post.domainId,
            authorId: post.authorId,
            coverImage: post.coverImage || "",
            published: post.published,
            featured: post.featured,
            isPremium: post.isPremium,
            isSponsored: post.isSponsored,
            sponsorName: post.sponsorName || "",
            sponsorUrl: post.sponsorUrl || "",
            metaTitle: post.metaTitle || "",
            metaDescription: post.metaDescription || "",
            canonicalUrl: post.canonicalUrl || "",
            ogImage: post.ogImage || "",
            seriesId: post.seriesId || "",
            seriesOrder: post.seriesOrder || 0,
            readTimeMin: post.readTimeMin || 0,
          });
        }
      });
    }
  }, [isNew, params.id]);

  function updateField(field: string, value: any) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && (isNew || !prev.slug)) {
        updated.slug = slugify(value);
      }
      if (field === "content") {
        updated.readTimeMin = estimateReadTime(value);
      }
      return updated;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        seriesOrder: form.seriesOrder || undefined,
        seriesId: form.seriesId || undefined,
        publishedAt: form.published ? new Date().toISOString() : undefined,
      };

      if (isNew) {
        await api.post("/api/posts", payload);
      } else {
        await api.patch(`/api/posts/${params.id}`, payload);
      }
      router.push("/admin/posts");
    } catch (err: any) {
      alert("Error saving post: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? "New Post" : "Edit Post"}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/posts")}>Cancel</Button>
          <Button onClick={() => { updateField("published", false); handleSave(); }} variant="secondary" disabled={saving}>
            Save Draft
          </Button>
          <Button onClick={() => { updateField("published", true); handleSave(); }} disabled={saving}>
            {saving ? "Saving..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Input label="Title" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
        <Input label="Slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={form.domainId}
              onChange={(e) => updateField("domainId", e.target.value)}
            >
              <option value="">Select domain</option>
              {domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={form.authorId}
              onChange={(e) => updateField("authorId", e.target.value)}
            >
              <option value="">Select author</option>
              {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm h-20"
            value={form.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content (HTML) — {form.readTimeMin} min read
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono h-96"
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
          />
        </div>

        <Input label="Cover Image URL" value={form.coverImage} onChange={(e) => updateField("coverImage", e.target.value)} />

        {/* Flags */}
        <div className="flex flex-wrap gap-4">
          {(["featured", "isPremium", "isSponsored"] as const).map((flag) => (
            <label key={flag} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form[flag]}
                onChange={(e) => updateField(flag, e.target.checked)}
                className="rounded"
              />
              {flag === "featured" ? "Featured" : flag === "isPremium" ? "Premium" : "Sponsored"}
            </label>
          ))}
        </div>

        {/* SEO Section */}
        <details className="border border-gray-200 rounded-lg p-4">
          <summary className="font-medium text-sm text-gray-700 cursor-pointer">SEO Settings</summary>
          <div className="space-y-3 mt-3">
            <Input label="Meta Title" value={form.metaTitle} onChange={(e) => updateField("metaTitle", e.target.value)} />
            <Input label="Meta Description" value={form.metaDescription} onChange={(e) => updateField("metaDescription", e.target.value)} />
            <Input label="Canonical URL" value={form.canonicalUrl} onChange={(e) => updateField("canonicalUrl", e.target.value)} />
            <Input label="OG Image URL" value={form.ogImage} onChange={(e) => updateField("ogImage", e.target.value)} />
          </div>
        </details>

        {form.isSponsored && (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sponsor Name" value={form.sponsorName} onChange={(e) => updateField("sponsorName", e.target.value)} />
            <Input label="Sponsor URL" value={form.sponsorUrl} onChange={(e) => updateField("sponsorUrl", e.target.value)} />
          </div>
        )}
      </div>
    </div>
  );
}
