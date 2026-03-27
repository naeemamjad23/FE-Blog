export const SITE_NAME = "SecureMango Blog";
export const SITE_URL = "https://blog.securemango.com";
export const SITE_DESCRIPTION =
  "Cybersecurity insights across AppSec, Cloud Security, Threat Intelligence, and more — from the SecureMango team.";

export const DOMAIN_COLORS: Record<string, string> = {
  appsec: "#EF4444",
  "network-security": "#3B82F6",
  "cloud-security": "#8B5CF6",
  "threat-intelligence": "#F59E0B",
  grc: "#10B981",
  pentesting: "#EC4899",
  "soc-ir": "#F97316",
  devsecops: "#06B6D4",
};

export const DOMAIN_ICONS: Record<string, string> = {
  appsec: "Shield",
  "network-security": "Network",
  "cloud-security": "Cloud",
  "threat-intelligence": "Search",
  grc: "FileCheck",
  pentesting: "Target",
  "soc-ir": "AlertTriangle",
  devsecops: "Code",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Series", href: "/series" },
  { label: "Resources", href: "/resources" },
  { label: "Newsletter", href: "/newsletter" },
];
