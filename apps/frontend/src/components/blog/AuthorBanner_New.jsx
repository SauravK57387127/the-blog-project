"use client";

import Image from "next/image";
import { Twitter, Linkedin } from "lucide-react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

// BL-5: <img> → next/image with lazy loading on author avatar.
// w-14 h-14 = 56x56px — explicit dimensions prevent CLS.
export default function AuthorBanner_New({ author }) {
    if (!author) return null;

    const avatarSrc =
        author.profileImage ||
        author.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name}`;

    return (
        <div className="border-l-4 border-foreground pl-6 py-2 flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                    src={avatarSrc}
                    alt={author.name}
                    fill
                    loading="lazy"
                    sizes="56px"
                    className="rounded-full object-cover ring-2 ring-border"
                />
            </div>

            {/* Info */}
            <div className="space-y-2">
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        — written by
                    </span>
                    <h3 className="text-lg font-serif italic mt-0.5">
                        {author.name}
                    </h3>
                </div>

                <p className="font-reading text-sm text-foreground/70 leading-relaxed">
                    Full-stack dev. Obsessed with building things, learning in
                    public, and finding balance between code and life.
                </p>

                {/* Social — Twitter + LinkedIn only */}
                <div className="inline-flex border border-border mt-2">
                    {author.socialLinks?.twitter && (
                        <a
                            href={author.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wide border-r border-border hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast}`}
                        >
                            <Twitter className="h-3.5 w-3.5" />
                            Twitter
                        </a>
                    )}
                    {author.socialLinks?.linkedin && (
                        <a
                            href={author.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wide hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast}`}
                        >
                            <Linkedin className="h-3.5 w-3.5" />
                            LinkedIn
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
