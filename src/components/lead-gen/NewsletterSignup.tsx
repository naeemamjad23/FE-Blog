"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface NewsletterSignupProps {
  compact?: boolean;
  source?: string;
}

export function NewsletterSignup({ compact = false, source = "newsletter" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/api/subscribers", { email, source });
      setStatus("success");
      setMessage("You're in! Check your inbox.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Already subscribed or invalid email.");
    }
  }

  if (compact) {
    return (
      <div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
          <Button type="submit" size="sm" disabled={status === "loading"}>
            {status === "loading" ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
        {status !== "idle" && (
          <p className={`text-xs mt-2 ${status === "success" ? "text-emerald-500" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-8 text-center overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="relative">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Get Weekly Security Insights</h3>
        <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
          Join security professionals. Curated content across all 8 domains. No spam, unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Subscribing..." : "Subscribe Free"}
          </Button>
        </form>
        {status !== "idle" && (
          <p className={`text-sm mt-4 ${status === "success" ? "text-emerald-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
