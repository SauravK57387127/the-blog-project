"use client";

import { useState, useEffect, useRef } from "react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";
import AuthorBanner_New from "@/components/blog/AuthorBanner_New";
import CommentSection_New from "@/components/blog/CommentSection_New";
import RelatedBlogs_New from "@/components/blog/RelatedBlogs_New";
import BlogEngagementBar_New from "@/components/blog/BlogEngagementBar_New";
import { toast } from "@/hooks/use-toast";
import Prism from "@/lib/prism-config.js";

const demoBlog = {
  _id: "1",
  title: "The Future of Web Development: Trends to Watch in 2025",
  slug: "future-web-development-2025",
  coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop",
  content: `
    <p>Web development continues to evolve at a rapid pace, with new technologies and methodologies emerging constantly. As we look ahead to 2025, several key trends are shaping the future of how we build for the web.</p>
    
    <h2>The Rise of AI-Assisted Development</h2>
    <p>Artificial intelligence is transforming how developers write code. From intelligent code completion to automated testing and bug detection, AI tools are becoming indispensable partners in the development process.</p>
    
    <blockquote>
      <p>"AI is not replacing developers; it's amplifying their capabilities and allowing them to focus on creative problem-solving rather than repetitive tasks."</p>
      <cite>— Sam Altman, CEO of OpenAI</cite>
    </blockquote>
    
    <p>Tools like GitHub Copilot and ChatGPT have shown us just the beginning of what's possible. The next generation of AI-powered development tools will be even more sophisticated, understanding context better and providing more accurate suggestions.</p>
    
    <h2>Server Components and Edge Computing</h2>
    <p>React Server Components and edge computing are revolutionizing application architecture. By moving computation closer to users and rendering on the server, we're seeing dramatic improvements in performance and user experience.</p>
    
    <pre><code class="language-javascript">// Example of a Server Component
async function BlogPost({ id }) {
  const post = await db.posts.findById(id);
  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;p&gt;{post.content}&lt;/p&gt;
    &lt;/article&gt;
  );
}</code></pre>
    
    <p>This approach offers several benefits:</p>
    <ul>
      <li><strong>Reduced JavaScript bundle size</strong> - Server components don't ship to the client</li>
      <li><strong>Direct database access</strong> - No need for API layers in many cases</li>
      <li><strong>Improved SEO</strong> - Content is rendered on the server</li>
      <li><strong>Better performance</strong> - Faster initial page loads</li>
    </ul>
    
    <h2>The Jamstack Evolution</h2>
    <p>The Jamstack architecture continues to mature, with improved tooling and workflows that make it easier than ever to build fast, secure, and scalable web applications.</p>
    
    <p>These trends represent just the beginning of an exciting new chapter in web development. As developers, staying informed and adaptable will be key to success in this rapidly changing landscape.</p>
  `,
  tags: ["Web Development", "React", "AI", "Performance"],
  publishedAt: new Date().toISOString(),
  readingTime: 5,
  author: {
    _id: "author1",
    name: "Saurav Kumar",
    bio: "Full-stack developer passionate about modern web technologies and sharing knowledge through writing.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Saurav",
    socialLinks: {
      twitter: "https://twitter.com/example",
      linkedin: "https://linkedin.com/in/example",
    }
  },
  likes: 42,
  isLikedByUser: false,
  isBookmarkedByUser: false
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function BlogDetail() {
  const commentSectionRef = useRef(null);
  const [likeCount, setLikeCount] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const contentRef = useRef(null);

  // TODO: Replace with React Query
  const blog = demoBlog;

  // Prism.js highlighting + copy buttons — untouched
  useEffect(() => {
      if (!contentRef.current) return;
      
      const timer = setTimeout(() => {
        const codeBlocks = document.querySelectorAll(".blog-content pre code");
        codeBlocks.forEach((code) => {
          if (!code.classList.length) code.classList.add("language-javascript");
        });
        if (window.Prism) window.Prism.highlightAll();
        const preBlocks = document.querySelectorAll(".blog-content pre");
        preBlocks.forEach((block) => {
          if (block.querySelector(".copy-button")) return;
          const button = document.createElement("button");
          button.className = "copy-button";
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
          button.addEventListener("click", async () => {
            const code = block.querySelector("code")?.textContent || "";
            await navigator.clipboard.writeText(code);
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>';
            setTimeout(() => {
              button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
            }, 2000);
          });
          block.appendChild(button);
        });
      }, 150);

      return () => clearTimeout(timer);
    }, [blog.content]);


  // Engagement handlers — TODO: connect to backend
  const handleLike = () => {
    if (isLiked) { setLikeCount(p => p - 1); setIsLiked(false); }
    else          { setLikeCount(p => p + 1); setIsLiked(true);  }
  };

  const handleBookmark = () => setIsBookmarked(!isBookmarked);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied!", description: "Blog link copied to clipboard" });
    }
  };

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full min-h-screen">
      <div className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 py-12`}>

        <article className={`${DESIGN_CONSTANTS.containers.narrow} mx-auto`}>

          {/* ── Header ─────────────────────────────────── */}
          <header className="mb-8 lg:mb-10">

            {/* Tags — only here, not repeated at footer */}
            <div className="flex flex-wrap gap-2 mb-5">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono px-2 py-1 border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors duration-150"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className={`${DESIGN_CONSTANTS.typography.heroTitle} mb-5`}>
              {blog.title}
            </h1>

            {/* Metadata — mono text, no icons */}
            <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
              <time>{formatDate(blog.publishedAt)}</time>
              <span className="text-muted-foreground/30">·</span>
              <span>{blog.readingTime} min read</span>
            </div>
          </header>

          {/* ── Engagement Bar — right after metadata ── */}
          <div className="mb-8 lg:mb-10">
            <BlogEngagementBar_New
              likeCount={likeCount}
              isLiked={isLiked}
              isBookmarked={isBookmarked}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onShare={handleShare}
              onScrollToComments={scrollToComments}
            />
          </div>

          {/* ── Cover Image ─────────────────────────────── */}
          {blog.coverImage && (
            <figure className="mb-10 -mx-4 sm:mx-0">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-auto"
              />
            </figure>
          )}

          {/* ── Blog Content ────────────────────────────── */}
          <div
            ref={contentRef}
            className="blog-content max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* ── Author Banner ───────────────────────────── */}
          <div className="mb-10 pt-8 border-t border-border">
            <AuthorBanner_New author={blog.author} />
          </div>

          {/* ── Comments ────────────────────────────────── */}
          <div ref={commentSectionRef} className="mb-12">
            <CommentSection_New blogId={blog._id} />
          </div>

        </article>

        {/* ── Related Blogs — full width ───────────────── */}
        <div className={`${DESIGN_CONSTANTS.containers.narrow} mx-auto`}>
          <RelatedBlogs_New currentBlogId={blog._id} tags={blog.tags} />
        </div>

      </div>
    </div>
  );
}
