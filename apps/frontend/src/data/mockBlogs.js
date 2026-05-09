import { Blog } from "@/types/blog.types";
export const demoBlogs = [
    {
        _id: "1",
        title: "Getting Started with Modern Web Development",
        coverImage:
            "https://images.unsplash.com/photo-1466853817435-05b43fe45b39?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        slug: "getting-started-modern-web-dev",
        content:
            "Learn the fundamentals of modern web development, including React, TypeScript, and best practices for building scalable applications.",
        tags: ["Web Development", "React", "TypeScript"],
        publishedAt: new Date().toISOString(),
    },
    {
        _id: "5",
        title: "Getting Started with Modern Web Development",
        coverImage:
            "https://images.unsplash.com/photo-1508144753681-9986d4df99b3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        slug: "getting-started-modern-web-dev",
        content:
            "Learn the fundamentals of modern web development, including React, TypeScript, and best practices for building scalable applications.",
        tags: ["Web Development", "React", "TypeScript"],
        publishedAt: new Date().toISOString(),
    },
    {
        _id: "2",
        title: "The Art of Clean Code",
        coverImage:
            "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        slug: "art-of-clean-code",
        content:
            "Discover principles and techniques for writing maintainable, readable code that your future self will thank you for.",
        tags: ["Best Practices", "DSA"],
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        _id: "4",
        title: "The Art of Clean Code - II",
        coverImage:
            "https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        slug: "art-of-clean-code",
        content:
            "Discover principles and techniques for writing maintainable, readable code that your future self will thank you for.",
        tags: ["Best Practices", "DSA"],
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        _id: "3",
        title: "Building Responsive Layouts",
        coverImage:
            "https://images.unsplash.com/photo-1505832018823-50331d70d237?q=80&w=1508&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        slug: "building-responsive-layouts",
        content:
            "Master the art of creating beautiful, responsive layouts that work seamlessly across all devices and screen sizes.",
        tags: ["CSS", "Design", "UI", "web desgin", "DSA"],
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
    },
];
