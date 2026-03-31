'use client';

import Link from 'next/link';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import { useRelatedBlogs } from '@/hooks/api/public/useBlog';

const CATEGORY_SHORT = {
  'tech-deep-dive':     'tech',
  'life-and-growth':    'life',
  'career-and-learnings': 'career',
  Technology:           'tech',
  'Web Development':    'web',
  Tutorial:             'guide',
  DevOps:               'devops',
};

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
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
            [ {CATEGORY_SHORT[blog.category] || blog.tags?.[0]} ]
          </span>
          <span className="text-[10px] font-mono text-white/40">·</span>
          <span className="text-[10px] font-mono text-white/60">{blog.readingTime || 0} min read</span>
        </div>
        <h3 className={`font-sans font-bold text-white text-lg leading-snug group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
          {blog.title}
        </h3>
      </div>
      <div className={`absolute bottom-0 left-0 w-0 h-[3px] bg-accent group-hover:w-full ${DESIGN_CONSTANTS.transitions.smooth}`} />
    </Link>
  );
}

function TextCard({ blog }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group flex gap-3 p-4 h-full items-center">
      <div className="flex-1 min-w-0 space-y-1">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          [ {CATEGORY_SHORT[blog.category] || blog.tags?.[0]} ] · {blog.readingTime || 0} min
        </span>
        <h3 className={`font-sans font-semibold text-sm leading-snug line-clamp-2 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
          {blog.title}
        </h3>
      </div>
      <div className="w-20 h-14 flex-shrink-0 overflow-hidden bg-muted">
        {blog.coverImage
          ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full bg-muted" />
        }
      </div>
    </Link>
  );
}

function HorizontalCard({ blog }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group flex gap-4 border-l-4 border-border hover:border-accent pl-4 py-2 transition-all duration-200">
      <div className="flex-1 min-w-0 space-y-1.5">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          [ {CATEGORY_SHORT[blog.category] || blog.tags?.[0]} ] · {blog.readingTime || 0} min read
        </span>
        <h3 className={`font-sans font-semibold text-sm leading-snug line-clamp-2 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
          {blog.title}
        </h3>
        <p className="text-xs font-reading text-foreground/50 line-clamp-1">
          {blog.excerpt}
        </p>
      </div>
      {blog.coverImage && (
        <div className="w-20 h-16 flex-shrink-0 overflow-hidden bg-muted">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
    </Link>
  );
}

export default function RelatedBlogs_New({ slug }) {
  const { data: relatedBlogs = [], isLoading } = useRelatedBlogs(slug);

  if (isLoading || relatedBlogs.length === 0) return null;

  const [big, second, third, fourth, fifth] = relatedBlogs;

  return (
    <section className="py-12 lg:py-16 border-t border-border">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
          Read Next
        </span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>

      {/* Row 1: Big card + 2 text cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-border mb-0">
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-border">
          <BigCard blog={big} />
        </div>
        <div className="lg:col-span-2 flex flex-col divide-y divide-border">
          {second && <TextCard blog={second} />}
          {third  && <TextCard blog={third}  />}
        </div>
      </div>

      {/* Row 2: 2 horizontal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-l border-r border-b border-border divide-y sm:divide-y-0 sm:divide-x divide-border">
        <div className="p-5">{fourth && <HorizontalCard blog={fourth} />}</div>
        <div className="p-5">{fifth  && <HorizontalCard blog={fifth}  />}</div>
      </div>
    </section>
  );
}
