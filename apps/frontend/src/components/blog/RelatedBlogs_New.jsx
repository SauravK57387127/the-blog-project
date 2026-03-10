"use client";

import Link from "next/link";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

const demoRelatedBlogs = [
  {
    _id: "r1",
    slug: "react-server-components-guide",
    title: "A Complete Guide to React Server Components",
    excerpt: "Deep dive into React Server Components and how they're changing the way we build applications.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    tags: ["React", "Performance"],
    category: "tech-deep-dive",
    readingTime: 8,
  },
  {
    _id: "r2",
    slug: "ai-powered-development-tools",
    title: "Top AI-Powered Development Tools in 2025",
    excerpt: "Explore the best AI tools that are transforming how developers work today.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    tags: ["AI", "Tools"],
    category: "tech-deep-dive",
    readingTime: 6,
  },
  {
    _id: "r3",
    slug: "web-performance-optimization",
    title: "Web Performance Optimization: Best Practices",
    excerpt: "Learn essential techniques to make your websites faster and more efficient.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    tags: ["Performance"],
    category: "career-and-learnings",
    readingTime: 7,
  },
  {
    _id: "r4",
    slug: "typescript-tips-beginners",
    title: "TypeScript Tips Every Beginner Should Know",
    excerpt: "Practical TypeScript patterns that will make your code safer and more maintainable.",
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop",
    tags: ["TypeScript"],
    category: "life-and-growth",
    readingTime: 5,
  },
  {
    _id: "r5",
    slug: "building-better-habits",
    title: "Building Better Habits as a Developer",
    excerpt: "Small consistent actions compound into extraordinary results over time.",
    coverImage: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&h=400&fit=crop",
    tags: ["Life"],
    category: "life-and-growth",
    readingTime: 4,
  },
];

const CATEGORY_SHORT = {
  "tech-deep-dive": "tech",
  "life-and-growth": "life",
  "career-and-learnings": "career",
};

// ─── Card Types ───────────────────────────────────────────────

// Big card — image with gradient overlay, title on image
function BigCard({ blog }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group block relative overflow-hidden bg-muted h-full min-h-[280px]">
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content on image */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
            [ {CATEGORY_SHORT[blog.category] || blog.tags[0]} ]
          </span>
          <span className="text-[10px] font-mono text-white/40">·</span>
          <span className="text-[10px] font-mono text-white/60">{blog.readingTime} min read</span>
        </div>
        <h3 className={`font-sans font-bold text-white text-lg leading-snug group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
          {blog.title}
        </h3>
      </div>

      {/* Accent border on hover */}
      <div className={`absolute bottom-0 left-0 w-0 h-[3px] bg-accent group-hover:w-full ${DESIGN_CONSTANTS.transitions.smooth}`} />
    </Link>
  );
}

// Text-only card — giant faded category word as texture
function TextCard({ blog }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group flex gap-3 p-4 h-full items-center">
  {/* Text */}
  <div className="flex-1 min-w-0 space-y-1">
    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
      [ {CATEGORY_SHORT[blog.category] || blog.tags[0]} ] · {blog.readingTime} min
    </span>
    <h3 className={`font-sans font-semibold text-sm leading-snug line-clamp-2 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
      {blog.title}
    </h3>
  </div>

  {/* Thumbnail */}
  <div className="w-20 h-14 flex-shrink-0 overflow-hidden bg-muted">
    {blog.coverImage
      ? <img src={blog.coverImage} alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      : <div className="w-full h-full bg-muted" />
    }
  </div>
</Link>
  );
}

// Horizontal card — accent left border + thumbnail right
function HorizontalCard({ blog }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group flex gap-4 border-l-4 border-border hover:border-accent pl-4 py-2 transition-all duration-200">

      {/* Text */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
  [ {CATEGORY_SHORT[blog.category] || blog.tags[0]} ] · {blog.readingTime} min read
</span>
        <h3 className={`font-sans font-semibold text-sm leading-snug line-clamp-2 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
          {blog.title}
        </h3>
        <p className="text-xs font-reading text-foreground/50 line-clamp-1">
          {blog.excerpt}
        </p>
      </div>

      {/* Thumbnail */}
      {blog.coverImage && (
        <div className="w-20 h-16 flex-shrink-0 overflow-hidden bg-muted">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────

export default function RelatedBlogs_New({ currentBlogId, tags }) {
  // TODO: Replace with React Query
  // const { data: relatedBlogs } = useQuery(['relatedBlogs', tags], () => fetchRelatedBlogs(tags))
  const relatedBlogs = demoRelatedBlogs;

  if (!relatedBlogs || relatedBlogs.length === 0) return null;

  const [big, second, third, fourth, fifth] = relatedBlogs;

  return (
    <section className="py-12 lg:py-16 border-t border-border">

      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
          Read Next
        </span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>

      {/* ── Row 1: Big card + 2 text cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-border mb-0">

        {/* Big card — 3 cols */}
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-border">
          <BigCard blog={big} />
        </div>

        {/* 2 text-only cards — stacked in 2 cols */}
        <div className="lg:col-span-2 flex flex-col divide-y divide-border">
          {second && <TextCard blog={second} />}
          {third  && <TextCard blog={third}  />}
        </div>
      </div>

      {/* ── Row 2: 2 horizontal cards side by side ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-l border-r border-b border-border divide-y sm:divide-y-0 sm:divide-x divide-border">
        <div className="p-5">
          {fourth && <HorizontalCard blog={fourth} />}
        </div>
        <div className="p-5">
          {fifth  && <HorizontalCard blog={fifth}  />}
        </div>
      </div>

    </section>
  );
}
