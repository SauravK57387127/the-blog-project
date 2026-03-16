
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import "@/app/globals.css";
import { dark } from "@clerk/themes";

export const metadata = {
  title: "InnerFlame",
  description: "Long-form reflections on technology, creativity, and self-development.",
};


import { Providers } from "@/app/providers";
export default function RootLayout({
  children
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
    <html lang="en" suppressHydrationWarning>
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
    </ClerkProvider>
  );
}
