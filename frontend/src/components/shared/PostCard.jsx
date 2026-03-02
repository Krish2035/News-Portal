import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="group relative w-full border border-gray-400 hover:shadow-2xl transition-all h-[400px] overflow-hidden rounded-lg sm:w-[350px] flex flex-col bg-white">
      {/* Image Section */}
      <Link
        to={`/post/${post.slug}`}
        className="h-[240px] w-full overflow-hidden"
      >
        <img
          src={post.image}
          alt="post cover"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 bg-gray-200"
        />
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <p className="text-lg font-bold line-clamp-2 text-slate-800 h-[56px]">
          {post.title}
        </p>

        <span className="italic text-sm text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded-md">
          {post.category}
        </span>

        {/* Read Article Button - Pushed to bottom via mt-auto */}
        <Link
          to={`/post/${post.slug}`}
          className="mt-auto border border-slate-600 text-slate-600 hover:bg-blue-600 hover:text-white text-center py-2 rounded-md transition-colors duration-300 font-semibold"
        >
          Read Article
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
