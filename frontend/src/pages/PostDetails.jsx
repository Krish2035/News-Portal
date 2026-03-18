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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* Article Header */}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-5xl font-bold text-slate-900 leading-tight">
        {post && post.title}
      </h1>

      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs" className="bg-slate-100 text-slate-800 hover:bg-red-600 hover:text-white transition-all uppercase text-xs font-bold px-4 py-1 rounded-full">
          {post && post.category}
        </Button>
      </Link>

      {/* Featured Image */}
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover rounded-3xl shadow-2xl"
      />

      {/* Metadata */}
      <div className="flex justify-between p-3 border-b border-slate-300 mx-auto w-full max-w-2xl text-xs sm:text-sm font-semibold text-slate-500 italic">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="text-red-600">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/* Main Content (Rich Text Rendering) */}
      <div
        className="p-3 max-w-3xl mx-auto w-full post-content leading-relaxed text-slate-800"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
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