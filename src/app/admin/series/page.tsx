"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { slugify } from "@/lib/utils";
import type { Series, Domain } from "@/types";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

const emptyForm = { title: "", slug: "", description: "", difficulty: "beginner", domainId: "", coverImage: "" };

export default function AdminSeriesPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/api/series").then(({ data }) => setSeriesList(data.data || data));
    api.get("/api/domains").then(({ data }) => setDomains(data.data || data));
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(s: Series) {
    setEditingId(s.id);
    setForm({
      title: s.title,
      slug: s.slug,
      description: s.description,
      difficulty: s.difficulty,
      domainId: s.domainId,
      coverImage: s.coverImage || "",
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, coverImage: form.coverImage || undefined };
      if (editingId) {
        const { data } = await api.patch(`/api/series/${editingId}`, payload);
        const updated = data.data || data;
        setSeriesList((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...updated } : s)));
      } else {
        const { data } = await api.post("/api/series", payload);
        const created = data.data || data;
        setSeriesList((prev) => [created, ...prev]);
      }
      closeForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save series";
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this series? Posts in this series will be unlinked.")) return;
    await api.delete(`/api/series/${id}`);
    setSeriesList((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Series</h1>
        <Button onClick={showForm ? closeForm : openCreate}>{showForm ? "Cancel" : "Add New"}</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-6 space-y-3">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value, slug: editingId ? form.slug : slugify(e.target.value) })}
            required
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <select
                value={form.domainId}
                onChange={(e) => setForm({ ...form, domainId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Select domain...</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="Cover Image URL (optional)"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          />
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Series" : "Create Series"}</Button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Domain</th>
              <th className="pb-2 font-medium">Difficulty</th>
              <th className="pb-2 font-medium">Posts</th>
              <th className="pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {seriesList.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-900 max-w-xs truncate">{s.title}</td>
                <td className="py-3">
                  <Badge color={s.domain?.color || "#6B7280"}>{s.domain?.name}</Badge>
                </td>
                <td className="py-3">
                  <Badge className={DIFFICULTY_COLORS[s.difficulty] || "bg-gray-100 text-gray-700"}>
                    {s.difficulty.charAt(0).toUpperCase() + s.difficulty.slice(1)}
                  </Badge>
                </td>
                <td className="py-3 text-gray-500">{s._count?.posts ?? 0}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(s)} className="text-emerald-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {seriesList.length === 0 && !showForm && (
        <p className="text-gray-500 text-center py-8">No series yet. Click &quot;Add New&quot; to create one.</p>
      )}
    </div>
  );
}
