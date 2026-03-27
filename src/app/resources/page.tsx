import { fetchAPI } from "@/lib/api";
import { LeadMagnetCard } from "@/components/lead-gen/LeadMagnetCard";
import type { Metadata } from "next";
import type { LeadMagnet } from "@/types";

export const metadata: Metadata = {
  title: "Resources",
  description: "Free cybersecurity checklists, guides, and downloadable resources.",
};

export default async function ResourcesPage() {
  let resources: LeadMagnet[] = [];
  try {
    const data = await fetchAPI<{ data: LeadMagnet[] } | LeadMagnet[]>("/api/lead-magnets");
    resources = Array.isArray(data) ? data : data.data;
  } catch {}

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Free Resources</h1>
      <p className="text-gray-600 mb-8">
        Download cybersecurity checklists, guides, and templates — all free.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <LeadMagnetCard key={resource.id} leadMagnet={resource} />
        ))}
      </div>

      {resources.length === 0 && (
        <p className="text-gray-500 text-center py-12">Resources coming soon!</p>
      )}
    </div>
  );
}
