interface AdSlotProps {
  position: "sidebar" | "header" | "in-content" | "footer";
  className?: string;
}

export function AdSlot({ position, className }: AdSlotProps) {
  // Placeholder for ad integration — replace with actual ad code (Google AdSense, Carbon Ads, etc.)
  return (
    <div
      className={`rounded-xl bg-gray-50/50 border border-gray-100 flex items-center justify-center text-[11px] text-gray-300 ${className || ""}`}
      style={{
        minHeight: position === "sidebar" ? "250px" : position === "header" ? "90px" : "100px",
      }}
      data-ad-position={position}
    >
      Advertisement
    </div>
  );
}
