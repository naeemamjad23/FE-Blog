"use client";

import { useState, useEffect } from "react";
import { NewsletterSignup } from "./NewsletterSignup";

export function NewsletterPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem("newsletter_popup_dismissed");
    if (dismissed) return;

    // Show after 30 seconds or on exit intent
    const timer = setTimeout(() => setShow(true), 30000);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 relative">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-4">
          <span className="text-4xl">🥭</span>
          <h2 className="text-xl font-bold text-gray-900 mt-2">Don&apos;t miss out!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Get the latest cybersecurity insights delivered to your inbox.
          </p>
        </div>
        <NewsletterSignup source="popup" />
      </div>
    </div>
  );
}
