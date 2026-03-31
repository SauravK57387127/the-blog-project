'use client';

import { useRef, useEffect } from 'react';

export function BlogPreview({ title, coverImage, content, tags }) {
  const contentRef = useRef(null);

  // Re-run Prism whenever content changes — needed because preview updates live
  useEffect(() => {
    const node = contentRef.current;
    if (!node || !content) return;

    const codeBlocks = node.querySelectorAll('pre code');
    if (!codeBlocks.length) return;

    node.querySelectorAll('pre').forEach(b => { b.style.visibility = 'hidden'; });

    codeBlocks.forEach(code => {
      if (!code.classList.length) code.classList.add('language-javascript');
    });

    if (window.Prism) window.Prism.highlightAll();

    node.querySelectorAll('pre').forEach(block => {
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
  }, [content]);

  const isEmpty = !title && !coverImage && !content;

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-border">
        <p className="text-muted-foreground text-sm font-reading">Start writing to see your preview</p>
      </div>
    );
  }

  return (
    <article>
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map(tag => (
            <span key={tag} className="text-xs font-mono px-2 py-1 border border-border text-muted-foreground">{tag}</span>
          ))}
        </div>
      )}

      {title && <h1 className="text-4xl font-serif font-bold mb-5 leading-tight">{title}</h1>}

      <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground mb-8">
        <time>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        <span className="text-muted-foreground/30">·</span>
        <span>draft</span>
      </div>

      {coverImage && (
        <figure className="mb-10">
          <img src={coverImage} alt={title || 'Cover'} className="w-full h-auto"
            onError={e => { e.currentTarget.style.display = 'none'; }} />
        </figure>
      )}

      <div
        ref={contentRef}
        className="blog-content max-w-none"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: content ?? '' }}
      />
    </article>
  );
}
