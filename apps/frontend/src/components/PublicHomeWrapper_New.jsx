"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { demoBlogs } from "@/data/mockBlogs";
import HeroSection from "@/components/home/HeroSection";
import RecentHighlightsSection from "@/components/home/RecentHighlightsSection";
import PopularPostsSection from "@/components/home/PopularPostsSection";
import CTASection from "@/components/home/CTASection_New";

// ─── NEW SECTIONS - Initially Commented ──────────────────────
// Uncomment when you have enough content to avoid duplicates

import TrendingSection from "@/components/home/TrendingSection";
import EditorsChoiceSection from "@/components/home/EditorsChoiceSection";

export default function PublicHomeWrapper() {
  const router = useRouter();
  
  // Demo data - TODO: Replace with API calls
  const featuredBlog = demoBlogs[0];
  
  const handleBlogClick = (slug) => {
    router.push(`/blogs/${slug}`);
  };

  return (
    <div className="min-h-screen w-full">
      {/* ─── PHASE 1: ACTIVE (Day 1) ─────────────────────── */}
      
      {/* Hero Section - Featured Story */}
      <HeroSection 
        blog={featuredBlog} 
        onBlogClick={handleBlogClick} 
      />
    
      {/* Elegant section divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-border to-transparent rounded-full" />
      </div>

      {/* Recent Highlights - Latest 3 Posts */}
      <RecentHighlightsSection
        blogs={demoBlogs} 
        onBlogClick={handleBlogClick} 
      />
      
      {/* ─── PHASE 2: COMMENTED OUT (~20 blogs) ────────────── */}
      
      {/* Trending This Week - Most Viewed in Last 7 Days */}
      {/* Uncomment when you have ~20+ blogs */}
      
      <TrendingSection 
        blogs={demoBlogs}  // TODO: Replace with trending blogs API
        onBlogClick={handleBlogClick} 
      /> 
      
      
      {/* ─── PHASE 1 & 2: ACTIVE ──────────────────────────── */}
      
      {/* Popular This Month - Top 5 Most Read */}
      <PopularPostsSection
        blogs={demoBlogs}
        onBlogClick={handleBlogClick}
      />


      {/* ─── PHASE 3: COMMENTED OUT (~30 blogs) ────────────── */}
      
      {/* Editor's Choice - Handpicked Quality Posts */}
      {/* Uncomment when you have ~30+ blogs */}
     
      <EditorsChoiceSection 
        blogs={demoBlogs}  // TODO: Replace with curated blogs API
        onBlogClick={handleBlogClick} 
      />
      
      {/* CTA Section - About + Newsletter */}
      <CTASection />
    </div>
  );
}
