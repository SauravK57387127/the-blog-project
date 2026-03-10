
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/app/globals.css";

export const metadata = {
  title: "InnerFlame",
  description: "Long-form reflections on technology, creativity, and self-development.",
};


import { Providers } from "@/app/providers";
export default function RootLayout({
  children
}) {
  return <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>;
}
