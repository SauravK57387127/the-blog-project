import { BlogList, SearchBar, TagSidebar, NoBlogsFound } from "./partials";

export default function PublicHomeWrapper() {
    return (
        <div>
            <SearchBar />
            <BlogList />
            <TagSidebar />
            <NoBlogsFound />
        </div>
    );
}
