import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import Advertise from "@/components/shared/Advertise";
import CommentSection from "@/components/shared/CommentSection";
import PostCard from "@/components/shared/PostCard";

const PostDetails = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentArticles, setRecentArticles] = useState(null);

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
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentArticles(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img
          src="https://cdn-icons-png.flaticon.com/128/39/39979.png"
          alt="loading"
          className="w-20 animate-spin"
        />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center mt-20 text-slate-500">
        Post not found or something went wrong.
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl m-auto min-h-screen">
      {/* Article Header */}
      <h1 className="text-3xl mt-10 p-3 text-center font-bold max-w-3xl mx-auto lg:text-5xl text-slate-800 leading-tight">
        {post.title}
      </h1>

      <Link
        to={`/search?category=${post.category}`}
        className="self-center mt-5"
      >
        <Button
          variant="outline"
          className="border border-slate-500 rounded-full hover:bg-slate-100 transition-colors"
        >
          {post.category}
        </Button>
      </Link>

      {/* Main Post Image */}
      <img
        src={post.image}
        alt={post.title}
        className="mt-10 max-h-[600px] w-full object-cover rounded-xl shadow-lg border border-slate-200"
      />

      {/* Metadata Row */}
      <div className="flex justify-between items-center p-4 mx-auto w-full max-w-3xl text-sm text-slate-500 border-b border-slate-200 mt-5">
        <span className="font-medium">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="italic bg-slate-100 px-3 py-1 rounded-full text-xs">
          {Math.max(1, (post.content.length / 1000).toFixed(0))} mins read
        </span>
      </div>

      {/* CRITICAL FIX: Post Content Styling
          We use 'prose' and 'prose-slate' for automatic typography.
          We also inject a local style to handle specific editor quirks.
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .post-content p { margin-bottom: 1.5rem; line-height: 1.8; color: #334155; }
        .post-content b, .post-content strong { color: #0f172a; font-weight: 700; }
        .post-content h2 { font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; color: #1e293b; }
      `,
        }}
      />

      <div
        className="p-6 max-w-3xl mx-auto w-full post-content prose prose-lg lg:prose-xl prose-slate break-words"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      <Separator className="my-10 bg-slate-200 max-w-4xl mx-auto" />

      {/* Commercial/Ad Section */}
      <div className="max-w-4xl mx-auto w-full mb-10">
        <Advertise />
      </div>

      {/* Engagement Section */}
      <CommentSection postId={post._id} />

      {/* Recent Articles Grid */}
      <section className="flex flex-col justify-center items-center mb-10 border-t border-slate-100 pt-10">
        <h2 className="text-2xl font-bold mb-8 text-slate-800">
          Recently Published Articles
        </h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {recentArticles &&
            recentArticles.map((article) => (
              <PostCard key={article._id} post={article} />
            ))}
        </div>
      </section>
    </main>
  );
};

export default PostDetails;
