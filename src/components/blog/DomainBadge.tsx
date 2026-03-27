import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DOMAIN_COLORS } from "@/lib/constants";

interface DomainBadgeProps {
  name: string;
  slug: string;
  color?: string;
}

export function DomainBadge({ name, slug, color }: DomainBadgeProps) {
  return (
    <Link href={`/${slug}`}>
      <Badge color={color || DOMAIN_COLORS[slug] || "#6B7280"}>{name}</Badge>
    </Link>
  );
}
