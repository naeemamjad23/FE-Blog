interface AdSlotProps {
  position: "sidebar" | "header" | "in-content" | "footer";
  className?: string;
}

export function AdSlot({ position, className }: AdSlotProps) {
  // Placeholder for ad integration (Google AdSense, Carbon Ads, etc.)
  // Replace the placeholder with actual ad code when ready
  return (
    <div
      className={`bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 ${className}`}
      style={{
        minHeight: position === "sidebar" ? "250px" : position === "header" ? "90px" : "120px",
      }}
      data-ad-position={position}
    >
      Ad Space — {position}
    </div>
  );
}
