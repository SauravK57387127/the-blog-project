"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

export default function Newsletter_New() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);

        // TODO: Connect to newsletter API
        setTimeout(() => {
            toast.success("You're in! I'll be in touch.");
            setEmail("");
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <div className="w-full min-h-[80vh] flex items-center">
            <div
                className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 py-20`}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Left: Personal Message */}
                    <div className="space-y-10">
                        {/* Mono label */}
                        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                            — newsletter
                        </span>

                        <div className="space-y-4">
                            <h1
                                className={`${DESIGN_CONSTANTS.typography.heroTitle}`}
                            >
                                I write.
                                <br />
                                You read.
                                <br />
                                <span className="font-serif italic">
                                    That's the deal!
                                </span>
                            </h1>
                            <p className="font-reading text-lg text-foreground/70 leading-relaxed max-w-md">
                                Just me — a self-taught dev — sharing what I'm
                                learning, building, and figuring out along the
                                way.
                            </p>
                        </div>

                        {/* What you'll get */}
                        <div>
                            <div className="flex items-center gap-2 mb-5">
                                <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                                    What's inside
                                </span>
                                <div className="flex-1 h-[1px] bg-border" />
                            </div>

                            <ul className="space-y-0">
                                {[
                                    "Latest articles when they drop",
                                    "Things I'm currently learning",
                                    "Tools, discoveries, or ideas worth sharing",
                                    "Occasional honest reflections",
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                                    >
                                        <span className="text-xs font-mono text-muted-foreground/40 w-5 flex-shrink-0">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="font-reading text-foreground/80">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-sans font-bold">
                                Stay in the loop
                            </h2>
                            <p className="font-reading text-sm text-muted-foreground">
                                Drop your email. Unsubscribe whenever. No spam,
                                ever.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 text-base font-reading border-foreground/20 focus:border-foreground/50 bg-background"
                                disabled={isSubmitting}
                            />

                            {/* Brutalist submit button — matches CTA + About */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !email}
                                className={`group w-full h-12 flex items-center justify-center gap-3 text-base font-bold uppercase tracking-wide border-4 border-foreground bg-background hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[8px] active:translate-y-[8px] disabled:opacity-40 disabled:pointer-events-none`}
                            >
                                {isSubmitting ? "Subscribing..." : "Subscribe"}
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <p className="text-xs font-mono text-muted-foreground">
                            Just an email. Nothing else needed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
