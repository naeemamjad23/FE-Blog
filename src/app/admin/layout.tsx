"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const adminLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Posts", href: "/admin/posts" },
  { label: "Series", href: "/admin/series" },
  { label: "Subscribers", href: "/admin/subscribers" },
  { label: "Comments", href: "/admin/comments" },
  { label: "Lead Magnets", href: "/admin/lead-magnets" },
  { label: "Media", href: "/admin/media" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("blog_token");
    if (!token) {
      if (pathname !== "/admin/login") router.push("/admin/login");
      setLoading(false);
      return;
    }
    api.get("/api/auth/profile")
      .then(() => setAuthenticated(true))
      .catch(() => {
        localStorage.removeItem("blog_token");
        if (pathname !== "/admin/login") router.push("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [pathname, router]);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (pathname === "/admin/login") return <>{children}</>;
  if (!authenticated) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-50 border-r border-gray-200 p-4 shrink-0">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Admin Panel</h2>
        <nav className="space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                pathname === link.href
                  ? "bg-emerald-100 text-emerald-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("blog_token");
            router.push("/admin/login");
          }}
          className="mt-8 block text-sm text-red-500 hover:text-red-700 px-3"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
