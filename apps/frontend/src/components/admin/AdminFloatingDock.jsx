'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, BarChart3, Newspaper, NotebookPen, FilePlus2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAdminProfile, useAdminLogout } from '@/hooks/api/admin/useAdminProfile';

const navItems = [
  { title: 'Dashboard', url: '/admin/home',      icon: LayoutDashboard },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3       },
  { title: 'Blogs',     url: '/admin/blogs',     icon: Newspaper       },
  { title: 'Drafts',    url: '/admin/drafts',    icon: NotebookPen     },
  { title: 'New Post',  url: '/admin/blogs/new', icon: FilePlus2       },
];

// Simple sun/moon SVGs inline to avoid importing lucide for just these
const SunIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;

export function AdminFloatingDock() {
  const [mounted, setMounted] = useState(false);

  const [hoveredIndex, setHoveredIndex]       = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => setMounted(true), []);

  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const { data: profile }      = useAdminProfile();
  const { mutate: logout, isPending: isLoggingOut } = useAdminLogout();

  const getScale = (index) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(hoveredIndex - index);
    if (distance === 0) return 1.5;
    if (distance === 1) return 1.25;
    return 1;
  };

  const getTranslateY = (scale) => {
    if (scale === 1.5)  return '-8px';
    if (scale === 1.25) return '-4px';
    return '0';
  };

  const THEME_IDX  = navItems.length;
  const DIV_IDX    = navItems.length + 1; // not hovered, just visual
  const AVATAR_IDX = navItems.length + 2;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div
          className="floating-dock flex items-end gap-2 px-4 py-3 backdrop-blur-xl border border-border/40 shadow-2xl"
          style={{ borderRadius: '1rem', background: 'rgba(255, 255, 255, 0.15)' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Nav items */}
          {navItems.map((item, index) => {
            const isActive = item.url === '/admin/home'
              ? pathname === '/admin/home'
              : pathname.startsWith(item.url);
            const scale = getScale(index);

            return (
              <Link
                key={item.title}
                href={item.url}
                onMouseEnter={() => setHoveredIndex(index)}
                className="relative flex flex-col items-center transition-all duration-300 ease-out"
                style={{ transform: `scale(${scale}) translateY(${getTranslateY(scale)})` }}
              >
                <div
                  className={`p-3 transition-colors duration-150 ${
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  } ${hoveredIndex === index ? 'bg-white/20 dark:bg-white/10' : ''}`}
                  style={{ borderRadius: '0.5rem' }}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}

          {/* Theme toggle */}
          <button
            onMouseEnter={() => setHoveredIndex(THEME_IDX)}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative flex flex-col items-center text-muted-foreground hover:text-foreground transition-all duration-300 ease-out"
            style={{ transform: `scale(${getScale(THEME_IDX)}) translateY(${getTranslateY(getScale(THEME_IDX))})` }}
          >
            <div
              className={`p-3 transition-colors duration-150 ${hoveredIndex === THEME_IDX ? 'bg-white/20 dark:bg-white/10' : ''}`}
              style={{ borderRadius: '0.5rem' }}
            >
              {mounted ? (theme === 'dark' ? <SunIcon /> : <MoonIcon />) : <SunIcon/>}
            </div>
          </button>

          <div className="w-px h-6 bg-border/40 mx-1 self-center" />

          {/* Profile avatar — click to open logout dialog */}
          <button
            onMouseEnter={() => setHoveredIndex(AVATAR_IDX)}
            onClick={() => setShowLogoutDialog(true)}
            className="relative flex flex-col items-center transition-all duration-300 ease-out"
            style={{ transform: `scale(${getScale(AVATAR_IDX)}) translateY(${getTranslateY(getScale(AVATAR_IDX))})` }}
            title={profile?.username ?? 'Admin'}
          >
            <div
              className={`p-2 transition-colors duration-150 ${hoveredIndex === AVATAR_IDX ? 'ring-2 ring-accent' : 'ring-1 ring-border'}`}
              style={{ borderRadius: '0.5rem' }}
            >
              <img
  src={profile?.profileImage ?? 'https://avatars.githubusercontent.com/u/190694463?s=400&v=4'}
  alt={profile?.username ?? 'Admin'}
  className="h-7 w-7 rounded object-cover"
/>
            </div>
          </button>
        </div>
      </div>

      {/* Logout confirmation */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif italic font-normal text-xl">
              Leaving already?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-reading">
              {profile?.username && (
                <span className="font-medium text-foreground">{profile.username}</span>
              )}{' '}
              Are you sure you want to logout from the admin panel?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs uppercase tracking-wide">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="font-mono text-xs uppercase tracking-wide"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
