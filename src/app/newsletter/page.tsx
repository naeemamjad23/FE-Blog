import { NewsletterSignup } from "@/components/lead-gen/NewsletterSignup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Subscribe to the SecureMango weekly security digest.",
};

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center">
      <span className="text-5xl mb-4 block">🥭</span>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">SecureMango Newsletter</h1>
      <p className="text-gray-600 mb-8 text-lg">
        Get weekly cybersecurity insights, tutorials, and resources delivered straight to your inbox.
        Join 1,000+ security professionals.
      </p>

      <NewsletterSignup source="newsletter-page" />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Weekly Digest</h3>
          <p className="text-sm text-gray-600">Curated top articles across all 8 cybersecurity domains.</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Exclusive Content</h3>
          <p className="text-sm text-gray-600">Access premium articles and downloadable resources.</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-1">No Spam</h3>
          <p className="text-sm text-gray-600">Unsubscribe anytime. We respect your inbox.</p>
        </div>
      </div>
    </div>
  );
}
