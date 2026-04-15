"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

// S-3: formatDate moved outside component — created once, not on every render.
// Cached via Map so same dateString never re-computes.
const dateCache = new Map();
function formatDate(dateString) {
  if (!dateString) return null;
  if (dateCache.has(dateString)) return dateCache.get(dateString);
  const result = new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  dateCache.set(dateString, result);
  return result;
}

// S-3: getExcerpt moved outside component — regex not re-created every render.
function getExcerpt(content, excerpt) {
  if (excerpt) return excerpt.length > 120 ? excerpt.substring(0, 120) + "..." : excerpt;
  if (!content) return "Read more...";
  const plainText = content.replace(/<[^>]*>/g, "");
  return plainText.length > 120 ? plainText.substring(0, 120) + "..." : plainText;
}


export default function BlogCard_New({ blog }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="block h-full">
      <Card
        className={`group cursor-pointer overflow-hidden border border-border h-full flex flex-col hover:shadow-xl hover:border-accent/30 ${DESIGN_CONSTANTS.transitions.smooth}`}
      >
        {/* Cover Image */}
        <div className="aspect-video bg-muted relative overflow-hidden flex-shrink-0">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </div>

        {/* Card Body */}
        <div className="flex-1 p-5 space-y-3">
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <h2 className={`${DESIGN_CONSTANTS.typography.cardTitle} line-clamp-2 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.smooth}`}>
            {blog.title}
          </h2>

          <p className="font-reading text-foreground/70 text-sm leading-relaxed line-clamp-3">
            {getExcerpt(blog.content, blog.excerpt)}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 mt-auto">
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground pt-4 border-t border-border">
            {blog.publishedAt && (
              <>
                <time>{formatDate(blog.publishedAt)}</time>
                <span className="opacity-40">•</span>
              </>
            )}
            <span>{blog.readingTime || 5} min read</span>
            <span className="opacity-40">•</span>
            {/* S-4: read views directly — no useState/useEffect needed */}
            <span>{(blog.views || 0).toLocaleString()} views</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
