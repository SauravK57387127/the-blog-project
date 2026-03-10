"use client";

import { useState } from "react";
import { LayoutDashboard, BarChart3, Newspaper, NotebookPen, FilePlus2, DoorOpen, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const navItems = [
  { title: "Dashboard", url: "/admin/home",      icon: LayoutDashboard },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3       },
  { title: "Blogs",     url: "/admin/blogs",     icon: Newspaper       },
  { title: "Drafts",    url: "/admin/drafts",    icon: NotebookPen     },
  { title: "New Post",  url: "/admin/blogs/new", icon: FilePlus2       },
];

export function AdminFloatingDock() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const getScale = (index) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(hoveredIndex - index);
    if (distance === 0) return 1.5;
    if (distance === 1) return 1.25;
    return 1;
  };

  const getTranslateY = (scale) => {
    if (scale === 1.5)  return "-8px";
    if (scale === 1.25) return "-4px";
    return "0";
  };

  const isHovered = (index) => hoveredIndex === index;

  const handleLogout = () => {
    router.push("/admin/login");
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div
          className="floating-dock flex items-end gap-2 px-4 py-3 backdrop-blur-xl border border-border/40 shadow-2xl"
          style={{
            borderRadius: "1rem",
            background: "rgba(255, 255, 255, 0.15)",
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Nav items */}
          {navItems.map((item, index) => {
            const isActive = item.url === "/admin/home"
              ? pathname === "/admin/home"
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
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  } ${isHovered(index) ? "bg-white/20 dark:bg-white/10" : ""}`}
                  style={{ borderRadius: "0.5rem" }}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                {/* Active dot */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}

          {/* Theme toggle */}
          <button
            onMouseEnter={() => setHoveredIndex(navItems.length)}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex flex-col items-center text-muted-foreground hover:text-foreground transition-all duration-300 ease-out"
            style={{
              transform: `scale(${getScale(navItems.length)}) translateY(${getTranslateY(getScale(navItems.length))})`
            }}
          >
            <div
              className={`p-3 transition-colors duration-150 ${isHovered(navItems.length) ? "bg-white/20 dark:bg-white/10" : ""}`}
              style={{ borderRadius: "0.5rem" }}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </div>
          </button>

          <div className="w-px h-6 bg-border/40 mx-1 self-center" />

          {/* Logout */}
          <button
            onMouseEnter={() => setHoveredIndex(navItems.length + 1)}
            onClick={() => setShowLogoutDialog(true)}
            className="relative flex flex-col items-center text-muted-foreground hover:text-destructive transition-all duration-300 ease-out"
            style={{
              transform: `scale(${getScale(navItems.length + 1)}) translateY(${getTranslateY(getScale(navItems.length + 1))})`
            }}
          >
            <div
              className={`p-3 transition-colors duration-150 ${isHovered(navItems.length + 1) ? "bg-white/20 dark:bg-white/10" : ""}`}
              style={{ borderRadius: "0.5rem" }}
            >
             <DoorOpen className="h-5 w-5" /> 
            </div>
          </button>
        </div>
      </div>

      {/* Logout confirmation — untouched */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif italic font-normal text-xl">
              Leaving already?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-reading">
              Are you sure you want to logout from the admin panel?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs uppercase tracking-wide">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="font-mono text-xs uppercase tracking-wide"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
