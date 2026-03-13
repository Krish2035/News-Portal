import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const getSafeImageUrl = (url) => {
    // 1. Fallback for empty URLs
    if (!url) return "https://placehold.co/600x400/e2e8f0/1e293b?text=News+Nova";

    // 2. Handle Appwrite URLs specifically
    if (url.includes('appwrite.io')) {
      try {
        const urlObj = new URL(url);
        
        // Change 'preview' to 'view' for full resolution if needed
        urlObj.pathname = urlObj.pathname.replace('/preview', '/view');
        
        // Get Project ID from existing URL or Environment Variable
        const projectId = urlObj.searchParams.get('project') || import.meta.env.VITE_APPWRITE_PROJECT_ID;
        
        // Return cleaned URL with essential Project ID
        return `${urlObj.origin}${urlObj.pathname}?project=${projectId}`;
      } catch (e) {
        // Fallback if URL parsing fails
        return url.replace('/preview', '/view');
      }
    }
    
    return url;
  };

  return (
    <div className="group relative w-full border border-slate-200 rounded-xl bg-white overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all">
      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-blue-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow">
          {post.category}
        </span>
      </div>

      {/* Image Container */}
      <Link to={`/post/${post.slug}`} className="h-[180px] w-full block overflow-hidden bg-slate-100">
        <img
          src={getSafeImageUrl(post.image)}
          alt={post.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400/e2e8f0/1e293b?text=Image+Not+Found";
          }}
        />
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <Link to={`/post/${post.slug}`}>
            <h3 className="text-lg font-bold line-clamp-2 text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
              {post.title}
            </h3>
          </Link>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-2">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>{post.content ? `${Math.ceil(post.content.length / 1000)} min read` : 'News'}</span>
          </div>
        </div>
        
        <Link 
          to={`/post/${post.slug}`}
          className="w-full border-2 border-slate-900 text-slate-900 font-bold py-2 rounded-lg text-sm text-center group-hover:bg-slate-900 group-hover:text-white transition-all"
        >
          Read Full Story
        </Link>
      </div>
    </div>
  );
};

export default PostCard;