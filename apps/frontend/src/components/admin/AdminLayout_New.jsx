"use client";

import { AdminFloatingDock } from "./AdminFloatingDock";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";
import { useAdminGuard } from "@/hooks/api/admin/useAdminAuth";

export default function AdminLayout_New({ children }) {
  const isAuthed = useAdminGuard();
  if (!isAuthed) return null;

  return (
    <div className="min-h-screen w-full pb-24">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm">
        <div className={`flex h-16 items-center gap-3 ${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8`}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0">
            <path d="M12 12c-3-5-8-6-9-5s1 6 5 7c-4 2-4 6-2 6s5-3 6-5"/>
            <path d="M12 12c3-5 8-6 9-5s-1 6-5 7c4 2 4 6 2 6s-5-3-6-5"/>
            <line x1="12" y1="3" x2="12" y2="21"/>
          </svg>
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-light leading-none">
              <span className="italic font-serif">Inner</span>
              <span className="eb-garamond-quote">Flame</span>
              <span className="font-mono text-xs text-muted-foreground ml-2 tracking-widest uppercase not-italic">· admin</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono tracking-wide mt-0.5">
              content management
            </p>
          </div>
        </div>
      </header>

      <main className="w-full">
        <div className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 py-10`}>
          {children}
        </div>
      </main>

      <AdminFloatingDock />
    </div>
  );
}
