'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
// TODO: cleanup — useHomepage replaced by ISR server fetch in page.js
// import { useHomepage } from '@/hooks/api/public/useHomepage';
import HeroSection from '@/components/home/HeroSection';
import RecentHighlightsSection from '@/components/home/RecentHighlightsSection';
import TrendingSection from '@/components/home/TrendingSection';
import PopularPostsSection from '@/components/home/PopularPostsSection';
import EditorsChoiceSection from '@/components/home/EditorsChoiceSection';
import CTASection from '@/components/home/CTASection_New';


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
