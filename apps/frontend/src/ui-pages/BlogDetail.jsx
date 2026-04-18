'use client';

import Prism from "@/lib/prism-config.js";
import { useRef, useEffect, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import AuthorBanner_New from '@/components/blog/AuthorBanner_New';
import BlogEngagementBar_New from '@/components/blog/BlogEngagementBar';
import { toast } from 'sonner';
// BL-1: useBlogBySlug commented out — replaced by ISR prop from page.jsx
// import { useBlogBySlug } from '@/hooks/api/public/useBlog';
import { useEngagement, useToggleLike, useToggleBookmark } from '@/hooks/api/user/useEngagement';

// BL-4: CommentSection + RelatedBlogs dynamically imported — below fold,
// excluded from initial bundle → reduces TBT.
const CommentSection_New = dynamic(() => import('@/components/blog/CommentSection'));
const RelatedBlogs_New   = dynamic(() => import('@/components/blog/RelatedBlogs'));

// BL-7: formatDate outside component — not recreated on every render
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// Outside BlogDetail — React.memo prevents re-render unless content changes
const BlogContent = memo(function BlogContent({ content, contentRef }) {
  return (
    <div
      ref={contentRef}
      className="blog-content max-w-none mb-12"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
});

// BL-1: blog + slug arrive as ISR props from page.jsx — no client fetch needed
export default function BlogDetail({ blog, slug }) {
  const commentSectionRef = useRef(null);

  // TODO: cleanup — useBlogBySlug replaced by ISR prop
  // const { data: blog, isLoading } = useBlogBySlug(slug);

  const { data: engagement }      = useEngagement(blog?._id);
  const { mutate: toggleLike }    = useToggleLike(blog?._id, slug);
  const { mutate: toggleBookmark } = useToggleBookmark(blog?._id);

  // BL-2: Prism race condition fixed.
  // Previous approach: useCallback ref with [blog?.content] dep — fired on DOM
  // mount when content was still undefined, never re-fired when content arrived.
  // Fix: stable useRef holds the DOM node. Separate useEffect watches blog?.content
  // and runs Prism AFTER content is actually in the DOM.
  const contentDomRef = useRef(null);

  const contentRef = useCallback((node) => {
    contentDomRef.current = node;
  }, []); // stable — never recreates

  useEffect(() => {
    const node = contentDomRef.current;
    if (!node || !blog?.content) return;

    const codeBlocks = node.querySelectorAll('pre code');
    if (!codeBlocks.length) return;

    // Hide until highlighted — prevents flash of unstyled code
    node.querySelectorAll('pre').forEach((block) => {
      block.style.visibility = 'hidden';
    });

    codeBlocks.forEach((code) => {
      if (!code.classList.length) code.classList.add('language-javascript');
    });

    Prism.highlightAll();

    node.querySelectorAll('pre').forEach((block) => {
      block.style.visibility = 'visible';
      if (block.querySelector('.copy-button')) return;

      const button = document.createElement('button');
      button.className = 'copy-button';
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

      button.addEventListener('click', async () => {
        const code = block.querySelector('code')?.textContent || '';
        await navigator.clipboard.writeText(code);
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>';
        setTimeout(() => {
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
        }, 2000);
      });

      block.appendChild(button);
    });
  }, [blog?.content]); // fires every time content changes — reliable

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: blog?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  }, [blog?.title]);

  const scrollToComments = useCallback(() => {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (!blog) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 py-12`}>
        <article className={`${DESIGN_CONSTANTS.containers.narrow} mx-auto`}>

          <header className="mb-8 lg:mb-10">
            <div className="flex flex-wrap gap-2 mb-5">
              {blog.tags?.map((tag) => (
                <span key={tag} className="text-xs font-mono px-2 py-1 border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors duration-150">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className={`${DESIGN_CONSTANTS.typography.heroTitle} mb-5`}>{blog.title}</h1>
            <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
              <time>{formatDate(blog.publishedAt)}</time>
              <span className="text-muted-foreground/30">·</span>
              <span>{blog.readingTime} min read</span>
            </div>
          </header>

          <div className="mb-8 lg:mb-10">
            <BlogEngagementBar_New
              likeCount={blog.totalLikes ?? 0}
              isLiked={engagement?.isLiked ?? false}
              isBookmarked={engagement?.isBookmarked ?? false}
              onLike={toggleLike}
              onBookmark={toggleBookmark}
              onShare={handleShare}
              onScrollToComments={scrollToComments}
            />
          </div>

          {/* BL-3: next/image with priority on cover — LCP element, preloaded */}
          {blog.coverImage && (
            <figure className="mb-10 -mx-4 sm:mx-0 relative">
              <div className="relative w-full aspect-video">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            </figure>
          )}

<BlogContent content={blog.content} contentRef={contentRef} />
         
          <div className="mb-10 pt-8 border-t border-border">
            <AuthorBanner_New author={blog.author} />
          </div>

          <div ref={commentSectionRef} className="mb-12">
            <CommentSection_New blogId={blog._id} />
          </div>

        </article>

        <div className={`${DESIGN_CONSTANTS.containers.narrow} mx-auto`}>
          <RelatedBlogs_New slug={slug} />
        </div>

      </div>
    </div>
  );
}
