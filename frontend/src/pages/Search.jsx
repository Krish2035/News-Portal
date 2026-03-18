import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    category: "",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Define the Base URL for the API
  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "",
      });
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        
        // UPDATED: Added backendBase to the fetch call
        const res = await fetch(`${backendBase}/api/post/getposts?${searchQuery}`);

        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          setLoading(false);
          setShowMore(data.posts.length === 9);
        } else {
          setLoading(false);
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [location.search, backendBase]);

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
      // UPDATED: Added backendBase to the fetch call
      const res = await fetch(`${backendBase}/api/post/getposts?${urlParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        setShowMore(data.posts.length === 9);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* SIDEBAR */}
      <aside className="p-6 md:w-1/4 bg-white border-r border-gray-300">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-gray-600">Filters</h2>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-600 text-sm">Search Term:</label>
            <Input
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={(e) => setSidebarData({ ...sidebarData, searchTerm: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-600 text-sm">Sort By:</label>
            <Select
              onValueChange={(value) => setSidebarData({ ...sidebarData, sort: value })}
              value={sidebarData.sort}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Latest</SelectItem>
                <SelectItem value="asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-600 text-sm">Category:</label>
            <Select
              onValueChange={(value) => setSidebarData({ ...sidebarData, category: value })}
              value={sidebarData.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worldnews">World News</SelectItem>
                <SelectItem value="sportsnews">Sports News</SelectItem>
                <SelectItem value="localnews">Local News</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-slate-800 text-white">
            Apply Filters
          </Button>
        </form>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold border-b p-4 text-slate-700">
          News Articles:
        </h1>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {loading && <p className="text-xl text-gray-500 animate-pulse col-span-full">Loading...</p>}
          {!loading && posts.length === 0 && <p className="text-xl text-gray-500 col-span-full">No posts found.</p>}
          
          {!loading && posts && posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {showMore && (
            <div className="col-span-full flex justify-center mt-4">
              <button onClick={handleShowMore} className="text-blue-600 hover:underline">
                Show More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;