"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/types";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<(Comment & { post?: { title: string; slug: string } })[]>([]);

  useEffect(() => {
    api.get("/api/comments/pending").then(({ data }) => setComments(data.data || data));
  }, []);

  async function handleApprove(id: string) {
    await api.patch(`/api/comments/${id}/approve`);
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this comment?")) return;
    await api.delete(`/api/comments/${id}`);
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Comments</h1>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">{comment.authorName}</p>
                <p className="text-xs text-gray-400">{comment.authorEmail} &middot; {formatDate(comment.createdAt)}</p>
                {comment.post && (
                  <p className="text-xs text-gray-500 mt-1">on: {comment.post.title}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleApprove(comment.id)}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(comment.id)}>Delete</Button>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-2">{comment.content}</p>
          </div>
        ))}
      </div>

      {comments.length === 0 && <p className="text-gray-500 text-center py-8">No pending comments.</p>}
    </div>
  );
}
