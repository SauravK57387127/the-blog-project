"use client";

import { useState, useEffect } from "react";
import { Home, Search, Info, Mail, LogIn, Moon, Sun, CircleUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useAuthGuard } from "@/hooks/useAuthGuard";


//const navItems = [
//  { title: "Home",       url: "/",           icon: Home,       mobileHidden: false },
//  { title: "Search",     url: "/search",     icon: Search,     mobileHidden: false },
//  { title: "About",      url: "/about",      icon: Info,       mobileHidden: false },
//  { title: "Newsletter", url: "/newsletter", icon: Mail,       mobileHidden: true  },
//  ...(isAuthenticated
//    ? [{ title: "Profile", url: "/profile", icon: CircleUser, mobileHidden: false }]
//    : []
//  ),
//];

export function FloatingDock() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthGuard();  // ← here

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 


const navItems = [
  { title: "Home", url: "/", icon: Home, mobileHidden: false },
  { title: "Search", url: "/search", icon: Search, mobileHidden: false },
  { title: "About", url: "/about", icon: Info, mobileHidden: false },
  { title: "Newsletter", url: "/newsletter", icon: Mail, mobileHidden: true },

  ...(isAuthenticated
    ? [{ title: "Profile", url: "/profile", icon: CircleUser }]
    : []),
];

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

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="floating-dock flex items-end gap-1 sm:gap-2 px-2 sm:px-4 py-3 backdrop-blur-xl border border-white/20 shadow-2xl"
        style={{
          borderRadius: "1rem",
          background: "rgba(255, 255, 255, 0.15)",
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Nav items */}
        {navItems.map((item, index) => {
          const isActive = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
          const scale = getScale(index);

          return (
            <Link
              key={item.title}
              href={item.url}
              onMouseEnter={() => setHoveredIndex(index)}
              className={`relative flex flex-col items-center transition-all duration-300 ease-out ${
                item.mobileHidden ? "hidden sm:flex" : "flex"
              }`}
              style={{ transform: `scale(${scale}) translateY(${getTranslateY(scale)})` }}
            >
              <div
                className={`p-2 sm:p-3 transition-colors duration-150 ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                } ${isHovered(index) ? "bg-white/20 dark:bg-white/10" : ""}`}
                style={{ borderRadius: "0.5rem" }}
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
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
            className={`p-2 sm:p-3 transition-colors duration-150 ${isHovered(navItems.length) ? "bg-white/20 dark:bg-white/10" : ""}`}
            style={{ borderRadius: "0.5rem" }}
          >
            {theme === "dark" ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
          </div>
        </button>

        <div className="w-px h-5 sm:h-6 bg-border/40 mx-0.5 sm:mx-1 self-center" />

        {/* Login */}
<SignedOut>
  <SignInButton mode="modal">
        <button
          onMouseEnter={() => setHoveredIndex(navItems.length + 1)}
          className="relative flex flex-col items-center text-muted-foreground hover:text-foreground transition-all duration-300 ease-out"
          style={{
            transform: `scale(${getScale(navItems.length + 1)}) translateY(${getTranslateY(getScale(navItems.length + 1))})`
          }}
        >
          <div
            className={`p-2 sm:p-3 transition-colors duration-150 ${isHovered(navItems.length + 1) ? "bg-white/20 dark:bg-white/10" : ""}`}
            style={{ borderRadius: "0.5rem" }}
          >
            <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </button>
  </SignInButton>
</SignedOut>

<SignedIn>
  <div
    onMouseEnter={() => setHoveredIndex(navItems.length + 1)}
    className="relative flex flex-col items-center text-muted-foreground hover:text-foreground transition-all duration-300 ease-out"
    style={{
      transform: `scale(${getScale(navItems.length + 1)}) translateY(${getTranslateY(getScale(navItems.length + 1))})`,
    }}
  >
    <div
      className={`p-2 sm:p-3 transition-colors duration-150 flex items-center justify-center ${
        isHovered(navItems.length + 1) ? "bg-white/20 dark:bg-white/10" : ""
      }`}
      style={{ borderRadius: "0.5rem" }}
    >
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-4 w-4 sm:h-5 sm:w-5 scale-150",
          },
        }}
      />
    </div>
  </div>
</SignedIn>

      </div>
    </div>
  );
}
