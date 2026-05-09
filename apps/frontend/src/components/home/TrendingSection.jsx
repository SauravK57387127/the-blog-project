"use client";

import { DESIGN_CONSTANTS } from "@/lib/design-constants";

export default function TrendingSection({ blogs, onBlogClick }) {
    const trending = blogs.slice(0, 5);

    return (
        <section className={`${DESIGN_CONSTANTS.spacing.section} bg-muted/30`}>
            <div
                className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8`}
            >
                {/* Section Header */}
                <div
                    className={`flex items-center gap-2 ${DESIGN_CONSTANTS.spacing.header}`}
                >
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        Trending This Week
                    </span>
                    <div className="flex-1 h-[1px] bg-border" />
                </div>

                {/* Numbered List */}
                <div className="flex flex-col">
                    {trending.map((blog, index) => (
                        <div
                            key={blog._id}
                            onClick={() => onBlogClick(blog.slug)}
                            className="group cursor-pointer flex items-center gap-6 py-5 border-b border-border last:border-0 hover:bg-background/60 -mx-4 px-4 transition-colors duration-200"
                        >
                            {/* Number */}
                            <span className="text-4xl font-bold font-mono text-muted-foreground/20 w-12 flex-shrink-0 group-hover:text-accent/30 transition-colors duration-200">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-1">
                                <h3 className="font-sans font-bold text-lg leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-1">
                                    {blog.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                    <span>
                                        {blog.readingTime || 5} min read
                                    </span>
                                    <span className="opacity-40">•</span>
                                    <span>
                                        {new Date(
                                            blog.publishedAt || Date.now(),
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                    {blog.tags?.[0] && (
                                        <>
                                            <span className="opacity-40">
                                                •
                                            </span>
                                            <span className="text-muted-foreground/70">
                                                {blog.tags[0]}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Arrow hint */}
                            <span className="text-muted-foreground/30 group-hover:text-accent/60 transition-colors duration-200 flex-shrink-0">
                                →
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
