import React from "react";
import { Link } from "react-router-dom";

/**
 * PostCard Component
 * Renders an individual news post with optimized image handling and metadata.
 */
const PostCard = ({ post }) => {
  // 1. Image URL Sanitization Logic
  const getSafeImageUrl = (url) => {
    if (!url) return "https://placehold.co/600x400/e2e8f0/1e293b?text=News+Nova";

    // Handle local/backend uploads
    if (url.startsWith("/uploads")) {
      const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";
      // Ensure no double slashes if backendBase ends with /
      const cleanBase = backendBase.endsWith('/') ? backendBase.slice(0, -1) : backendBase;
      return `${cleanBase}${url}`;
    }

    // Handle Appwrite specific transformations
    if (url.includes('appwrite.io')) {
      try {
        const urlObj = new URL(url);
        // Swap 'preview' for 'view' to get full resolution
        const path = urlObj.pathname.replace('/preview', '/view');
        const projectId = urlObj.searchParams.get('project') || import.meta.env.VITE_APPWRITE_PROJECT_ID;
        return `${urlObj.origin}${path}?project=${projectId}`;
      } catch (e) {
        return url.replace('/preview', '/view');
      }
    }
    
    return url;
  };

  // 2. Metadata Calculations
  // Strips HTML tags before counting words for an accurate reading time
  const readingTime = post.content 
    ? Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200) 
    : 1;

  // Formats date safely to prevent crashes on invalid strings
  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : "Recently";

  return (
    <div className="group relative w-full border border-slate-300 rounded-2xl bg-white overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-500">
      
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-blue-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg shadow-lg tracking-wider group-hover:bg-red-600 transition-colors duration-300">
          {post.category || 'General'}
        </span>
      </div>

      {/* Image Container */}
      <Link to={`/post/${post.slug}`} className="h-[220px] w-full block overflow-hidden bg-slate-200">
        <img
          src={getSafeImageUrl(post.image)}
          alt={post.title || "News Story"}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/600x400/e2e8f0/1e293b?text=Image+Not+Found";
          }}
        />
      </Link>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div>
          <Link to={`/post/${post.slug}`}>
            <h3 className="text-xl font-bold line-clamp-2 text-slate-900 leading-tight group-hover:text-blue-600 transition-colors duration-300">
              {post.title}
            </h3>
          </Link>
          
          <div className="flex justify-between items-center text-[12px] text-slate-600 font-bold mt-4">
            <span className="bg-slate-100 border border-slate-300 px-2 py-1 rounded-md">
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              {readingTime} min read
            </span>
          </div>
        </div>
        
        <Link 
          to={`/post/${post.slug}`}
          className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm text-center hover:bg-blue-600 shadow-md hover:shadow-blue-200 transition-all active:scale-95 mt-2"
        >
          Read Full Story
        </Link>
      </div>
    </div>
  );
};

/**
 * Loading Placeholder (Skeleton)
 * Use this in your parent component while fetching data.
 */
export const PostCardSkeleton = () => (
  <div className="w-full border border-slate-200 rounded-2xl bg-white overflow-hidden flex flex-col h-full animate-pulse">
    <div className="h-[220px] w-full bg-slate-200" />
    <div className="p-6 flex flex-col flex-1 justify-between gap-4">
      <div>
        <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-2" />
        <div className="h-6 bg-slate-200 rounded-md w-1/2" />
        <div className="flex justify-between items-center mt-6">
          <div className="h-6 bg-slate-100 rounded-md w-24" />
          <div className="h-4 bg-slate-100 rounded-md w-16" />
        </div>
      </div>
      <div className="h-12 bg-slate-200 rounded-xl w-full mt-2" />
    </div>
  </div>
);

export default PostCard;