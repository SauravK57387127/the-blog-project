"use client";

import Image from "next/image";
import { ArrowRight, ImageIcon } from "lucide-react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop";

export default function HeroSection({ blog, isLoading, onBlogClick }) {
    if (isLoading) {
        return (
            <section>
                <div
                    className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 ${DESIGN_CONSTANTS.spacing.section}`}
                >
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="space-y-6">
                            <div className="h-7 w-28 bg-muted animate-pulse rounded" />
                            <div className="h-16 bg-muted animate-pulse rounded" />
                            <div className="h-16 bg-muted animate-pulse rounded" />
                            <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                        </div>
                        <div className="aspect-video bg-muted animate-pulse rounded-lg" />
                    </div>
                </div>
            </section>
        );
    }

    if (!blog) {
        return (
            <section>
                <div
                    className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 py-16`}
                >
                    <p className="text-center text-muted-foreground">
                        No featured blog available
                    </p>
                </div>
            </section>
        );
    }

    const imageSrc = blog.coverImage || FALLBACK_IMAGE;

    return (
        <section>
            <div
                className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 ${DESIGN_CONSTANTS.spacing.section}`}
            >
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Content Column — entire area clickable */}
                    <div
                        className="space-y-6 cursor-pointer group"
                        onClick={() => onBlogClick(blog.slug)}
                    >
                        {/* Featured Badge */}
                        <div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground border border-border px-3 py-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block animate-pulse" />
                                Latest story
                            </span>
                        </div>

                        {/* Title */}
                        <h1
                            className={`${DESIGN_CONSTANTS.typography.heroTitle}`}
                        >
                            {blog.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-lg text-foreground/75 leading-relaxed font-reading">
                            {blog.excerpt || blog.content?.substring(0, 180)}.
                        </p>

                        {/* CTA */}
                        <div className="inline-flex items-center gap-2 text-base font-medium">
                            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-accent after:transition-all after:duration-300 group-hover:after:w-full">
                                Read the story
                            </span>
                            <ArrowRight className="h-4 w-4 opacity-60" />
                        </div>
                    </div>

                    {/* Image Column */}
                    <div
                        className="relative aspect-video rounded-lg overflow-hidden bg-muted shadow-lg cursor-pointer"
                        onClick={() => onBlogClick(blog.slug)}
                    >
                        {imageSrc ? (
                            <Image
                                src={imageSrc}
                                alt={blog.title}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-accent/20 to-primary/10">
                                <ImageIcon className="h-16 w-16 text-muted-foreground/40 mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Cover image coming soon
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
