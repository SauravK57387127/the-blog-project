'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout_New from '@/components/admin/AdminLayout_New';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import {
  useOverviewStats, useViews30d, useTopPosts,
  useCategoryBreakdown, usePersonalBest,
} from '@/hooks/api/admin/useAdminAnalytics';

// ── Helpers ───────────────────────────────────────────────────

function formatNumber(num) {
  if (!num && num !== 0) return '—';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000)    return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatTimeAgo(dateString) {
  if (!dateString) return '—';
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(dateString).toLocaleDateString();
}

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

// ── Components ────────────────────────────────────────────────

function StatTile({ title, value, sub, highlight = false, isLoading }) {
  return (
    <div className={`p-6 border-2 ${highlight ? 'border-foreground' : 'border-border'}`}>
      <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">{title}</span>
      {isLoading
        ? <div className="h-10 bg-muted animate-pulse rounded mt-3" />
        : <p className="text-4xl font-mono font-bold text-foreground mt-3">{value}</p>
      }
      {sub && <p className="text-xs font-mono text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function ViewsSparkline({ data, isLoading }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (isLoading) return <div className="h-48 bg-muted animate-pulse rounded" />;
  if (!data?.dailyViews?.length) return null;

  const views    = data.dailyViews;
  const maxViews = Math.max(...views.map(d => d.views));
  const minViews = Math.min(...views.map(d => d.views));
  const range    = maxViews - minViews || 1;
  const W = 1000, H = 120, PAD = 8;
  const barW = (W / views.length) - 3;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
            Views — last 30 days
          </span>
          <div className="h-[1px] bg-border w-8" />
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Total</p>
            <p className="text-sm font-mono font-bold">{formatNumber(data.totalViews)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Daily avg</p>
            <p className="text-sm font-mono font-bold">{formatNumber(data.dailyAverage)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Trend</p>
            <p className={`text-sm font-mono font-bold ${data.trend === 'growing' ? 'text-accent' : 'text-destructive/70'}`}>
              {data.trend === 'growing' ? '↑ growing' : '↓ declining'}
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full" style={{ height: `${H + 32}px` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: `${H}px` }} onMouseLeave={() => setHoveredIndex(null)}>
          {views.map((d, i) => {
            const x          = i * (W / views.length);
            const heightPct  = (d.views - minViews) / range;
            const barHeight  = Math.max(heightPct * (H - PAD * 2) + PAD, 4);
            const y          = H - barHeight;
            const isHovered  = hoveredIndex === i;
            return (
              <g key={i} onMouseEnter={() => setHoveredIndex(i)}>
                <rect x={x + 1} y={y} width={barW} height={barHeight}
                  className={`transition-all duration-100 ${isHovered ? 'fill-foreground' : 'fill-foreground/15'}`}
                />
              </g>
            );
          })}
        </svg>

        {hoveredIndex !== null && (
          <div className="absolute top-0 pointer-events-none"
            style={{
              left: `${(hoveredIndex / views.length) * 100}%`,
              transform: hoveredIndex > views.length * 0.7 ? 'translateX(-100%)' : 'translateX(8px)',
            }}
          >
            <div className="bg-foreground text-background text-[10px] font-mono px-2 py-1 whitespace-nowrap">
              {views[hoveredIndex].date} · {formatNumber(views[hoveredIndex].views)} views
            </div>
          </div>
        )}

        <div className="flex justify-between mt-2">
          {[0, Math.floor(views.length / 2), views.length - 1].map(i => (
            <span key={i} className="text-[10px] font-mono text-muted-foreground/50">
              {views[i]?.date?.slice(5)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopPostsTable({ posts, isLoading }) {
  if (isLoading) return <div className="h-48 bg-muted animate-pulse rounded" />;
  if (!posts?.length) return <p className="text-sm font-mono text-muted-foreground">No data yet.</p>;

  // Backend returns views180d as formatted string e.g. "5.4k" — parse for bar width
  function parseViews(v) {
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      if (v.endsWith('k')) return parseFloat(v) * 1000;
      if (v.endsWith('M')) return parseFloat(v) * 1000000;
      return parseFloat(v) || 0;
    }
    return 0;
  }

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
              <span
                onClick={() => window.open(`/blog/${post.slug ?? ''}`, '_blank')}
                className={`relative flex-1 min-w-0 font-sans font-semibold text-sm line-clamp-1 hover:text-accent cursor-pointer ${DESIGN_CONSTANTS.transitions.fast}`}
              >
                {post.title}
              </span>
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

function CategoryBreakdown({ data, isLoading }) {
  if (isLoading) return <div className="h-48 bg-muted animate-pulse rounded" />;
  if (!data?.length) return null;

  // Filter to main 3 categories only
  const MAIN_CATS = ['tech-deep-dive', 'life-and-growth', 'career-and-learnings', 'Technology', 'Web Development', 'Tutorial'];
  const filtered  = data.filter(d => MAIN_CATS.includes(d.category)).slice(0, 3);
  if (!filtered.length) return null;

  function parseNum(v) {
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      if (v.endsWith('k')) return parseFloat(v) * 1000;
      if (v.endsWith('M')) return parseFloat(v) * 1000000;
      return parseFloat(v) || 0;
    }
    return 0;
  }

  const totalViews = filtered.reduce((sum, d) => sum + parseNum(d.totalViews), 0);

  const LABELS = {
    'tech-deep-dive':       { short: '[ tech ]',   label: 'Tech Deep Dive' },
    'life-and-growth':      { short: '[ life ]',   label: 'Life & Growth' },
    'career-and-learnings': { short: '[ career ]', label: 'Career & Learnings' },
    Technology:             { short: '[ tech ]',   label: 'Technology' },
    'Web Development':      { short: '[ web ]',    label: 'Web Development' },
    Tutorial:               { short: '[ guide ]',  label: 'Tutorial' },
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">Category Breakdown</span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-foreground divide-y-2 md:divide-y-0 md:divide-x-2 divide-foreground">
        {filtered.map((item) => {
          const views    = parseNum(item.totalViews);
          const sharePct = totalViews > 0 ? Math.round((views / totalViews) * 100) : 0;
          const meta     = LABELS[item.category] ?? { short: `[ ${item.category} ]`, label: item.category };
          return (
            <div key={item.category} className="p-6 space-y-4">
              <div>
                <span className="text-xs font-mono font-medium tracking-widest text-muted-foreground">{meta.short}</span>
                <h3 className="font-sans font-bold text-base mt-1">{meta.label}</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Total views</p>
                  <p className="text-2xl font-mono font-bold">{item.totalViews}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Posts</p>
                    <p className="text-base font-mono font-bold">{item.totalPosts}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Avg / post</p>
                    <p className="text-base font-mono font-bold">{item.avgViewsPerPost}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-mono text-muted-foreground">Share of total views</span>
                  <span className="text-[10px] font-mono font-bold">{item.percentage ?? sharePct}%</span>
                </div>
                <div className="h-[3px] bg-muted w-full">
                  <div className="h-full bg-foreground/50 transition-all duration-500" style={{ width: `${item.percentage ?? sharePct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BestMoments({ data, isLoading }) {
  if (isLoading) return <div className="h-40 bg-muted animate-pulse rounded" />;
  if (!data) return null;

  const { bestDay, bestMonth } = data;
  if (!bestDay && !bestMonth) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">Personal Bests</span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-foreground divide-y-2 md:divide-y-0 md:divide-x-2 divide-foreground">
        <div className="p-6 border-l-4 border-l-accent">
          <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">Best day ever</span>
          <p className="text-4xl font-mono font-bold mt-3">{bestDay?.views ?? '—'}</p>
          <p className="text-xs font-mono text-muted-foreground mt-1">views on {bestDay?.date ?? '—'}</p>
          {bestDay?.blogTitle && (
            <p className="font-reading text-sm text-foreground/70 mt-3 italic line-clamp-1">"{bestDay.blogTitle}"</p>
          )}
        </div>
        <div className="p-6 border-l-4 border-l-foreground/30">
          <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">Best month ever</span>
          <p className="text-4xl font-mono font-bold mt-3">{bestMonth?.views ?? '—'}</p>
          <p className="text-xs font-mono text-muted-foreground mt-1">views in {bestMonth?.month ?? '—'}</p>
          {bestMonth?.postsPublished != null && (
            <p className="font-reading text-sm text-foreground/70 mt-3 italic">
              {bestMonth.postsPublished} posts published that month
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) router.replace('/admin/login');
  }, []);

  const { data: overview,   isLoading: overviewLoading   } = useOverviewStats();
  const { data: views30d,   isLoading: viewsLoading       } = useViews30d();
  const { data: topPosts,   isLoading: topPostsLoading    } = useTopPosts();
  const { data: categories, isLoading: categoriesLoading  } = useCategoryBreakdown();
  const { data: personalBest, isLoading: bestLoading      } = usePersonalBest();

  return (
    <AdminLayout_New>
      <div className="space-y-12">

        <div>
          <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">— analytics</span>
          <h1 className="text-3xl font-serif italic mt-1">Your Numbers</h1>
        </div>

        {/* 1. Stat tiles */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            title="Total Views" highlight
            value={formatNumber(overview?.totalViews)}
            sub="all-time"
            isLoading={overviewLoading}
          />
          <StatTile
            title="Published Posts"
            value={overview?.publishedPosts ?? '—'}
            sub="articles live"
            isLoading={overviewLoading}
          />
          <StatTile
            title="Avg Read Time"
            value={overview?.avgReadTime ?? '—'}
            sub="per article"
            isLoading={overviewLoading}
          />
          <StatTile
            title="Subscribers"
            value={overview?.subscribers?.total ?? '—'}
            sub={overview?.subscribers?.newThisMonth != null ? `+${overview.subscribers.newThisMonth} this month` : ''}
            isLoading={overviewLoading}
          />
        </section>

        {/* 2. Views sparkline */}
        <section>
          <ViewsSparkline data={views30d} isLoading={viewsLoading} />
        </section>

        {/* 3. Top posts */}
        <section>
          <TopPostsTable posts={topPosts} isLoading={topPostsLoading} />
        </section>

        {/* 4. Category breakdown */}
        <section>
          <CategoryBreakdown data={categories} isLoading={categoriesLoading} />
        </section>

        {/* 5. Personal bests */}
        <section>
          <BestMoments data={personalBest} isLoading={bestLoading} />
        </section>

      </div>
    </AdminLayout_New>
  );
}
