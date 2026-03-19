import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PostCard from "@/components/shared/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NewsArticles = () => {
  const [sidebarData, setSidebarData] = useState({ searchTerm: "", sort: "desc", category: "" });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

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
        const res = await fetch(`${backendBase}/api/post/getposts?${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search, backendBase]);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    try {
      const res = await fetch(`${backendBase}/api/post/getposts?${urlParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error("Show more error:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="p-6 md:w-1/4 border-r border-slate-200">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-slate-700">Search Term:</label>
            <Input 
              placeholder="Search..." 
              value={sidebarData.searchTerm} 
              onChange={(e) => setSidebarData({ ...sidebarData, searchTerm: e.target.value })} 
            />
          </div>
          <Button type="submit" className="bg-slate-800 text-white hover:bg-slate-900 transition-colors">
            Apply Filters
          </Button>
        </form>
      </aside>
      <div className="w-full p-7">
        <h1 className="text-3xl font-bold border-b pb-4 mb-5 text-slate-800">News Articles</h1>
        
        {loading && (
          <p className="text-xl text-slate-500 animate-pulse text-center w-full py-10">Loading stories...</p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-xl text-slate-500 text-center w-full py-10">No articles found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && posts && posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        
        {showMore && (
          <button 
            onClick={handleShowMore} 
            className="text-blue-600 hover:underline w-full text-center mt-8 font-medium"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default NewsArticles;