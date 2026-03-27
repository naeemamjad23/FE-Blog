import { NewsletterSignup } from "./NewsletterSignup";

interface InlineCtaProps {
  title?: string;
  description?: string;
}

export function InlineCta({
  title = "Enjoying this article?",
  description = "Subscribe to get more cybersecurity insights delivered to your inbox weekly.",
}: InlineCtaProps) {
  return (
    <div className="my-8 border-l-4 border-emerald-500 bg-emerald-50 rounded-r-xl p-6">
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <NewsletterSignup compact source="inline-cta" />
    </div>
  );
}
