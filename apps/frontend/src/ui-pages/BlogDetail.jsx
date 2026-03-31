'use client';

import { useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import AuthorBanner_New from '@/components/blog/AuthorBanner_New';
import CommentSection_New from '@/components/blog/CommentSection';
import RelatedBlogs_New from '@/components/blog/RelatedBlogs';
import BlogEngagementBar_New from '@/components/blog/BlogEngagementBar';
import { toast } from 'sonner';
import { useBlogBySlug } from '@/hooks/api/public/useBlog';
import { useEngagement, useToggleLike, useToggleBookmark } from '@/hooks/api/user/useEngagement';
import Prism from "@/lib/prism-config.js";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function BlogDetail() {
  const params = useParams();
  const slug = params?.slug;
  const commentSectionRef = useRef(null);

  // Data fetching — MUST come before useCallback
  const { data: blog, isLoading } = useBlogBySlug(slug);
  const { data: engagement } = useEngagement(blog?._id);
  const { mutate: toggleLike } = useToggleLike(blog?._id, slug);
  const { mutate: toggleBookmark } = useToggleBookmark(blog?._id);

  // Prism ref callback — fires synchronously when DOM mounts.
  // Re-runs when blog?.content changes (after async fetch).
  const contentRef = useCallback((node) => {
    if (!node) return;

    const codeBlocks = node.querySelectorAll('pre code');
    if (!codeBlocks.length) return;

    node.querySelectorAll('pre').forEach((block) => {
      block.style.visibility = 'hidden';
    });

    codeBlocks.forEach((code) => {
      if (!code.classList.length) code.classList.add('language-javascript');
    });

    if (window.Prism) window.Prism.highlightAll();

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
  }, [blog?.content]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen">
        <div className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 py-12`}>
          <article className={`${DESIGN_CONSTANTS.containers.narrow} mx-auto space-y-6`}>
            <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
            <div className="h-12 bg-muted animate-pulse rounded" />
            <div className="h-12 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
            <div className="aspect-video bg-muted animate-pulse rounded" />
          </article>
        </div>
      </div>
    );
  }

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

          {blog.coverImage && (
            <figure className="mb-10 -mx-4 sm:mx-0">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-auto" />
            </figure>
          )}

          <div
            ref={contentRef}
            className="blog-content max-w-none mb-12"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

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
