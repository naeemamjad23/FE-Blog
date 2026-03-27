import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { NewsletterSignup } from "@/components/lead-gen/NewsletterSignup";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold text-lg mb-2">🥭 {SITE_NAME}</h3>
            <p className="text-sm text-gray-400">{SITE_DESCRIPTION}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/series" className="hover:text-white transition-colors">Series</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              <li><Link href="/newsletter" className="hover:text-white transition-colors">Newsletter</Link></li>
            </ul>
          </div>

          {/* Domains */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Domains</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/appsec" className="hover:text-white transition-colors">AppSec</Link></li>
              <li><Link href="/cloud-security" className="hover:text-white transition-colors">Cloud Security</Link></li>
              <li><Link href="/pentesting" className="hover:text-white transition-colors">Pentesting</Link></li>
              <li><Link href="/devsecops" className="hover:text-white transition-colors">DevSecOps</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Stay Updated</h4>
            <NewsletterSignup compact />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} SecureMango. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/rss.xml" className="hover:text-white transition-colors">RSS</Link>
            <Link href="https://securemango.com" className="hover:text-white transition-colors">SecureMango.com</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
