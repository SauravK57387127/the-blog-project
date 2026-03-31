'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Globe, FileText, ArrowRight } from 'lucide-react';
import AdminLayout_New from '@/components/admin/AdminLayout_New';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import {
  useWritingStreak, useSidebarStats, useRecentDraft,
  useScheduledUpcoming, useStaleDrafts,
} from '@/hooks/api/admin/useAdminHome';

// ── Helpers ───────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatScheduledDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getDaysStale(dateString) {
  return Math.floor((Date.now() - new Date(dateString).getTime()) / (24 * 60 * 60 * 1000));
}

function getNextSlotDate(scheduled) {
  if (!scheduled?.length) return null;
  const last = new Date(scheduled[scheduled.length - 1].scheduledFor);
  last.setDate(last.getDate() + 7);
  return last.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Sub-components ────────────────────────────────────────────

function QuickActions({ onNewPost, onViewBlog, onDrafts }) {
  const actions = [
    { label: 'New Post',   descriptor: '+ start writing', icon: Plus,     onClick: onNewPost },
    { label: 'View Blog',  descriptor: '→ live site',     icon: Globe,    onClick: onViewBlog },
    { label: 'Drafts',     descriptor: 'edit existing',   icon: FileText, onClick: onDrafts },
  ];
  return (
    <div className="grid grid-cols-3 border-2 border-foreground divide-x-2 divide-foreground">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`group flex flex-col items-start gap-2 p-5 hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast}`}
          >
            <Icon className="h-5 w-5" />
            <div>
              <p className="font-sans font-bold text-sm uppercase tracking-wide">{action.label}</p>
              <p className={`text-xs font-mono text-muted-foreground group-hover:text-background/60 ${DESIGN_CONSTANTS.transitions.fast}`}>
                {action.descriptor}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── WritingStreak — receives real data via props ──────────────

function WritingStreak() {
  const [view, setView] = useState('monthly');
  const [hoveredDay, setHoveredDay] = useState(null);

  const { data: streakData, isLoading: streakLoading }   = useWritingStreak(
    view === 'monthly' ? 'month' : view === 'weekly' ? 'week' : 'year'
  );
  const { data: sidebarData, isLoading: sidebarLoading } = useSidebarStats(
    view === 'monthly' ? 'month' : view === 'weekly' ? 'week' : 'year'
  );

  // ── Activity level helpers ────────────────────────────────
  function getActivityLevel(day) {
    const published = day.published ?? 0;
    const scheduled = day.scheduled ?? 0;
    const drafted   = day.drafted   ?? 0;
    if (published > 0 && (scheduled > 0 || drafted > 0)) return 4;
    if (published > 0) return 3;
    if (scheduled > 0) return 2;
    if (drafted   > 0) return 1;
    return 0;
  }

  function getLevelClass(level) {
    switch (level) {
      case 4: return 'bg-accent border-accent';
      case 3: return 'bg-accent/70 border-accent/60';
      case 2: return 'bg-accent/40 border-accent/30';
      case 1: return 'bg-accent/20 border-accent/15';
      default: return 'bg-muted border-border';
    }
  }

  function getLevelLabel(day) {
    const parts = [];
    if (day.published > 0) parts.push(`${day.published} published`);
    if (day.scheduled > 0) parts.push(`${day.scheduled} scheduled`);
    if (day.drafted   > 0) parts.push(`${day.drafted} drafted`);
    return parts.length > 0 ? parts.join(' · ') : 'no activity';
  }

  // ── Build view-specific data from backend response ────────

  const rawDays = streakData?.data ?? [];

  const monthlyData = (() => {
    const weeks = [];
    for (let i = 0; i < rawDays.length; i += 7) weeks.push(rawDays.slice(i, i + 7));
    return weeks;
  })();

  const weeklyData = rawDays.map((week, wi) => ({
    label:  new Date(week.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total:  week.totalActivity ?? 0,
    weekIndex: wi,
  }));

  // Yearly — backend gives { month, totalActivity }
  // Map totalActivity to published so stacked bar renders
  const yearlyData = rawDays.map((m, mi) => ({
    label:     m.month?.split(' ')[0] ?? '',   // "Jan 2026" → "Jan"
    published: m.totalActivity ?? 0,
    scheduled: 0,
    drafted:   0,
    monthIndex: mi,
  }));

  // ── Stats from sidebar endpoint ───────────────────────────
  const activeDays     = sidebarData?.last28d?.activeDays    ?? 0;
  const currentStreak  = sidebarData?.last28d?.currentStreak ?? 0;
  const longestStreak  = sidebarData?.last28d?.longestStreak ?? 0;

  // Monthly top days
  const topDays = sidebarData?.topDaysThisMonth ?? [];

  // Weekly sidebar
  const last12Weeks = sidebarData?.last12Weeks ?? {};

  // Yearly sidebar
  const thisYear = sidebarData?.thisYear ?? {};

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const isLoading = streakLoading || sidebarLoading;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
            Writing Streak
          </span>
          <div className="h-[1px] bg-border w-8" />
        </div>
        <div className="flex items-center gap-0 border border-border">
          {['weekly', 'monthly', 'yearly'].map((v, i) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest ${DESIGN_CONSTANTS.transitions.fast} ${i < 2 ? 'border-r border-border' : ''} ${
                view === v ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-32 bg-muted animate-pulse rounded" />
      ) : (
        <div className="grid grid-cols-5 gap-8 items-start">

          {/* Left — Graph (60%) */}
          <div className="col-span-3">

            {/* Monthly tiles */}
            {view === 'monthly' && (
              <div className="space-y-1.5">
                <div className="grid grid-cols-7 gap-1.5 mb-1">
                  {dayLabels.map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-mono text-muted-foreground/40">{d}</div>
                  ))}
                </div>
                {monthlyData.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 gap-1.5">
                    {week.map((day, di) => {
                      const level     = getActivityLevel(day);
                      const isHovered = hoveredDay?.date === day.date;
                      return (
                        <div
                          key={di}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`relative aspect-square border ${getLevelClass(level)} transition-all duration-150 ${isHovered ? 'scale-110 z-10' : ''}`}
                        >
                          {isHovered && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                              <div className="bg-foreground text-background text-[10px] font-mono px-2 py-1 whitespace-nowrap">
                                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {getLevelLabel(day)}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div className="flex items-center gap-4 pt-3">
                  {[
                    { label: 'Published + more', level: 4 },
                    { label: 'Published',         level: 3 },
                    { label: 'Scheduled',         level: 2 },
                    { label: 'Draft only',        level: 1 },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 flex-shrink-0 border ${getLevelClass(item.level)}`} />
                      <span className="text-[10px] font-mono text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly bars */}
            {view === 'weekly' && (
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  {weeklyData.map((week, wi) => {
                    const maxTotal     = Math.max(...weeklyData.map(w => w.total), 1);
                    const heightPercent = (week.total / maxTotal) * 100;
                    const isHovered    = hoveredDay?.weekIndex === wi;
                    return (
                      <div
                        key={wi}
                        className="flex-1 flex flex-col items-center gap-1"
                        onMouseEnter={() => setHoveredDay({ weekIndex: wi, ...week })}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        <div className="relative w-full flex flex-col justify-end" style={{ height: '80px' }}>
                          {isHovered && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                              <div className="bg-foreground text-background text-[10px] font-mono px-2 py-1 whitespace-nowrap">
                                {week.label} · {week.total} activities
                              </div>
                            </div>
                          )}
                          <div
                            className={`w-full border transition-all duration-200 ${
                              week.total > 0 ? 'bg-accent/60 border-accent/40' : 'bg-muted border-border'
                            } ${isHovered ? 'bg-accent border-accent' : ''}`}
                            style={{ height: `${Math.max(heightPercent, week.total > 0 ? 8 : 4)}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground/50">
                          {week.label.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Yearly bars */}
            {view === 'yearly' && (
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  {yearlyData.map((month, mi) => {
                    const total        = month.published + month.scheduled + month.drafted;
                    const maxTotal     = Math.max(...yearlyData.map(m => m.published + m.scheduled + m.drafted), 1);
                    const heightPercent = (total / maxTotal) * 100;
                    const isHovered    = hoveredDay?.monthIndex === mi;
                    return (
                      <div
                        key={mi}
                        className="flex-1 flex flex-col items-center gap-1"
                        onMouseEnter={() => setHoveredDay({ monthIndex: mi, ...month })}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        <div className="relative w-full flex flex-col justify-end" style={{ height: '80px' }}>
                          {isHovered && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                              <div className="bg-foreground text-background text-[10px] font-mono px-2 py-1 whitespace-nowrap">
                                {month.label} · {total} total
                              </div>
                            </div>
                          )}
                          <div className="w-full flex flex-col justify-end border border-border overflow-hidden" style={{ height: `${Math.max(heightPercent, total > 0 ? 8 : 4)}%` }}>
                            {month.published > 0 && <div className="w-full bg-accent"     style={{ flex: month.published }} />}
                            {month.scheduled > 0 && <div className="w-full bg-accent/50"  style={{ flex: month.scheduled }} />}
                            {month.drafted   > 0 && <div className="w-full bg-accent/20"  style={{ flex: month.drafted   }} />}
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground/50">{month.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right — Stats panel (40%) */}
          <div className="col-span-2 space-y-6 border-l border-border pl-8">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Active days (28d)</p>
                <p className="text-2xl font-mono font-bold mt-0.5">{activeDays} <span className="text-sm text-muted-foreground font-normal">/ 28</span></p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Current streak</p>
                <p className="text-2xl font-mono font-bold mt-0.5">{currentStreak} <span className="text-sm text-muted-foreground font-normal">days</span></p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Longest streak</p>
                <p className="text-2xl font-mono font-bold mt-0.5">{longestStreak} <span className="text-sm text-muted-foreground font-normal">days</span></p>
              </div>
            </div>

            {/* Monthly panel */}
            {view === 'monthly' && topDays.length > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Top days this month</p>
                <div className="space-y-2">
                  {topDays.map((day, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground/40 w-3">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-foreground">{day.day}</p>
                        <p className="text-[10px] font-mono text-muted-foreground truncate">{day.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly panel */}
            {view === 'weekly' && (
              <div className="pt-4 border-t border-border">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Last 12 weeks</p>
                <div className="space-y-1">
                  {[
                    { label: 'Most active week', value: last12Weeks.mostActiveWeek ?? '—' },
                    { label: 'Avg per week',      value: last12Weeks.averagePostsPerWeek ? `${last12Weeks.averagePostsPerWeek} posts` : '—' },
                    { label: 'Active weeks',      value: last12Weeks.activeWeeks ?? '—' },
                  ].map(stat => (
                    <div key={stat.label}>
                      <p className="text-[10px] font-mono text-muted-foreground">{stat.label}</p>
                      <p className="text-xs font-mono font-medium text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yearly panel */}
            {view === 'yearly' && (
              <div className="pt-4 border-t border-border">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">This year</p>
                <div className="space-y-1">
                  {[
                    { label: 'Total published', value: thisYear.totalPublished != null ? `${thisYear.totalPublished} posts`  : '—' },
                    { label: 'Total scheduled', value: thisYear.totalScheduled != null ? `${thisYear.totalScheduled} posts`  : '—' },
                    { label: 'Total drafted',   value: thisYear.totalDrafts    != null ? `${thisYear.totalDrafts} drafts`    : '—' },
                    { label: 'Best month',      value: thisYear.bestMonth ?? '—' },
                  ].map(stat => (
                    <div key={stat.label}>
                      <p className="text-[10px] font-mono text-muted-foreground">{stat.label}</p>
                      <p className="text-xs font-mono font-medium text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── PickUpDraft ───────────────────────────────────────────────

function PickUpDraft({ draft, onContinue }) {
  if (!draft) return (
    <p className="text-sm font-reading text-muted-foreground italic">No drafts in progress.</p>
  );
  return (
    <div onClick={() => onContinue(draft.draftSlug)} className="group cursor-pointer border-l-4 border-foreground pl-6 py-2">
      <span className="text-xs font-mono text-muted-foreground">
        — last opened {draft.lastOpened}
      </span>
      <div className="flex items-start justify-between gap-6 mt-3">
        <h2 className="text-2xl font-serif italic leading-snug group-hover:text-accent transition-colors duration-200 flex-1">
          {draft.title}
        </h2>
        {draft.wordCount && (
          <span className="font-mono text-sm text-muted-foreground flex-shrink-0 mt-1">
            {draft.wordCount} words
          </span>
        )}
      </div>
      {draft.excerpt && (
        <p className="font-reading text-sm text-foreground/60 mt-2 line-clamp-1">{draft.excerpt}</p>
      )}
      <div className="inline-flex items-center gap-2 mt-4 text-sm font-medium">
        <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-foreground after:transition-all after:duration-300 group-hover:after:w-full">
          Continue writing
        </span>
        <ArrowRight className="h-4 w-4 opacity-60" />
      </div>
    </div>
  );
}

// ── ScheduledTimeline ─────────────────────────────────────────

function ScheduledTimeline({ scheduled, nextSlotDate }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">Coming Up</span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>
      <div className="relative">
        <div className="absolute left-[52px] top-0 bottom-0 w-[1px] bg-border" />
        <div className="space-y-0">
          {scheduled.map((item) => (
            <div key={item._id} className="flex items-center gap-4 py-3">
              <span className="text-xs font-mono text-muted-foreground w-12 flex-shrink-0 text-right">
                {formatScheduledDate(item.scheduledFor)}
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-foreground flex-shrink-0 z-10" />
              <p className="font-sans text-sm font-medium line-clamp-1 flex-1">{item.title}</p>
            </div>
          ))}
          {nextSlotDate && (
            <div className="flex items-center gap-4 py-3">
              <span className="text-xs font-mono text-muted-foreground/40 w-12 flex-shrink-0 text-right">{nextSlotDate}</span>
              <div className="w-2.5 h-2.5 rounded-full border border-dashed border-muted-foreground/30 flex-shrink-0 z-10" />
              <p className="font-reading text-sm text-muted-foreground/50 italic">slot available — write something?</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── StaleDrafts ───────────────────────────────────────────────

function StaleDrafts({ drafts, onEdit }) {
  const MAX_STALE_DAYS = 45;
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">Needs Attention</span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>
      <div className="space-y-0">
        {drafts.map((draft) => {
          // Backend sends lastUpdated as "3d ago" string — compute daysStale from updatedAt if available
          const daysStale   = draft.updatedAt ? getDaysStale(draft.updatedAt) : parseInt(draft.lastUpdated) || 0;
          const fillPercent = Math.min((daysStale / MAX_STALE_DAYS) * 100, 100);
          const isVeryStale = daysStale >= 21;
          return (
            <div
              key={draft._id}
              onClick={() => onEdit(draft.draftSlug)}
              className={`group cursor-pointer flex items-center gap-4 py-4 border-b border-border last:border-0 hover:bg-muted/20 ${DESIGN_CONSTANTS.transitions.fast} -mx-1 px-1`}
            >
              <div className="flex-1 min-w-0">
                <p className={`font-sans font-medium text-sm line-clamp-1 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
                  {draft.title}
                </p>
                <div className="mt-2 h-[3px] w-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isVeryStale ? 'bg-destructive/50' : 'bg-foreground/30'}`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>
              <span className={`text-xs font-mono flex-shrink-0 ${isVeryStale ? 'text-destructive/70' : 'text-muted-foreground'}`}>
                {draft.lastUpdated}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function AdminHomePage() {
  const router = useRouter();

  // Client-side admin guard
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) router.replace('/admin/login');
  }, []);

  const { data: recentDraft,    isLoading: draftLoading     } = useRecentDraft();
  const { data: scheduledBlogs, isLoading: scheduledLoading } = useScheduledUpcoming();
  const { data: staleDrafts,    isLoading: staleLoading     } = useStaleDrafts();

  const nextSlot = getNextSlotDate(scheduledBlogs ?? []);

  return (
    <AdminLayout_New>
      <div className="space-y-12">

        {/* Greeting */}
        <div>
          <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <h1 className="text-4xl font-serif italic mt-2">{getGreeting()}, Saurav.</h1>
        </div>

        {/* 1. Quick Actions */}
        <section>
          <QuickActions
            onNewPost={() => router.push('/admin/blogs/new')}
            onViewBlog={() => window.open('/', '_blank')}
            onDrafts={() => router.push('/admin/drafts')}
          />
        </section>

        {/* 2. Writing Streak */}
        <section>
          <WritingStreak />
        </section>

        {/* 3. Pick Up Where You Left Off */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
              Pick Up Where You Left Off
            </span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>
          {draftLoading
            ? <div className="h-24 bg-muted animate-pulse rounded" />
            : <PickUpDraft draft={recentDraft} onContinue={(id) => router.push(`/admin/drafts/${id}`)} />
          }
        </section>

        {/* 4 + 5. Scheduled Timeline + Stale Drafts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {scheduledLoading
            ? <div className="h-48 bg-muted animate-pulse rounded" />
            : <ScheduledTimeline scheduled={scheduledBlogs ?? []} nextSlotDate={nextSlot} />
          }
          {staleLoading
            ? <div className="h-48 bg-muted animate-pulse rounded" />
            : <StaleDrafts drafts={staleDrafts ?? []} onEdit={(id) => router.push(`/admin/drafts/${draftSlug}`)} />
          }
        </section>

      </div>
    </AdminLayout_New>
  );
}
