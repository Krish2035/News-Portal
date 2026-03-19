import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/shared/PostCard";

const PostDetails = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  // 1. Dynamic Backend URL Logic (Critical for Vercel deployment)
  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";
  const cleanBase = backendBase.endsWith('/') ? backendBase.slice(0, -1) : backendBase;

  const getSafeImageUrl = (url) => {
    if (!url) return "https://placehold.co/1200x600/e2e8f0/1e293b?text=News+Nova";
    if (url.startsWith("/uploads")) {
      return `${cleanBase}${url}`;
    }
    if (url.includes('appwrite.io')) {
      return url.replace('/preview', '/view');
    }
    return url;
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // FIXED: Using absolute URL to ensure it hits your backend API
        const res = await fetch(`${cleanBase}/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        
        if (!res.ok || !data.posts || data.posts.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }
        
        setPost(data.posts[0]);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug, cleanBase]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`${cleanBase}/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, [cleanBase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Story not found</h2>
        <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen animate-in fade-in duration-500 overflow-x-hidden">
      {/* Article Header */}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-5xl font-bold text-slate-900 leading-tight">
        {post.title}
      </h1>

      <Link to={`/search?category=${post.category}`} className="self-center mt-5">
        <Button className="bg-slate-100 text-slate-800 hover:bg-red-600 hover:text-white transition-all uppercase text-xs font-bold px-4 py-1 rounded-full">
          {post.category || "General"}
        </Button>
      </Link>

      <img
        src={getSafeImageUrl(post.image)}
        alt={post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover rounded-3xl shadow-2xl"
      />

      {/* Metadata */}
      <div className="flex justify-between p-3 border-b border-slate-300 mx-auto w-full max-w-2xl text-xs sm:text-sm font-semibold text-slate-500 italic">
        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <span className="text-red-600">
          {Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min read
        </span>
      </div>

      {/* Main Content with Typography Fixes */}
      <div
        className="p-3 max-w-3xl mx-auto w-full post-content 
                   leading-relaxed text-slate-800 
                   break-normal whitespace-normal text-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      <hr className="border-slate-200 my-10" />

      {/* Recent News Section */}
      <div className="flex flex-col justify-center items-center mb-10">
        <h2 className="text-2xl font-bold mb-8 text-slate-900">Recent Stories in News Nova</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
          {recentPosts &&
            recentPosts.map((recentPost) => (
              <PostCard key={recentPost._id} post={recentPost} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default PostDetails;