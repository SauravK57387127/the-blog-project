"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";


export default function PopularPostsSection({ blogs, onBlogClick }) {
  const popular = blogs.slice(0, 5);

  return (
    <section className={DESIGN_CONSTANTS.spacing.section}>
      <div className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8`}>

        {/* Section Header */}
        <div className={`flex items-center gap-2 ${DESIGN_CONSTANTS.spacing.header}`}>
          <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
            Most Read This Month
          </span>
          <div className="flex-1 h-[1px] bg-border" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {popular.map((blog, index) => (
            <div
              key={blog._id}
              onClick={() => onBlogClick(blog.slug)}
              className="group cursor-pointer relative flex flex-col gap-3"
            >
              {/* Cover Image */}
              <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
                {blog.coverImage ? (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}

                {/* Big faded number — sits over image bottom-left */}
                <span className="absolute -bottom-3 -left-2 text-8xl font-bold font-mono leading-none text-foreground/10 group-hover:text-accent/15 transition-colors duration-300 select-none pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-1.5 pt-3">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{blog.readingTime || 5} min read</span>
                </div>

                <h3 className="font-sans font-bold text-sm leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
                  {blog.title}
                </h3>

                {blog.tags?.[0] && (
                  <Badge variant="outline" className="text-xs">
                    {blog.tags[0]}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
