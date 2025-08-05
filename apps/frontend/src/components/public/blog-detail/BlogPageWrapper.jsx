import {
    BlogContent,
    AuthorCard,
    BlogActions,
    CommentsSection,
    SimilarBlogs,
    BlogTagsBar,
} from "./parts";

export default function BLogPageWrapper() {
    return (
        <div>
            This contains all the components of blog-detail page.
            <BlogContent />
            <AuthorCard />
            <BlogActions />
            <BlogTagsBar />
            <SimilarBlogs />
            <CommentsSection />
        </div>
    );
}
