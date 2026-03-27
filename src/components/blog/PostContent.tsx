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

  useEffect(() => {
    // Extract headings for table of contents
    const headingRegex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h\1>/g;
    const items: TocItem[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      items.push({ level: parseInt(match[1]), id: match[2], text: match[3] });
    }
    setToc(items);
  }, [content]);

  return (
    <div className="flex gap-8">
      <article
        className="prose prose-gray prose-lg max-w-none flex-1
          prose-headings:scroll-mt-20
          prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
          prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Table of Contents */}
      {toc.length > 0 && (
        <nav className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-24">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">On this page</h4>
            <ul className="space-y-2 text-sm">
              {toc.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
                  <a
                    href={`#${item.id}`}
                    className="text-gray-500 hover:text-gray-900 transition-colors"
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
