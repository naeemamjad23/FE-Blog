import { NewsletterSignup } from "./NewsletterSignup";

interface InlineCtaProps {
  title?: string;
  description?: string;
}

export function InlineCta({
  title = "Enjoying this article?",
  description = "Get more cybersecurity insights delivered to your inbox every week.",
}: InlineCtaProps) {
  return (
    <div className="my-10 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <NewsletterSignup compact source="inline-cta" />
        </div>
      </div>
    </div>
  );
}
