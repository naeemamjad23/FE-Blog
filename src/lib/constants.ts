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

export const SUB_DOMAINS: Record<string, { label: string; slug: string; icon: string }[]> = {
  "security-risk-management": [
    { label: "Risk Management", slug: "security-risk-management?focus=risk-management", icon: "⚖️" },
    { label: "Governance, Policies & Standards", slug: "security-risk-management?focus=governance", icon: "📜" },
    { label: "Compliance, Audit & Legal", slug: "security-risk-management?focus=compliance", icon: "📊" },
    { label: "Third-Party & Vendor Risk", slug: "security-risk-management?focus=vendor-risk", icon: "🤝" },
    { label: "BCP / Disaster Recovery", slug: "security-risk-management?focus=bcp-dr", icon: "🔄" },
  ],
  "asset-security": [
    { label: "Data Classification & Ownership", slug: "asset-security?focus=data-classification", icon: "🏷️" },
    { label: "Data Protection (Encryption, DLP)", slug: "asset-security?focus=data-protection", icon: "🔒" },
    { label: "Privacy & Data Governance", slug: "asset-security?focus=privacy", icon: "👁️" },
    { label: "Database Security", slug: "asset-security?focus=database-security", icon: "🗄️" },
    { label: "Backup, Recovery & Resilience", slug: "asset-security?focus=backup-recovery", icon: "💾" },
  ],
  "security-architecture": [
    { label: "Secure Design & Security Models", slug: "security-architecture?focus=secure-design", icon: "📐" },
    { label: "Threat Modeling", slug: "security-architecture?focus=threat-modeling", icon: "🎯" },
    { label: "Cryptography & Key Management", slug: "security-architecture?focus=cryptography", icon: "🔐" },
    { label: "Hardware & Embedded Security", slug: "security-architecture?focus=hardware-security", icon: "🔧" },
    { label: "Zero Trust Architecture", slug: "security-architecture?focus=zero-trust", icon: "🏰" },
  ],
  "network-security": [
    { label: "Network Architecture & Segmentation", slug: "network-security?focus=architecture", icon: "🔀" },
    { label: "Secure Protocols (TLS, VPN, IPsec)", slug: "network-security?focus=protocols", icon: "🔗" },
    { label: "Perimeter Defense (Firewalls, IDS/IPS)", slug: "network-security?focus=perimeter", icon: "🛡️" },
    { label: "Wireless Security", slug: "network-security?focus=wireless", icon: "📡" },
    { label: "IoT & OT / ICS Security", slug: "network-security?focus=iot-ot", icon: "🏭" },
  ],
  iam: [
    { label: "Authentication & Federation", slug: "iam?focus=authentication", icon: "🔑" },
    { label: "Privileged Access Management", slug: "iam?focus=pam", icon: "👤" },
    { label: "Identity Lifecycle Management", slug: "iam?focus=identity-lifecycle", icon: "🔄" },
    { label: "Zero Trust Identity", slug: "iam?focus=zero-trust-identity", icon: "🛂" },
  ],
  "security-assessment": [
    { label: "Vulnerability Assessment & Scanning", slug: "security-assessment?focus=vulnerability-assessment", icon: "🔬" },
    { label: "Vulnerability Management", slug: "security-assessment?focus=vulnerability-management", icon: "📋" },
    { label: "Penetration Testing & Red Teaming", slug: "security-assessment?focus=pentesting", icon: "🎯" },
    { label: "Security Audits & Validation", slug: "security-assessment?focus=audits", icon: "✅" },
    { label: "Bug Bounty & Crowdsourced Testing", slug: "security-assessment?focus=bug-bounty", icon: "🐛" },
  ],
  "security-operations": [
    { label: "Logging, Monitoring & Detection", slug: "security-operations?focus=monitoring", icon: "📡" },
    { label: "Threat Hunting", slug: "security-operations?focus=threat-hunting", icon: "🔍" },
    { label: "Incident Response & Handling", slug: "security-operations?focus=incident-response", icon: "🚨" },
    { label: "Digital Forensics & Investigation", slug: "security-operations?focus=forensics", icon: "🔎" },
    { label: "Threat Intelligence (MITRE ATT&CK)", slug: "security-operations?focus=threat-intel", icon: "🧠" },
    { label: "Security Automation (SOAR)", slug: "security-operations?focus=soar", icon: "⚙️" },
  ],
  "software-development-security": [
    { label: "Secure SDLC & DevSecOps", slug: "software-development-security?focus=devsecops", icon: "🔄" },
    { label: "Application & API Security", slug: "software-development-security?focus=appsec", icon: "🛡️" },
    { label: "Code Analysis (SAST, DAST, IAST)", slug: "software-development-security?focus=code-analysis", icon: "🔍" },
    { label: "AI/ML & LLM Security", slug: "software-development-security?focus=ai-security", icon: "🤖" },
  ],
  "cloud-platform-security": [
    { label: "Cloud Infrastructure (AWS, Azure, GCP)", slug: "cloud-platform-security?focus=cloud-infra", icon: "☁️" },
    { label: "Cloud Identity & Misconfiguration", slug: "cloud-platform-security?focus=cloud-misconfig", icon: "⚠️" },
    { label: "Containers & Kubernetes Security", slug: "cloud-platform-security?focus=containers", icon: "📦" },
    { label: "Serverless & Microservices", slug: "cloud-platform-security?focus=serverless", icon: "⚡" },
    { label: "Endpoint & Device Security", slug: "cloud-platform-security?focus=endpoint", icon: "💻" },
    { label: "Virtualization & Host Security", slug: "cloud-platform-security?focus=virtualization", icon: "🖥️" },
  ],
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Series", href: "/series" },
  { label: "Resources", href: "/resources" },
  { label: "Newsletter", href: "/newsletter" },
];
