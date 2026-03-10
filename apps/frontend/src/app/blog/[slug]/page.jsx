"use client";

// import { Calendar, Clock, Tag } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
import AppLayout from "@/components/layout/AppLayout";
//import BlogDetail from "@/ui-pages/BlogDetail";
import BlogDetail from "@/ui-pages/BlogDetail_New";  // NEW

// Demo blog - replace with actual API call
// const demoBlog = {
//   _id: "1",
//   title: "The Future of Web Development: Trends to Watch in 2025",
//   slug: "future-web-development-2025",
//   coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop",
//   content: `
//     <p>Web development continues to evolve at a rapid pace, with new technologies and methodologies emerging constantly. As we look ahead to 2025, several key trends are shaping the future of how we build for the web.</p>
    
//     <h2>The Rise of AI-Assisted Development</h2>
//     <p>Artificial intelligence is transforming how developers write code. From intelligent code completion to automated testing and bug detection, AI tools are becoming indispensable partners in the development process.</p>
    
//     <h2>Server Components and Edge Computing</h2>
//     <p>React Server Components and edge computing are revolutionizing application architecture. By moving computation closer to users and rendering on the server, we're seeing dramatic improvements in performance and user experience.</p>
    
//     <h2>The Jamstack Evolution</h2>
//     <p>The Jamstack architecture continues to mature, with improved tooling and workflows that make it easier than ever to build fast, secure, and scalable web applications.</p>
    
//     <p>These trends represent just the beginning of an exciting new chapter in web development. As developers, staying informed and adaptable will be key to success in this rapidly changing landscape.</p>
//   `,
//   tags: ["Web Development", "React", "AI", "Performance"],
//   publishedAt: new Date().toISOString(),
//   readingTime: 5,
//   author: "Editorial Team"
// };
// export default function BlogDetailPage({
//   params
// }) {
//   // In real app: const { data, isLoading, error } = useGetBlogBySlug(params.slug);
//   const blog = demoBlog;
//   const formatDate = dateString => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };
//   return <AppLayout>
//       <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Header */}
//         <header className="mb-12">
//           <div className="flex flex-wrap gap-2 mb-6">
//             {blog.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">
//                 {tag}
//               </Badge>)}
//           </div>
          
//           <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
//             {blog.title}
//           </h1>
          
//           <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
//             <span className="font-medium text-foreground">{blog.author}</span>
//             <Separator orientation="vertical" className="h-4" />
//             <div className="flex items-center gap-1.5">
//               <Calendar className="h-4 w-4" />
//               <time>{formatDate(blog.publishedAt)}</time>
//             </div>
//             <Separator orientation="vertical" className="h-4" />
//             <div className="flex items-center gap-1.5">
//               <Clock className="h-4 w-4" />
//               <span>{blog.readingTime} min read</span>
//             </div>
//           </div>
//         </header>

//         {/* Cover Image */}
//         {blog.coverImage && <figure className="mb-12 -mx-4 sm:mx-0">
//             <img src={blog.coverImage} alt={blog.title} className="w-full h-auto rounded-lg shadow-lg" />
//           </figure>}

//         {/* Content */}
//         <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{
//         __html: blog.content
//       }} />

//         {/* Footer Tags */}
//         <footer className="mt-12 pt-8 border-t border-border">
//           <div className="flex items-start gap-3">
//             <Tag className="h-5 w-5 text-muted-foreground mt-1" />
//             <div className="flex flex-wrap gap-2">
//               {blog.tags.map(tag => <Badge key={tag} variant="outline">
//                   {tag}
//                 </Badge>)}
//             </div>
//           </div>
//         </footer>
//       </article>
//     </AppLayout>;
// }


export default function BlogDetailPage() {
  return( 
  <AppLayout>
    <BlogDetail />
  </AppLayout>
  );
}
