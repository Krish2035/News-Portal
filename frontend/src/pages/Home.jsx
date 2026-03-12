import PostCard from "@/components/shared/PostCard";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=9"); // Increased limit for better grid
        const data = await res.json();
        if (res.ok) setPosts(data.posts);
      } catch (error) {
        console.error("Network Error:", error.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Modern Gradient */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
            News <span className="text-red-500">Nova</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl">
            Where breaking stories meet deep analysis. Your daily intelligence briefing starts here.
          </p>
          <div className="flex gap-4 mt-4">
            <Link to="/search" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-all">
              Browse Latest
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-6">
        {posts && posts.length > 0 ? (
          <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-widest">Top Stories</h2>
              <Link to="/search" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                View All →
              </Link>
            </div>
            
            {/* The News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div key={post._id} className="transform hover:-translate-y-1 transition-transform duration-300">
                   <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-500 py-20">Loading news feed...</p>
        )}
      </div>
    </div>
  );
};

export default Home;