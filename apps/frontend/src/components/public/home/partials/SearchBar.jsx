export default function SearchBar() {
    return (
        <div>
            handles ?q=search-term
        </div>
    )
}





// ### 1. Backend endpoints (sufficient for your scope):

// ```http
// GET /api/blogs?limit=10&offset=0          // base batch fetch
// GET /api/blogs/search?q=term              // search by text
// GET /api/blogs/tag/:slug?limit=10         // fetch blogs by tag
// ```


