"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      setMessage("You're subscribed! Check your inbox.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Already subscribed or invalid email.");
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-gray-900"
        />
        <Button type="submit" size="sm" disabled={status === "loading"}>
          {status === "loading" ? "..." : "Go"}
        </Button>
        {status !== "idle" && (
          <p className={`text-xs mt-1 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </form>
    );
  }

  return (
    <div className="bg-emerald-50 rounded-xl p-6 text-center">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Get Weekly Security Insights</h3>
      <p className="text-sm text-gray-600 mb-4">
        Join 1,000+ security professionals. No spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      {status !== "idle" && (
        <p className={`text-sm mt-3 ${status === "success" ? "text-emerald-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
