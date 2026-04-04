export const SITE_NAME = "SecureMango Blog";
export const SITE_URL = "https://blog.securemango.com";
export const SITE_DESCRIPTION =
  "Cybersecurity insights across 9 CISSP-aligned domains — from the SecureMango team.";

export const DOMAIN_COLORS: Record<string, string> = {
  "security-risk-management": "#10B981",
  "asset-security": "#84CC16",
  "security-architecture": "#0EA5E9",
  "network-security": "#3B82F6",
  iam: "#6366F1",
  "security-assessment": "#EC4899",
  "security-operations": "#F97316",
  "software-development-security": "#EF4444",
  "cloud-platform-security": "#8B5CF6",
};

export const ICON_MAP: Record<string, string> = {
  Shield: "🛡️", Network: "🌐", Cloud: "☁️", Search: "🔍",
  FileCheck: "📋", Target: "🎯", AlertTriangle: "⚠️", Code: "💻",
  Key: "🔑", Building: "🏗️", Database: "🗄️",
};

export interface SubDomainEntry {
  label: string;
  slug: string;
  icon: string;
  tags: string[]; // matches Post.subDomain values stored in DB
}

export const SUB_DOMAINS: Record<string, SubDomainEntry[]> = {
  "security-risk-management": [
    { label: "Risk Management", slug: "security-risk-management?focus=risk-management", icon: "⚖️", tags: ["risk-management", "risk-assessment"] },
    { label: "Governance, Policies & Standards", slug: "security-risk-management?focus=governance", icon: "📜", tags: ["governance", "security-governance"] },
    { label: "Compliance, Audit & Legal", slug: "security-risk-management?focus=compliance", icon: "📊", tags: ["compliance", "audit"] },
    { label: "Third-Party & Vendor Risk", slug: "security-risk-management?focus=vendor-risk", icon: "🤝", tags: ["vendor-risk", "third-party"] },
    { label: "BCP / Disaster Recovery", slug: "security-risk-management?focus=bcp-dr", icon: "🔄", tags: ["bcp-dr", "business-continuity", "disaster-recovery"] },
  ],
  "asset-security": [
    { label: "Data Classification & Ownership", slug: "asset-security?focus=data-classification", icon: "🏷️", tags: ["data-classification"] },
    { label: "Data Protection (Encryption, DLP)", slug: "asset-security?focus=data-protection", icon: "🔒", tags: ["data-protection", "encryption", "dlp", "endpoint-protection"] },
    { label: "Privacy & Data Governance", slug: "asset-security?focus=privacy", icon: "👁️", tags: ["privacy", "data-governance"] },
    { label: "Database Security", slug: "asset-security?focus=database-security", icon: "🗄️", tags: ["database-security"] },
    { label: "Backup, Recovery & Resilience", slug: "asset-security?focus=backup-recovery", icon: "💾", tags: ["backup-recovery", "media-sanitization", "resilience"] },
  ],
  "security-architecture": [
    { label: "Secure Design & Security Models", slug: "security-architecture?focus=secure-design", icon: "📐", tags: ["secure-design"] },
    { label: "Threat Modeling", slug: "security-architecture?focus=threat-modeling", icon: "🎯", tags: ["threat-modeling"] },
    { label: "Cryptography & Key Management", slug: "security-architecture?focus=cryptography", icon: "🔐", tags: ["cryptography"] },
    { label: "Hardware & Embedded Security", slug: "security-architecture?focus=hardware-security", icon: "🔧", tags: ["hardware-security", "resilience"] },
    { label: "Zero Trust Architecture", slug: "security-architecture?focus=zero-trust", icon: "🏰", tags: ["zero-trust"] },
  ],
  "network-security": [
    { label: "Network Architecture & Segmentation", slug: "network-security?focus=architecture", icon: "🔀", tags: ["architecture", "network-segmentation"] },
    { label: "Secure Protocols (TLS, VPN, IPsec)", slug: "network-security?focus=protocols", icon: "🔗", tags: ["protocols", "tls-pki"] },
    { label: "Perimeter Defense (Firewalls, IDS/IPS)", slug: "network-security?focus=perimeter", icon: "🛡️", tags: ["perimeter", "firewalls", "ids-ips"] },
    { label: "Wireless Security", slug: "network-security?focus=wireless", icon: "📡", tags: ["wireless", "wireless-security"] },
    { label: "IoT & OT / ICS Security", slug: "network-security?focus=iot-ot", icon: "🏭", tags: ["iot-ot", "iot", "ics"] },
  ],
  iam: [
    { label: "Authentication & Federation", slug: "iam?focus=authentication", icon: "🔑", tags: ["authentication", "mfa", "federation"] },
    { label: "Privileged Access Management", slug: "iam?focus=pam", icon: "👤", tags: ["pam"] },
    { label: "Identity Lifecycle Management", slug: "iam?focus=identity-lifecycle", icon: "🔄", tags: ["identity-lifecycle", "directory-services"] },
    { label: "Zero Trust Identity", slug: "iam?focus=zero-trust-identity", icon: "🛂", tags: ["zero-trust-identity"] },
  ],
  "security-assessment": [
    { label: "Vulnerability Assessment & Scanning", slug: "security-assessment?focus=vulnerability-assessment", icon: "🔬", tags: ["vulnerability-assessment"] },
    { label: "Vulnerability Management", slug: "security-assessment?focus=vulnerability-management", icon: "📋", tags: ["vulnerability-management"] },
    { label: "Penetration Testing & Red Teaming", slug: "security-assessment?focus=pentesting", icon: "🎯", tags: ["pentesting", "penetration-testing", "red-team"] },
    { label: "Security Audits & Validation", slug: "security-assessment?focus=audits", icon: "✅", tags: ["audits", "control-validation"] },
    { label: "Bug Bounty & Crowdsourced Testing", slug: "security-assessment?focus=bug-bounty", icon: "🐛", tags: ["bug-bounty"] },
  ],
  "security-operations": [
    { label: "Logging, Monitoring & Detection", slug: "security-operations?focus=monitoring", icon: "📡", tags: ["monitoring", "siem", "xdr"] },
    { label: "Threat Hunting", slug: "security-operations?focus=threat-hunting", icon: "🔍", tags: ["threat-hunting"] },
    { label: "Incident Response & Handling", slug: "security-operations?focus=incident-response", icon: "🚨", tags: ["incident-response"] },
    { label: "Digital Forensics & Investigation", slug: "security-operations?focus=forensics", icon: "🔎", tags: ["forensics"] },
    { label: "Threat Intelligence (MITRE ATT&CK)", slug: "security-operations?focus=threat-intel", icon: "🧠", tags: ["threat-intel", "mitre-attack"] },
    { label: "Security Automation (SOAR)", slug: "security-operations?focus=soar", icon: "⚙️", tags: ["soar"] },
  ],
  "software-development-security": [
    { label: "Secure SDLC & DevSecOps", slug: "software-development-security?focus=devsecops", icon: "🔄", tags: ["devsecops", "sdlc", "supply-chain"] },
    { label: "Application & API Security", slug: "software-development-security?focus=appsec", icon: "🛡️", tags: ["appsec", "api-security"] },
    { label: "Code Analysis (SAST, DAST, IAST)", slug: "software-development-security?focus=code-analysis", icon: "🔍", tags: ["code-analysis", "sast", "dast", "iast"] },
    { label: "AI/ML & LLM Security", slug: "software-development-security?focus=ai-security", icon: "🤖", tags: ["ai-security", "llm-security"] },
  ],
  "cloud-platform-security": [
    { label: "Cloud Infrastructure (AWS, Azure, GCP)", slug: "cloud-platform-security?focus=cloud-infra", icon: "☁️", tags: ["cloud-infra", "aws", "azure", "gcp"] },
    { label: "Cloud Identity & Misconfiguration", slug: "cloud-platform-security?focus=cloud-misconfig", icon: "⚠️", tags: ["cloud-misconfig"] },
    { label: "Containers & Kubernetes Security", slug: "cloud-platform-security?focus=containers", icon: "📦", tags: ["containers", "container-security", "kubernetes"] },
    { label: "Serverless & Microservices", slug: "cloud-platform-security?focus=serverless", icon: "⚡", tags: ["serverless", "serverless-security", "microservices"] },
    { label: "Endpoint & Device Security", slug: "cloud-platform-security?focus=endpoint", icon: "💻", tags: ["endpoint", "edr", "xdr", "mdm"] },
    { label: "Virtualization & Host Security", slug: "cloud-platform-security?focus=virtualization", icon: "🖥️", tags: ["virtualization", "iac-security"] },
  ],
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Series", href: "/series" },
  { label: "Resources", href: "/resources" },
  { label: "Newsletter", href: "/newsletter" },
];
