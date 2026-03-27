"use client";

import { NewsletterSignup } from "@/components/lead-gen/NewsletterSignup";

interface PremiumGateProps {
  children: React.ReactNode;
  isPremium: boolean;
}

export function PremiumGate({ children, isPremium }: PremiumGateProps) {
  if (!isPremium) return <>{children}</>;

  return (
    <div className="relative">
      <div className="max-h-[600px] overflow-hidden relative">
        {children}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center -mt-8 relative z-10 shadow-lg">
        <span className="text-3xl">🔒</span>
        <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">Premium Content</h3>
        <p className="text-sm text-gray-600 mb-4">
          Subscribe to unlock this full article and get access to all premium content.
        </p>
        <NewsletterSignup source="premium-gate" />
      </div>
    </div>
  );
}
