// import { ReactNode } from "react";
// import { FloatingDock } from "./FloatingDock";
// import { Flower2 } from "lucide-react";

// export default function AppLayout({
//   children
// }) {
//   // return <div className="min-h-screen w-full pb-24">
//   //     <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//   //       <div className="flex h-14 items-center px-4 lg:px-6">
//   //         <h2 className="font-serif text-xl font-bold">The Chronicle</h2>
//   //       </div>
//   //     </header>
//   //     <main className="w-full">
//   //       {children}
//   //     </main>
//   //     <FloatingDock />
//   //   </div>;

//   return (
//     <div className="min-h-screen w-full pb-24">
//       <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="flex h-16 items-center justify-center px-4 lg:px-6">
//           <div className="flex items-center gap-3">
//             {/* <div className="relative">
//               <svg
//                 viewBox="0 0 24 24"
//                 className="h-8 w-8 text-primary"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
//                 <path d="M12 6v6l4 2" />
//               </svg>
//             </div> */}
//             <div className="flex flex-col">
//               <h1 className="font-serif text-2xl font-bold tracking-tight">
//                 <Flower2 /> The Chronicle
//               </h1>
//               <p className="text-xs text-muted-foreground -mt-0.5 hidden sm:block">
//                 Personal insights on tech, life, and everything between
//               </p>
//             </div>
//           </div>
//         </div>
//       </header>
//       <main className="w-full">
//         {children}
//       </main>
//       <FloatingDock />
//     </div>
//   );
// }


"use client"
import { FloatingDock } from "./FloatingDock";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen w-full pb-24">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <svg
                width="32" height="32" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 12c-3-5-8-6-9-5s1 6 5 7c-4 2-4 6-2 6s5-3 6-5"/>
                <path d="M12 12c3-5 8-6 9-5s-1 6-5 7c4 2 4 6 2 6s-5-3-6-5"/>
                <line x1="12" y1="3" x2="12" y2="21"/>
              </svg>
            </div>

            {/* Title */}
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-light leading-none">
                <span className="italic font-serif">Inner</span>
                <span className="eb-garamond-quote text-primary">Flame</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-light tracking-wide mt-0.5">
                a self-taught dev's journal
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full">
        {children}
      </main>

      <FloatingDock />
    </div>
  );
}
