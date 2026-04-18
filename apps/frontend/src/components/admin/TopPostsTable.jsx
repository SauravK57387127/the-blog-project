'use client';

import { DESIGN_CONSTANTS } from '@/lib/design-constants';

const CATEGORY_LABELS = {
  'tech-deep-dive':        '[ tech ]',
  'life-and-growth':       '[ life ]',
  'career-and-learnings':  '[ career ]',
  Technology:              '[ tech ]',
  'Web Development':       '[ web ]',
  Tutorial:                '[ guide ]',
  'Best Practices':        '[ best ]',
  DevOps:                  '[ devops ]',
};

function parseViews(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    if (v.endsWith('k')) return parseFloat(v) * 1000;
    if (v.endsWith('M')) return parseFloat(v) * 1000000;
    return parseFloat(v) || 0;
  }
  return 0;
}

export default function TopPostsTable({ posts, isLoading }) {
  if (isLoading) return <div className="h-48 bg-muted animate-pulse rounded" />;
  if (!posts?.length) return <p className="text-sm font-mono text-muted-foreground">No data yet.</p>;

  const maxViews = Math.max(...posts.map(p => parseViews(p.totalViews)));

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
          Top Performing Posts
        </span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>
      <div>
        {posts.map((post, i) => {
          const fillPct = (parseViews(post.totalViews) / maxViews) * 100;
          return (
            <div key={post._id} className="relative flex items-center gap-4 py-4 border-b border-border last:border-0 overflow-hidden group">
              <div className="absolute inset-0 bg-muted/40 transition-all duration-500" style={{ width: `${fillPct}%` }} />
              <span className="relative text-2xl font-mono font-bold text-foreground/10 w-8 flex-shrink-0 text-right">{i + 1}</span>
              <a
                href={`/blog/${post.slug ?? ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative flex-1 min-w-0 font-sans font-semibold text-sm line-clamp-1 hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}
              >
                {post.title}
              </a>
              <span className="relative text-xs font-mono text-muted-foreground flex-shrink-0 hidden sm:block">
                {CATEGORY_LABELS[post.category] ?? `[ ${post.category} ]`}
              </span>
              <span className="relative text-xs font-mono text-muted-foreground flex-shrink-0 hidden md:block w-16 text-right">
                {post.publishedAt}
              </span>
              <span className="relative text-sm font-mono font-bold flex-shrink-0 w-14 text-right">
                {post.totalViews}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
