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

  return (
    <div className="group relative w-full border border-slate-200 rounded-xl bg-white overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm tracking-wider">
          {post.category || 'General'}
        </span>
      </div>

      {/* Image Container */}
      <Link to={`/post/${post.slug}`} className="h-[200px] w-full block overflow-hidden bg-slate-100">
        <img
          src={getSafeImageUrl(post.image)}
          alt={post.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null; // Prevents infinite loops
            e.target.src = "https://placehold.co/600x400/e2e8f0/1e293b?text=Image+Not+Found";
          }}
        />
      </Link>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <Link to={`/post/${post.slug}`}>
            <h3 className="text-lg font-bold line-clamp-2 text-slate-900 leading-snug group-hover:text-red-600 transition-colors">
              {post.title}
            </h3>
          </Link>
          
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold mt-3">
            <span className="bg-slate-100 px-2 py-0.5 rounded">
              {new Date(post.createdAt).toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
              {post.content ? `${Math.ceil(post.content.length / 1000)} min read` : 'Quick Read'}
            </span>
          </div>
        </div>
        
        <Link 
          to={`/post/${post.slug}`}
          className="w-full border-2 border-slate-900 text-slate-900 font-bold py-2 rounded-lg text-sm text-center group-hover:bg-slate-900 group-hover:text-white transition-all active:scale-95"
        >
          Read Full Story
        </Link>
      </div>
    </div>
  );
};

export default PostCard;