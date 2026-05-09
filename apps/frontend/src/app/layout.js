import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { TokenInitializer } from "@/lib/token-initializer";
import { Providers } from "@/app/providers";
import Script from "next/script";
import { NavigationTracker } from "@/components/NavigationTracker";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

export const metadata = {
    title: "InnerFlame",
    description:
        "Long-form reflections on technology, creativity, and self-development.",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>
            <html lang="en" suppressHydrationWarning>
                <body className="font-sans">
                    {/* Google Analytics — only loads when ID is present */}
                    {GA_MEASUREMENT_ID && (
                        <>
                            {/*
                strategy="afterInteractive" — loads GA after page is interactive.
                Never blocks rendering. Next.js Script component handles this correctly.
                Using afterInteractive instead of lazyOnload so GA data is captured
                for users who leave quickly, while still not blocking LCP.
              */}
                            <Script
                                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                                strategy="afterInteractive"
                            />
                            <Script
                                id="google-analytics"
                                strategy="afterInteractive"
                            >
                                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                    send_page_view: false
                  });
                `}
                            </Script>
                        </>
                    )}

                    <Providers>
                        <TooltipProvider>
                            <TokenInitializer />
                            {/* Fires GA pageview on every Next.js route change */}
                            <NavigationTracker />
                            <Toaster />
                            <Sonner />
                            {children}
                        </TooltipProvider>
                    </Providers>
                </body>
            </html>
        </ClerkProvider>
    );
}
