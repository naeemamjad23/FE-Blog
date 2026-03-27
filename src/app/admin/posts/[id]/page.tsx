"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { slugify, estimateReadTime } from "@/lib/utils";
import type { Domain, Author, Series } from "@/types";

export default function PostEditorPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [domains, setDomains] = useState<Domain[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [coverInfo, setCoverInfo] = useState<{ filename: string; size: number } | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [compressResult, setCompressResult] = useState<string | null>(null);
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
      api.get("/api/series").then(({ data }) => setSeriesList(data.data || data)),
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

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/api/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = data.data || data;
      updateField("coverImage", result.url);
      setCoverInfo({ filename: result.filename, size: result.size });
    } catch {
      alert("Upload failed. Try again or paste a URL instead.");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  }

  async function handleCoverDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/api/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = data.data || data;
      updateField("coverImage", result.url);
      setCoverInfo({ filename: result.filename, size: result.size });
    } catch {
      alert("Upload failed. Try again or paste a URL instead.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleCompress() {
    if (!coverInfo) return;
    setCompressing(true);
    setCompressResult(null);
    try {
      const { data } = await api.post(`/api/media/${coverInfo.filename}/compress`);
      const result = data.data || data;
      setCoverInfo({ filename: result.filename, size: result.compressedSize });
      setCompressResult(`Compressed: ${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)} (${result.savedPercent}% saved)`);
    } catch (err: any) {
      setCompressResult(err.response?.data?.message || "Compression failed");
    } finally {
      setCompressing(false);
    }
  }

  async function handleConvertWebp() {
    if (!coverInfo) return;
    setCompressing(true);
    setCompressResult(null);
    try {
      const { data } = await api.post(`/api/media/${coverInfo.filename}/webp`);
      const result = data.data || data;
      updateField("coverImage", result.url);
      setCoverInfo({ filename: result.filename, size: result.convertedSize });
      setCompressResult(`Converted to WebP: ${formatBytes(result.originalSize)} → ${formatBytes(result.convertedSize)} (${result.savedPercent}% saved)`);
    } catch (err: any) {
      setCompressResult(err.response?.data?.message || "Conversion failed");
    } finally {
      setCompressing(false);
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    try {
      const published = publish ?? form.published;
      const payload = {
        ...form,
        published,
        seriesOrder: form.seriesOrder || undefined,
        seriesId: form.seriesId || undefined,
        publishedAt: published ? new Date().toISOString() : undefined,
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
          <Button onClick={() => handleSave(false)} variant="secondary" disabled={saving}>
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
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

        {/* Cover Image - Drag & Drop / Click Upload / URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>

          {form.coverImage ? (
            /* Preview with replace/remove + drag-to-swap */
            <div
              className={`relative rounded-xl overflow-hidden border-2 group transition-colors ${
                dragging ? "border-emerald-400" : "border-gray-200"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleCoverDrop}
            >
              <img
                src={form.coverImage}
                alt="Cover preview"
                className="w-full h-48 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
              />

              {/* Drag overlay */}
              {dragging && (
                <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <div className="bg-white rounded-xl px-5 py-3 shadow-lg text-center">
                    <svg className="w-6 h-6 text-emerald-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">Drop to swap image</p>
                  </div>
                </div>
              )}

              {/* Hover controls */}
              {!dragging && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
                    Replace
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                  <button
                    type="button"
                    onClick={() => { updateField("coverImage", ""); setCoverInfo(null); }}
                    className="px-3 py-1.5 bg-red-500 rounded-lg text-sm font-medium text-white hover:bg-red-600 transition-colors shadow-sm"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Upload spinner */}
              {uploadingCover && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-20">
                  <span className="w-7 h-7 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                  <span className="text-xs text-gray-500 mt-2">Uploading...</span>
                </div>
              )}

              {/* File info bar with compress/convert options */}
              {coverInfo && !dragging && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-white/70 truncate">{coverInfo.filename}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-white/50">{formatBytes(coverInfo.size)}</span>
                      {compressing ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {coverInfo.filename.match(/\.png$/i) && (
                            <button
                              type="button"
                              onClick={handleCompress}
                              className="px-2 py-0.5 text-[10px] font-medium bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                              title="Compress PNG with pngquant"
                            >
                              Compress
                            </button>
                          )}
                          {coverInfo.filename.match(/\.(png|jpe?g|tiff)$/i) && (
                            <button
                              type="button"
                              onClick={handleConvertWebp}
                              className="px-2 py-0.5 text-[10px] font-medium bg-emerald-500/80 hover:bg-emerald-500 text-white rounded transition-colors"
                              title="Convert to WebP (smallest size)"
                            >
                              WebP
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {compressResult && (
                    <p className="text-[10px] text-emerald-300 mt-1">{compressResult}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Drag & Drop Zone */
            <div
              className={`relative rounded-xl border-2 border-dashed transition-colors ${
                dragging
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleCoverDrop}
            >
              <label className="flex flex-col items-center justify-center py-10 cursor-pointer">
                {uploadingCover ? (
                  <span className="w-8 h-8 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                ) : (
                  <>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      dragging ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {dragging ? "Drop image here" : "Drag & drop an image, or click to browse"}
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, WebP up to 10MB</p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </label>
            </div>
          )}

          {/* Or paste URL */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-400">or paste URL:</span>
            <input
              type="text"
              placeholder="https://example.com/image.png"
              value={form.coverImage}
              onChange={(e) => updateField("coverImage", e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 placeholder:text-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Series */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Series (optional)</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={form.seriesId}
              onChange={(e) => updateField("seriesId", e.target.value)}
            >
              <option value="">No series</option>
              {seriesList.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          {form.seriesId && (
            <Input label="Order in Series" type="number" value={String(form.seriesOrder)} onChange={(e) => updateField("seriesOrder", parseInt(e.target.value) || 0)} />
          )}
        </div>

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
