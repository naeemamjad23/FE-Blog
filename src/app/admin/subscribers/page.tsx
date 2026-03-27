"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Subscriber } from "@/types";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    api.get("/api/subscribers").then(({ data }) => setSubscribers(data.data || data));
    api.get("/api/subscribers/count").then(({ data }) => setCount(data.data ?? data));
  }, []);

  async function handleRemove(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    await api.delete(`/api/subscribers/${id}`);
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    setCount((c) => c - 1);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscribers</h1>
      <p className="text-gray-500 mb-6">Total: {count}</p>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-2 font-medium">Email</th>
            <th className="pb-2 font-medium">Name</th>
            <th className="pb-2 font-medium">Source</th>
            <th className="pb-2 font-medium">Date</th>
            <th className="pb-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((sub) => (
            <tr key={sub.id} className="border-b hover:bg-gray-50">
              <td className="py-3 text-gray-900">{sub.email}</td>
              <td className="py-3 text-gray-500">{sub.name || "—"}</td>
              <td className="py-3 text-gray-500">{sub.source || "—"}</td>
              <td className="py-3 text-gray-500">{formatDate(sub.createdAt)}</td>
              <td className="py-3">
                <button onClick={() => handleRemove(sub.id)} className="text-red-500 hover:underline text-sm">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
