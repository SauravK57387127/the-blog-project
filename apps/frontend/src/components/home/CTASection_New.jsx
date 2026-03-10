"use client";

import { ArrowRight, User, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      <div className={`relative z-10 ${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* About Me CTA Card */}
          <div className="text-center space-y-6 p-8 border-4 border-foreground">
            <div className="flex items-center justify-center gap-3">
              <User className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-sans font-bold">
                Who Writes This Stuff?
              </h2>
            </div>
            <p className="text-base text-foreground font-mono font-medium">
              I'm <span className="border border-border px-1.5 py-0.5 text-accent">SAURAV</span> — a self-taught dev figuring things out, one line at a time.
            </p>
            <button
              onClick={() => router.push("/about")}
              className={`group inline-flex items-center gap-3 px-8 py-4 text-lg font-bold uppercase tracking-wide border-4 border-foreground bg-background hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[8px] active:translate-y-[8px]`}
            >
              Learn My Story
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Newsletter CTA Card */}
          <div className="text-center space-y-6 p-8 border-4 border-foreground">
            <div className="flex items-center justify-center gap-3">
              <Mail className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-sans font-bold">
                Stay in the Loop
              </h2>
            </div>
            <p className="text-base text-foreground font-mono font-medium">
              Real dev. Real struggles. Real progress — delivered weekly.
            </p>
            <button
              onClick={() => router.push("/newsletter")}
              className={`group inline-flex items-center gap-3 px-8 py-4 text-lg font-bold uppercase tracking-wide border-4 border-foreground bg-background hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[8px] active:translate-y-[8px]`}
            >
              Subscribe Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
