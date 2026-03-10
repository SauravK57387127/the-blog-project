"use client";

import { Calendar, Clock, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

export default function BlogCard_New({ blog }) {
  const router = useRouter();
  const [views, setViews] = useState(0);

  useEffect(() => {
    setViews(blog.views || Math.floor(Math.random() * 4000) + 800);
  }, [blog.views]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getExcerpt = (content) => {
    if (!content) return "Read more...";
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > 120 ? plainText.substring(0, 120) + "..." : plainText;
  };

  return (
    <Card
      onClick={() => router.push(`/blogs/${blog.slug}`)}
      className={`group cursor-pointer overflow-hidden border border-border h-full flex flex-col hover:shadow-xl hover:border-accent/30 ${DESIGN_CONSTANTS.transitions.smooth}`}
    >
      {/* Cover Image */}
      <div className="aspect-video bg-muted relative overflow-hidden flex-shrink-0">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
          {getExcerpt(blog.content || blog.excerpt)}
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
          <span>{views.toLocaleString()} views</span>
        </div>
      </div>
    </Card>
  );
}
