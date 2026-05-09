"use client";

import { Badge } from "@/components/ui/badge";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

// TODO: Replace with real curated blogs from backend
// Each blog should have an extra `annotation` field — your personal note
const EDITORS_PICKS = [
    { annotation: "wrote this at 2am and it still holds true" },
    { annotation: "this one changed how i approach problems" },
    { annotation: "not tech, just life — and that's okay" },
    { annotation: "hardest post to write, most honest one too" },
];

export default function EditorsChoiceSection({ blogs, onBlogClick }) {
    const picks = blogs.slice(0, 4);

    return (
        <section className={`${DESIGN_CONSTANTS.spacing.section} bg-muted/30`}>
            <div
                className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8`}
            >
                {/* Section Header — breaking the pattern intentionally */}
                <div
                    className={`flex flex-col items-center text-center gap-1 ${DESIGN_CONSTANTS.spacing.header}`}
                >
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        — picked by me, for you —
                    </span>
                    <h2 className="text-2xl font-sans font-bold">
                        Editor's Choice
                    </h2>
                </div>

                {/* 2-column grid, no images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {picks.map((blog, index) => (
                        <div
                            key={blog._id}
                            onClick={() => onBlogClick(blog.slug)}
                            className="group cursor-pointer border border-border hover:border-foreground/30 p-6 transition-all duration-200 space-y-3"
                        >
                            {/* Personal annotation */}
                            <p className="text-sm italic font-reading text-muted-foreground/70 leading-relaxed">
                                "
                                {blog.editorsPick?.annotation ||
                                    "a piece close to my heart"}
                                "
                            </p>

                            {/* Divider */}
                            <div className="w-8 h-[1.5px] bg-accent" />

                            {/* Title */}
                            <h3 className="font-sans font-bold text-lg leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
                                {blog.title}
                            </h3>

                            {/* Meta */}
                            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                <span>{blog.readingTime || 5} min read</span>
                                {blog.tags?.[0] && (
                                    <>
                                        <span className="opacity-40">•</span>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {blog.tags[0]}
                                        </Badge>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
