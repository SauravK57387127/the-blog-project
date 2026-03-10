// "use client";

// import DOMPurify from "dompurify";

// export function BlogPreview({ title, coverImage, content }) {
//   // Run only in browser
//   const sanitizedContent = content ? DOMPurify.sanitize(content) : "";

//   return (
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <p className="text-xs text-muted-foreground uppercase tracking-wide">Live Preview</p>
//         <div className="border-l-4 border-primary pl-3">
//           <p className="text-sm text-muted-foreground">This is how your blog will appear</p>
//         </div>
//       </div>

//       <article className="space-y-6">
//         {title && <h1 className="text-4xl font-bold tracking-tight">{title}</h1>}

//         {coverImage && (
//           <div className="rounded-lg overflow-hidden border">
//             <img
//               src={coverImage}
//               alt={title || "Blog cover"}
//               className="w-full h-64 object-cover"
//               onError={(e) => {
//                 e.currentTarget.src = "/placeholder.svg";
//               }}
//             />
//           </div>
//         )}

//         {sanitizedContent ? (
//           <div
//             className="blog-content prose prose-sm sm:prose lg:prose-lg max-w-none"
//             dangerouslySetInnerHTML={{ __html: sanitizedContent }}
//           />
//         ) : (
//           !title &&
//           !coverImage && (
//             <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
//               <p className="text-muted-foreground text-sm">
//                 Start writing to see your preview
//               </p>
//             </div>
//           )
//         )}
//       </article>
//     </div>
//   );
// }


// BlogPreview.jsx
"use client";

import { Calendar, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import Prism from '@/lib/prism-config';
import { useEffect } from 'react';
import { Separator } from "@/components/ui/separator";

export function BlogPreview({ title, coverImage, content, tags }) {
  useEffect(() => {
  const timer = setTimeout(() => {
    // --- Add fallback language class for Prism ---
    const codeBlocks = document.querySelectorAll(".blog-content pre code");
    codeBlocks.forEach((code) => {
      if (!code.classList.length) {
        code.classList.add("language-js"); // default language
      }
    });

    // --- Highlight code ---
    if (window.Prism) {
      window.Prism.highlightAll();
    }

    // --- Add copy buttons ---
    const preBlocks = document.querySelectorAll(".blog-content pre");

    preBlocks.forEach((block) => {
      if (block.querySelector(".copy-button")) return;

      const button = document.createElement("button");
      button.className = "copy-button";
      button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

      button.addEventListener("click", async () => {
        const code = block.querySelector("code")?.textContent || "";
        await navigator.clipboard.writeText(code);
        button.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>';
        setTimeout(() => {
          button.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
        }, 2000);
      });

      block.appendChild(button);
    });
  }, 50);

  return () => clearTimeout(timer);
}, [content]);

  return (
    <div className="max-w-[800px] mx-auto">
      <article className="w-full">
        {/* Tags */}
        {tags.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-6">
    {tags.map((tag) => (
      <span key={tag} className="text-xs font-mono px-2 py-1 border border-border text-muted-foreground">
        {tag}
      </span>
    ))}
  </div>
)}

        {/* Title */}
        {title && (
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            {title}
          </h1>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground mb-8">
  <time>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
  <span className="text-muted-foreground/30">·</span>
  <span>5 min read</span>
</div>

        {/* Cover Image */}
        {/* {coverImage && (
          <figure className="mb-8">
            <img
              src={coverImage}
              alt={title || "Blog cover"}
              className="w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/800x400?text=Cover+Image";
              }}
            />
          </figure>
        )} */}
        {coverImage && (
  <figure className="mb-8">
    <div className="aspect-video overflow-hidden rounded-lg shadow-lg bg-muted">
      <img
        src={coverImage}
        alt={title || "Blog cover"}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/800x400?text=Cover+Image";
        }}
      />
    </div>
  </figure>
)}

        {/* Content */}
        {content ? (
          <div className="max-w-none mb-8">
            {/* <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: content }}
            /> */}
            <div 
    className="blog-content max-w-none mb-8"
    dangerouslySetInnerHTML={{ __html: content }}
  />
          </div>
        ) : (
          !title && !coverImage && (
            <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground text-sm">
                Start writing to see your preview
              </p>
            </div>
          )
        )}
      </article>
    </div>
  );
}
