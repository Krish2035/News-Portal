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
    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      // UPDATED: Added backendBase
      const res = await fetch(`${backendBase}/api/post/getposts?${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        setShowMore(data.posts.length === 9);
      } else {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search, backendBase]);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const res = await fetch(`${backendBase}/api/post/getposts?${urlParams.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      setShowMore(data.posts.length === 9);
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
      <aside className="p-6 md:w-1/4 border-r">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input placeholder="Search..." value={sidebarData.searchTerm} 
            onChange={(e) => setSidebarData({ ...sidebarData, searchTerm: e.target.value })} />
          <Button type="submit" className="bg-slate-800 text-white">Apply Filters</Button>
        </form>
      </aside>
      <div className="w-full p-7">
        <h1 className="text-3xl font-semibold border-b mb-5">News Articles</h1>
        <div className="flex flex-wrap gap-4">
          {posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        {showMore && <button onClick={handleShowMore} className="text-blue-600 w-full text-center mt-5">Show More</button>}
      </div>
    </div>
  );
};

export default NewsArticles;