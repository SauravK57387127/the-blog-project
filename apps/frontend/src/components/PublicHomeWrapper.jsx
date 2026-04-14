'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// TODO: cleanup — useHomepage replaced by ISR server fetch in page.js
// import { useHomepage } from '@/hooks/api/public/useHomepage';

// OPT-1: Above-fold — static imports, needed immediately on paint
import HeroSection from '@/components/home/HeroSection';
import RecentHighlightsSection from '@/components/home/RecentHighlightsSection';

// OPT-3: Below-fold — dynamically imported.
const TrendingSection      = dynamic(() => import('@/components/home/TrendingSection'));
const PopularPostsSection  = dynamic(() => import('@/components/home/PopularPostsSection'));
const EditorsChoiceSection = dynamic(() => import('@/components/home/EditorsChoiceSection'));
const CTASection           = dynamic(() => import('@/components/home/CTASection_New'));


export default function PublicHomeWrapper({ data }) {
  const router = useRouter();

  // TODO: cleanup — no longer needed, data comes from ISR
  // const { data, isLoading, isError } = useHomepage();

  const handleBlogClick = useCallback((slug) => {
    router.push(`/blog/${slug}`);
  }, [router]);

  return (
    <div className="min-h-screen w-full">

      {/* Hero — latest story */}
      <HeroSection
        blog={data?.hero}
        isLoading={false}
        onBlogClick={handleBlogClick}
      />

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-border to-transparent rounded-full" />
      </div>

      {/* Recent Highlights — 5 most recent */}
      <RecentHighlightsSection
        blogs={data?.recentHighlights ?? []}
        onBlogClick={handleBlogClick}
      />

      {/* Trending This Week — high views7d */}
      <TrendingSection
        blogs={data?.trending ?? []}
        onBlogClick={handleBlogClick}
      />

      {/* Most Read This Month — high views180d */}
      <PopularPostsSection
        blogs={data?.mostRead ?? []}
        onBlogClick={handleBlogClick}
      />

      {/* Editor's Choice — curated picks */}
      <EditorsChoiceSection
        blogs={data?.editorsChoice ?? []}
        onBlogClick={handleBlogClick}
      />

      {/* CTA — static, no data needed */}
      <CTASection />
    </div>
  );
}
