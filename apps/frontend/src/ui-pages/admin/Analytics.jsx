'use client';

import dynamic from 'next/dynamic';
import AdminLayout_New from '@/components/admin/AdminLayout_New';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import {
  useOverviewStats, useViews30d, useTopPosts,
  useCategoryBreakdown, usePersonalBest,
} from '@/hooks/api/admin/useAdminAnalytics';

// OPT: below-fold sections — dynamically imported
const ViewsSparkline      = dynamic(() => import('@/components/admin/ViewsSparkline'),      { loading: () => <div className="h-48 bg-muted animate-pulse rounded" /> });
const TopPostsTable       = dynamic(() => import('@/components/admin/TopPostsTable'),       { loading: () => <div className="h-48 bg-muted animate-pulse rounded" /> });
const CategoryBreakdown   = dynamic(() => import('@/components/admin/CategoryBreakdown'),   { loading: () => <div className="h-48 bg-muted animate-pulse rounded" /> });
const BestMoments         = dynamic(() => import('@/components/admin/BestMoments'),         { loading: () => <div className="h-40 bg-muted animate-pulse rounded" /> });

// ── Helpers ───────────────────────────────────────────────────

function formatNumber(num) {
  if (!num && num !== 0) return '—';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000)    return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// ── StatTile — above fold, stays inline ──────────────────────

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

// ── Main Page ─────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { data: overview,     isLoading: overviewLoading    } = useOverviewStats();
  const { data: views30d,     isLoading: viewsLoading        } = useViews30d();
  const { data: topPosts,     isLoading: topPostsLoading     } = useTopPosts();
  const { data: categories,   isLoading: categoriesLoading   } = useCategoryBreakdown();
  const { data: personalBest, isLoading: bestLoading         } = usePersonalBest();

  return (
    <AdminLayout_New>
      <div className="space-y-12">

        <div>
          <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">— analytics</span>
          <h1 className="text-3xl font-serif italic mt-1">Your Numbers</h1>
        </div>

        {/* 1. Stat tiles — above fold, static import */}
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
