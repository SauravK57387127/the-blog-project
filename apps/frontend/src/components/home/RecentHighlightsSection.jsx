"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";


export default function RecentHighlightsSection({ blogs, onBlogClick }) {
  const [big, ...smalls] = blogs.slice(0, 5);

  return (
    <section className={DESIGN_CONSTANTS.spacing.section}>
      <div className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8`}>
        
        {/* Section Header */}
        <div className={`flex items-center gap-2 ${DESIGN_CONSTANTS.spacing.header}`}>
          <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
            Recent Highlights
          </span>
          <div className="flex-1 h-[1px] bg-border" />
        </div>

        {/* Layout: 1 big left + 2 small right */}
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* Big Card */}
          {big && (
            <div
              onClick={() => onBlogClick(big.slug)}
              className="lg:col-span-3 group cursor-pointer flex flex-col gap-4"
            >
              <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
                {big.coverImage ? (
                  <Image
                    src={big.coverImage}
                    alt={big.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
              <div className="space-y-2">
                <Meta blog={big} />
                <h2 className="text-2xl font-sans font-bold leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
                  {big.title}
                </h2>
                <Tags tags={big.tags} />
              </div>
            </div>
          )}

          {/* 2 Small Cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {smalls.map((blog) => (
              <div
                key={blog._id}
                onClick={() => onBlogClick(blog.slug)}
                className="group cursor-pointer flex gap-4"
              >
                <div className="w-28 h-28 flex-shrink-0 rounded-md overflow-hidden bg-muted relative">
                  {blog.coverImage ? (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      loading="lazy"
                      sizes="112px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <Meta blog={blog} />
                  <h3 className="font-sans font-bold text-base leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
                    {blog.title}
                  </h3>
                  <Tags tags={blog.tags} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function Meta({ blog }) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
      <span>
        {new Date(blog.publishedAt || Date.now()).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        })}
      </span>
      <span className="opacity-40">•</span>
      <span>{blog.readingTime || 5} min read</span>
    </div>
  );
}

function Tags({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, 2).map((tag) => (
        <Badge key={tag} variant="outline" className="text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
