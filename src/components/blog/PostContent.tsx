"use client";

import { useEffect, useState } from "react";

interface PostContentProps {
  content: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function PostContent({ content }: PostContentProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headingRegex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h\1>/g;
    const items: TocItem[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      items.push({ level: parseInt(match[1]), id: match[2], text: match[3] });
    }
    setToc(items);
  }, [content]);

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  // Reading progress
  useEffect(() => {
    const bar = document.createElement("div");
    bar.className = "reading-progress";
    document.body.appendChild(bar);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${(scrollTop / docHeight) * 100}%`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      bar.remove();
    };
  }, []);

  return (
    <div className="flex gap-10">
      <article
        className="prose-blog max-w-none flex-1"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Table of Contents */}
      {toc.length > 0 && (
        <nav className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">On this page</p>
            <ul className="space-y-1 border-l border-gray-100">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block text-[13px] leading-snug py-1.5 transition-all border-l-2 -ml-px ${
                      activeId === item.id
                        ? "border-emerald-500 text-emerald-700 font-medium"
                        : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300"
                    }`}
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
}
