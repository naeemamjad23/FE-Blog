"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { LeadMagnet } from "@/types";

interface LeadMagnetCardProps {
  leadMagnet: LeadMagnet;
}

export function LeadMagnetCard({ leadMagnet }: LeadMagnetCardProps) {
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/subscribers", {
        email,
        source: "lead-magnet",
        leadMagnet: leadMagnet.title,
      });
      await api.post(`/api/lead-magnets/${leadMagnet.id}/download`);
      setUnlocked(true);
    } catch {
      // Already subscribed — still unlock
      setUnlocked(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-emerald-200 bg-emerald-50/50">
      <CardContent className="py-5">
        <h3 className="font-semibold text-gray-900 mb-1">{leadMagnet.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{leadMagnet.description}</p>
        <p className="text-xs text-gray-400 mb-3">{leadMagnet.downloads} downloads</p>

        {unlocked ? (
          <a
            href={leadMagnet.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button>Download Now</Button>
          </a>
        ) : (
          <form onSubmit={handleUnlock} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email to download"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "..." : "Unlock"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
