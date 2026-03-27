"use client";

interface AffiliateLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function AffiliateLink({ href, children, className }: AffiliateLinkProps) {
  const tracked = href.includes("?")
    ? `${href}&utm_source=securemango&utm_medium=blog&utm_campaign=affiliate`
    : `${href}?utm_source=securemango&utm_medium=blog&utm_campaign=affiliate`;

  return (
    <a
      href={tracked}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
    >
      {children}
    </a>
  );
}
