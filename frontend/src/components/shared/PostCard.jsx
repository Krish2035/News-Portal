import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const getSafeImageUrl = (url) => {
    // 1. Fallback for empty or undefined URLs
    if (!url) return "https://placehold.co/600x400/e2e8f0/1e293b?text=News+Nova";

    // 2. Handle Local Backend Uploads (for /uploads folder)
    if (url.startsWith("/uploads")) {
      const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";
      return `${backendBase}${url}`;
    }

    // 3. Handle Appwrite URLs specifically
    if (url.includes('appwrite.io')) {
      try {
        const urlObj = new URL(url);
        
        // Use 'view' instead of 'preview' for full resolution and reliability
        if (urlObj.pathname.includes('/preview')) {
          urlObj.pathname = urlObj.pathname.replace('/preview', '/view');
        }
        
        // Use the Project ID from the URL or fallback to Env variable
        const projectId = urlObj.searchParams.get('project') || import.meta.env.VITE_APPWRITE_PROJECT_ID;
        
        // Reconstruct to ensure a clean request
        return `${urlObj.origin}${urlObj.pathname}?project=${projectId}`;
      } catch (e) {
        // Fallback for malformed URLs
        return url.replace('/preview', '/view');
      }
    }
    
    return url;
  };

  // Helper to calculate reading time
  const readingTime = post.content 
    ? Math.ceil(post.content.split(/\s+/).length / 200) // Based on 200 words per minute
    : 1;

  return (
    <div className="group relative w-full border border-slate-200 rounded-2xl bg-white overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-500">
      
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-blue-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg shadow-lg tracking-wider group-hover:bg-red-600 transition-colors duration-300">
          {post.category || 'General'}
        </span>
      </div>

      {/* Image Container */}
      <Link to={`/post/${post.slug}`} className="h-[220px] w-full block overflow-hidden bg-slate-100">
        <img
          src={getSafeImageUrl(post.image)}
          alt={post.title}
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
          
          <div className="flex justify-between items-center text-[12px] text-slate-500 font-semibold mt-4">
            <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
              {new Date(post.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-1.5">
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

export default PostCard;