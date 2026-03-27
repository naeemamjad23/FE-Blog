interface SponsoredBadgeProps {
  sponsorName?: string;
  sponsorUrl?: string;
}

export function SponsoredBadge({ sponsorName, sponsorUrl }: SponsoredBadgeProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800 flex items-center gap-2">
      <span className="font-medium">Sponsored</span>
      {sponsorName && (
        <>
          <span>by</span>
          {sponsorUrl ? (
            <a href={sponsorUrl} target="_blank" rel="noopener noreferrer sponsored" className="font-medium underline">
              {sponsorName}
            </a>
          ) : (
            <span className="font-medium">{sponsorName}</span>
          )}
        </>
      )}
    </div>
  );
}
