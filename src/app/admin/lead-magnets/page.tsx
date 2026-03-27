"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { slugify } from "@/lib/utils";
import type { LeadMagnet } from "@/types";

export default function AdminLeadMagnetsPage() {
  const [magnets, setMagnets] = useState<LeadMagnet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", fileUrl: "" });

  useEffect(() => {
    api.get("/api/lead-magnets").then(({ data }) => setMagnets(data.data || data));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await api.post("/api/lead-magnets", form);
    setMagnets((prev) => [data.data || data, ...prev]);
    setForm({ title: "", slug: "", description: "", fileUrl: "" });
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this lead magnet?")) return;
    await api.delete(`/api/lead-magnets/${id}`);
    setMagnets((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lead Magnets</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add New"}</Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border rounded-lg p-4 mb-6 space-y-3">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} required />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <Input label="File URL" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} required />
          <Button type="submit">Create</Button>
        </form>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-2 font-medium">Title</th>
            <th className="pb-2 font-medium">Downloads</th>
            <th className="pb-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {magnets.map((m) => (
            <tr key={m.id} className="border-b hover:bg-gray-50">
              <td className="py-3 font-medium text-gray-900">{m.title}</td>
              <td className="py-3 text-gray-500">{m.downloads}</td>
              <td className="py-3">
                <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:underline text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
