import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "@/components/shared/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // 🚨 FALLBACK: If VITE_API_URL is not set in .env, use your absolute Backend URL
        const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";
        const res = await fetch(`${backendBase}/api/post/getposts?limit=9`);

        // Check if the response is valid JSON before parsing to avoid "Unexpected token T"
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (res.ok) {
            setPosts(data.posts);
          } else {
            console.error("Server Error:", data.message);
          }
        } else {
          console.error("The server returned HTML instead of JSON. Check backend routing.");
        }
      } catch (error) {
        console.error("Network Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
            News <span className="text-red-500">Nova</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl">
            Where breaking stories meet deep analysis. Your daily intelligence briefing starts here.
          </p>
          <div className="flex gap-4 mt-4">
            <Link 
              to="/search" 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg hover:shadow-red-500/20"
            >
              Browse Latest
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
             <p className="text-slate-500 animate-pulse">Scanning the headlines...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center border-b pb-4 border-slate-200">
              <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-widest">
                Top Stories
              </h2>
              <Link to="/search" className="text-red-600 hover:text-red-800 font-bold text-sm transition-colors">
                View All →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div key={post._id} className="transform hover:-translate-y-2 transition-transform duration-300">
                   <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-lg italic">No news stories found at the moment.</p>
            <Link to="/search" className="text-blue-500 underline mt-2 block">Check all archives</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;