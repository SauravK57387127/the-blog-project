'use client';

import { DESIGN_CONSTANTS } from '@/lib/design-constants';

const MAX_STALE_DAYS = 45;

function getDaysStale(dateString) {
  return Math.floor((Date.now() - new Date(dateString).getTime()) / (24 * 60 * 60 * 1000));
}

export default function StaleDrafts({ drafts, onEdit }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">Needs Attention</span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>
      <div className="space-y-0">
        {drafts.map((draft) => {
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
