"use client";

import { useState, useEffect } from "react";
import { NewsletterSignup } from "./NewsletterSignup";

export function NewsletterPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("newsletter_popup_dismissed");
    if (dismissed) {
      const elapsed = Date.now() - parseInt(dismissed);
      if (elapsed < 7 * 24 * 60 * 60 * 1000) return; // 7 day cooldown
    }

    const timer = setTimeout(() => setShow(true), 45000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) setShow(true);
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  function dismiss() {
    setShow(false);
    localStorage.setItem("newsletter_popup_dismissed", Date.now().toString());
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Gradient accent */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors p-1"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 pt-6">
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg font-bold mx-auto mb-3">
              S
            </div>
            <h2 className="text-xl font-bold text-gray-900">Before you go...</h2>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              Get curated cybersecurity insights delivered weekly. Trusted by security professionals.
            </p>
          </div>
          <NewsletterSignup source="popup" />
          <p className="text-center text-[11px] text-gray-400 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
