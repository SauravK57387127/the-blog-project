'use client'

import { useSmartQuery } from "@/utils/apiClient"


export function useAllBlogs(options = {}) {
  return useSmartQuery([ "allBlogs" ], "/public/blogs", {
    enabled: true,
    ...options,
  });
}


export function useGetBlogBySlug(slug, options = {}) {
  return useSmartQuery([ "blog", slug ], `/public/blogs/${slug}`, {
    enabled: Boolean(slug),
    ...options,
  });
}

