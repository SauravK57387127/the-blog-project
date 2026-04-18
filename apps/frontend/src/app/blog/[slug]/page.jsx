import AppLayout from '@/components/layout/AppLayout';
import BlogDetail from '@/ui-pages/BlogDetail';
import { apiBaseUrl } from '@/config';
 
async function getBlogData(slug) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/public/blogs/${slug}`, {
      next: { revalidate: 300 }, // ISR — 5 min cache per slug
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}
 
export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogData(slug);
 
  return (
    <AppLayout>
      <BlogDetail blog={blog} slug={slug} />
    </AppLayout>
  );
}
