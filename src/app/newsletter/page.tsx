import { NewsletterSignup } from "@/components/lead-gen/NewsletterSignup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Subscribe to the SecureMango weekly security digest.",
};

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-5 shadow-lg shadow-emerald-500/20">
          S
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
          The SecureMango Newsletter
        </h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
          Weekly cybersecurity insights, tutorials, and resources — curated for security professionals.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-16">
        <NewsletterSignup source="newsletter-page" />
      </div>

      {/* What you get */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            ),
            title: "Weekly Digest",
            description: "Curated top articles across all 8 cybersecurity domains delivered every Monday.",
          },
          {
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ),
            title: "Exclusive Content",
            description: "Access premium articles, downloadable checklists, and security guides.",
          },
          {
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
            title: "Zero Spam",
            description: "Only valuable content. One email per week. Unsubscribe with one click.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              {item.icon}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{item.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
