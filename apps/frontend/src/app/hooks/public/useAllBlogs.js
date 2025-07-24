
export function useAllBlogs(config) {                               // TYPE - 2
  return useSmartQuery(['allBlogs'], '/api/blogs', config);
}



// Example - inside component 

// const { data } = useAllBlogs({ staleTime: 0 });



// Fetch all public blogs to display on homepage or blog listing page.
