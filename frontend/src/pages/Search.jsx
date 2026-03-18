import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// CRITICAL: Double check if your file is 'PostCard.jsx' or 'Postcard.jsx'
import PostCard from "@/components/shared/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "worldnews", // Defaulting to a valid category or empty string
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "",
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        // Standard limit is usually 9 for these templates
        setShowMore(data.posts.length === 9);
      } catch (error) {
        setLoading(false);
        console.error("Search fetch error:", error);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
  };

  const handleSelectChange = (id, value) => {
    // If user selects "all", we set category to empty string
    const finalValue = value === "uncategorized" ? "" : value;
    setSidebarData({ ...sidebarData, [id]: finalValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    try {
      const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        setShowMore(data.posts.length === 9);
      }
    } catch (error) {
      console.error("Show more error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* SIDEBAR FILTERS */}
      <aside className="p-7 md:w-80 bg-white border-r border-slate-200 shadow-sm">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Filters</h2>
            <p className="text-xs text-slate-500">Refine your news feed</p>
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-bold text-slate-700 text-sm ml-1">Search Keywords</label>
            <Input
              placeholder="e.g. Technology, AI..."
              id="searchTerm"
              type="text"
              className="rounded-xl border-slate-200 bg-white"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-bold text-slate-700 text-sm ml-1">Sort Order</label>
            <Select
              onValueChange={(val) => handleSelectChange("sort", val)}
              value={sidebarData.sort}
            >
              <SelectTrigger className="rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Latest first" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white shadow-xl">
                <SelectItem value="desc">Latest Articles</SelectItem>
                <SelectItem value="asc">Oldest Articles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-bold text-slate-700 text-sm ml-1">Category</label>
            <Select
              onValueChange={(val) => handleSelectChange("category", val)}
              value={sidebarData.category || "uncategorized"}
            >
              <SelectTrigger className="rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white shadow-xl">
                <SelectItem value="uncategorized">All Categories</SelectItem>
                <SelectItem value="worldnews">World News</SelectItem>
                <SelectItem value="sportsnews">Sports</SelectItem>
                <SelectItem value="localnews">Local News</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-2xl shadow-lg transition-all">
            Apply Filters
          </Button>
        </form>
      </aside>

      {/* RESULTS AREA */}
      <main className="flex-1 p-7">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Search Results
          </h1>
          {!loading && <span className="text-sm font-medium text-slate-500">{posts.length} articles found</span>}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading && (
            <div className="col-span-full py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"></div>
              <p className="mt-4 text-slate-500 font-medium">Searching News Nova...</p>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400 font-medium text-lg">No articles match your criteria.</p>
              <Button variant="link" onClick={() => navigate('/search')} className="text-blue-600">Clear all filters</Button>
            </div>
          )}
          
          {!loading && posts && posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {showMore && (
            <div className="col-span-full flex justify-center py-10">
              <Button 
                variant="outline" 
                onClick={handleShowMore} 
                className="rounded-full px-10 border-blue-200 text-blue-600 font-bold hover:bg-blue-50"
              >
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;