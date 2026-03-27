"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get("/api/media").then(({ data }) => setFiles(data.data || data));
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await api.post("/api/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = data.data || data;
      setFiles((prev) => [{ ...result, createdAt: new Date().toISOString() }, ...prev]);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(filename: string) {
    if (!confirm("Delete this file?")) return;
    await api.delete(`/api/media/${filename}`);
    setFiles((prev) => prev.filter((f) => f.filename !== filename));
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <div>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} accept="image/*,.pdf" />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((file) => (
          <div key={file.filename} className="border border-gray-200 rounded-lg overflow-hidden group">
            {file.filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
              <img src={file.url} alt={file.filename} className="w-full h-32 object-cover" />
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                {file.filename.split(".").pop()?.toUpperCase()}
              </div>
            )}
            <div className="p-2">
              <p className="text-xs text-gray-700 truncate">{file.filename}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              <div className="flex gap-2 mt-1">
                <button onClick={() => copyUrl(file.url)} className="text-xs text-emerald-600 hover:underline">Copy URL</button>
                <button onClick={() => handleDelete(file.filename)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && <p className="text-gray-500 text-center py-12">No files uploaded yet.</p>}
    </div>
  );
}
