'use client';

const MAIN_CATS = ['tech-deep-dive', 'life-and-growth', 'career-and-learnings', 'Technology', 'Web Development', 'Tutorial'];

const LABELS = {
  'tech-deep-dive':       { short: '[ tech ]',   label: 'Tech Deep Dive' },
  'life-and-growth':      { short: '[ life ]',   label: 'Life & Growth' },
  'career-and-learnings': { short: '[ career ]', label: 'Career & Learnings' },
  Technology:             { short: '[ tech ]',   label: 'Technology' },
  'Web Development':      { short: '[ web ]',    label: 'Web Development' },
  Tutorial:               { short: '[ guide ]',  label: 'Tutorial' },
};

function parseNum(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    if (v.endsWith('k')) return parseFloat(v) * 1000;
    if (v.endsWith('M')) return parseFloat(v) * 1000000;
    return parseFloat(v) || 0;
  }
  return 0;
}

export default function CategoryBreakdown({ data, isLoading }) {
  if (isLoading) return <div className="h-48 bg-muted animate-pulse rounded" />;
  if (!data?.length) return null;

  const filtered   = data.filter(d => MAIN_CATS.includes(d.category)).slice(0, 3);
  if (!filtered.length) return null;

  const totalViews = filtered.reduce((sum, d) => sum + parseNum(d.totalViews), 0);

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
