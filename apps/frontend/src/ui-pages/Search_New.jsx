"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BlogCard_New from "@/components/BlogCard_New";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

const demoBlogs = [
    {
        _id: "1",
        title: "Getting Started with Modern Web Development",
        slug: "getting-started-modern-web-dev",
        excerpt:
            "Learn the fundamentals of modern web development, including React, TypeScript, and best practices for building scalable applications.",
        content: "Learn the fundamentals of modern web development...",
        tags: ["Web Development", "React", "TypeScript"],
        publishedAt: new Date().toISOString(),
        readingTime: 6,
        views: 4100,
    },
    {
        _id: "2",
        title: "The Art of Clean Code",
        slug: "art-of-clean-code",
        excerpt:
            "Discover principles and techniques for writing maintainable, readable code that your future self will thank you for.",
        content:
            "Discover principles and techniques for writing maintainable code...",
        tags: ["Best Practices", "Programming"],
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        readingTime: 8,
        views: 3200,
    },
    {
        _id: "3",
        title: "Yoga for Developers: Staying Healthy While Coding",
        slug: "yoga-for-developers",
        excerpt:
            "Maintaining physical health is crucial for developers who spend long hours at their desks. Discover yoga practices that can help.",
        content: "Maintaining physical health is crucial for developers...",
        tags: ["Lifestyle", "Health", "Yoga"],
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        readingTime: 5,
        views: 2800,
    },
    {
        _id: "4",
        title: "DSA Problem Solving: My Daily Approach",
        slug: "dsa-daily-approach",
        excerpt:
            "How I approach LeetCode problems daily and the mindset shifts that transformed my problem-solving ability.",
        content: "How I approach DSA problems daily...",
        tags: ["DSA", "Career & Learning", "Programming"],
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        readingTime: 7,
        views: 3300,
    },
    {
        _id: "5",
        title: "Meditation for Focus: A Developer's Guide",
        slug: "meditation-for-focus",
        excerpt:
            "Using mindfulness techniques to beat distraction, improve deep work, and stay mentally sharp through long coding sessions.",
        content: "Using mindfulness techniques to beat distraction...",
        tags: ["Life & Growth", "Wellness"],
        publishedAt: new Date(Date.now() - 345600000).toISOString(),
        readingTime: 4,
        views: 2100,
    },
    {
        _id: "6",
        title: "Getting Started with Modern Web Development",
        slug: "getting-started-modern-web-dev",
        excerpt:
            "Learn the fundamentals of modern web development, including React, TypeScript, and best practices for building scalable applications.",
        content: "Learn the fundamentals of modern web development...",
        tags: ["Web Development", "React", "TypeScript"],
        publishedAt: new Date().toISOString(),
        readingTime: 6,
        views: 4400,
    },
];

const categories = [
    {
        label: "[ tech ]",
        title: "Tech Deep-Dives",
        description: "Code, learning, technical writing",
        value: "tech-deep-dive",
        tags: [
            "Web Development",
            "React",
            "TypeScript",
            "DSA",
            "Programming",
            "Best Practices",
        ],
    },
    {
        label: "[ life ]",
        title: "Life & Growth",
        description: "Wellness, balance, real life",
        value: "life-growth",
        tags: ["Life & Growth", "Wellness", "Health", "Yoga", "Lifestyle"],
    },
    {
        label: "[ career ]",
        title: "Career & Learning",
        description: "Self-taught journey, lessons",
        value: "career-learning",
        tags: ["Career & Learning", "DSA"],
    },
];

export default function Search() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    const allTags = Array.from(
        new Set(demoBlogs.flatMap((blog) => blog.tags || [])),
    );

    const filteredBlogs = demoBlogs.filter((blog) => {
        const matchesSearch =
            !debouncedQuery ||
            blog.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            blog.excerpt?.toLowerCase().includes(debouncedQuery.toLowerCase());

        const matchesTags =
            selectedTags.length === 0 ||
            selectedTags.some((tag) => blog.tags?.includes(tag));

        return matchesSearch && matchesTags;
    });

    const popularBlogs = [...demoBlogs]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 9);

    const isFiltering = debouncedQuery || selectedTags.length > 0;
    const displayBlogs = isFiltering ? filteredBlogs : popularBlogs;

    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
            const found = categories.find((c) => c.value === categoryParam);
            if (found) {
                setActiveCategory(found.value);
                setSelectedTags(found.tags);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleCategoryClick = (category) => {
        if (activeCategory === category.value) {
            setActiveCategory(null);
            setSelectedTags([]);
            router.push("/search", { shallow: true });
        } else {
            setActiveCategory(category.value);
            setSelectedTags(category.tags);
            router.push(`/search?category=${category.value}`, {
                shallow: true,
            });
        }
    };

    const handleTagToggle = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
        );
        setActiveCategory(null);
    };

    const handleClearAll = () => {
        setSearchQuery("");
        setSelectedTags([]);
        setActiveCategory(null);
        router.push("/search", { shallow: true });
    };

    const hasActiveFilters = selectedTags.length > 0 || debouncedQuery;

    return (
        <div className="w-full min-h-screen">
            <div
                className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 py-12`}
            >
                {/* Hero */}
                <div className="mb-12 space-y-4">
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        — search
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif italic font-semibold leading-tight">
                        What are you looking for?
                    </h1>
                    <p className="font-reading text-base text-foreground/70 max-w-xl">
                        Thoughts on code, growth, and the self-taught journey.
                    </p>
                </div>

                {/* Search Input */}
                <div className="relative mb-10">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search articles..."
                        className="pl-11 pr-11 h-12 font-reading border-foreground/20 focus:border-foreground/50 bg-background"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Category Cards */}
                <section className="mb-10">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                            Browse by topic
                        </span>
                        <div className="flex-1 h-[1px] bg-border" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <div
                                key={category.value}
                                onClick={() => handleCategoryClick(category)}
                                className={`group cursor-pointer border p-5 transition-all duration-200 space-y-2 ${
                                    activeCategory === category.value
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-border hover:border-foreground/40"
                                }`}
                            >
                                <span
                                    className={`text-xs font-mono font-medium tracking-widest ${
                                        activeCategory === category.value
                                            ? "text-background/60"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    {category.label}
                                </span>
                                <h3 className="font-sans font-bold text-base">
                                    {category.title}
                                </h3>
                                <p
                                    className={`text-xs font-reading leading-relaxed ${
                                        activeCategory === category.value
                                            ? "text-background/70"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    {category.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tag Filter */}
                <section className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                                Filter
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 flex-1">
                            {allTags.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <Badge
                                        key={tag}
                                        variant={
                                            isSelected ? "default" : "outline"
                                        }
                                        className={`cursor-pointer ${DESIGN_CONSTANTS.transitions.fast}`}
                                        onClick={() => handleTagToggle(tag)}
                                    >
                                        {tag}
                                    </Badge>
                                );
                            })}
                        </div>

                        {isFiltering && (
                            <button
                                onClick={handleClearAll}
                                className={`flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast} flex-shrink-0`}
                            >
                                <X className="h-3.5 w-3.5" />
                                Clear all
                            </button>
                        )}
                    </div>
                </section>

                {/* Results Count */}
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        {isFiltering ? (
                            <>
                                <span className="text-foreground">
                                    {filteredBlogs.length}
                                </span>
                                {filteredBlogs.length === 1
                                    ? " article"
                                    : " articles"}
                                {debouncedQuery && (
                                    <>
                                        {" "}
                                        for "
                                        <span className="text-foreground">
                                            {debouncedQuery}
                                        </span>
                                        "
                                    </>
                                )}
                            </>
                        ) : (
                            "Popular reads"
                        )}
                    </span>
                    <div className="flex-1 h-[1px] bg-border" />
                </div>

                {/* Blog Grid */}
                {displayBlogs.length > 0 ? (
                    <div
                        className={`${DESIGN_CONSTANTS.grids.recentHighlights} ${DESIGN_CONSTANTS.spacing.cardGap}`}
                    >
                        {displayBlogs.map((blog) => (
                            <BlogCard_New key={blog._id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 space-y-3">
                        <p className="text-4xl font-mono font-bold text-muted-foreground/20">
                            ?
                        </p>
                        <p className="text-lg font-sans font-bold">
                            Nothing found
                        </p>
                        <p className="text-sm font-reading text-muted-foreground">
                            Try different keywords or clear your filters
                        </p>
                        <button
                            onClick={handleClearAll}
                            className={`text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4 ${DESIGN_CONSTANTS.transitions.fast}`}
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
