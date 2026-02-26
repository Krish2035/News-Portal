import PostCard from "@/components/shared/PostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Matches the backend route /api/post/getposts
        const res = await fetch("/api/post/getposts?limit=6");
        const data = await res.json();

        if (res.ok) {
          setPosts(data.posts);
        } else {
          // If backend returns a 500, data.message will explain why
          console.error("Backend Error:", data.message);
        }
      } catch (error) {
        console.error("Network Error:", error.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 lg:text-6xl">
          Welcome to <span className="text-red-600">Morning Dispatch</span>
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm">
          Your trusted source for the latest headlines and breaking news every
          morning.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
