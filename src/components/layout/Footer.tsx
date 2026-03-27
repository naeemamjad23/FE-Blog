import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { NewsletterSignup } from "@/components/lead-gen/NewsletterSignup";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                S
              </div>
              <span className="text-lg font-bold text-white tracking-tight">{SITE_NAME}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
              Cybersecurity insights and tutorials across 8 domains. From AppSec to DevSecOps.
            </p>
            <NewsletterSignup compact source="footer" />
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Navigate</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Series", href: "/series" },
                { label: "Resources", href: "/resources" },
                { label: "Newsletter", href: "/newsletter" },
                { label: "Search", href: "/search" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Domains */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Domains</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "AppSec", href: "/appsec" },
                { label: "Cloud Security", href: "/cloud-security" },
                { label: "Pentesting", href: "/pentesting" },
                { label: "DevSecOps", href: "/devsecops" },
                { label: "Threat Intel", href: "/threat-intelligence" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">More</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Network Security", href: "/network-security" },
                { label: "GRC", href: "/grc" },
                { label: "SOC & IR", href: "/soc-ir" },
                { label: "RSS Feed", href: "/rss.xml" },
                { label: "SecureMango.com", href: "https://securemango.com" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} SecureMango. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="https://securemango.com" className="hover:text-slate-300 transition-colors">Main Site</Link>
            <span className="text-slate-700">|</span>
            <Link href="/rss.xml" className="hover:text-slate-300 transition-colors">RSS</Link>
            <span className="text-slate-700">|</span>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
