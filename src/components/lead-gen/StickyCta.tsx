"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 text-white py-3 px-4 shadow-lg">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <p className="text-sm">
          🥭 Get our weekly security digest — join 1,000+ security pros
        </p>
        <div className="flex items-center gap-3">
          <Link href="/newsletter">
            <Button size="sm">Subscribe</Button>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-white text-sm"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}
