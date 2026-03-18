import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const navigate = useNavigate();

  // Appwrite 403 error bypass for comment section avatars
  const getSafeImageUrl = (url) => {
    if (!url) return null;
    if (url.includes('appwrite.io')) {
      let safeUrl = url.replace('/preview', '/view');
      const basePart = safeUrl.split('?')[0];
      const projectPart = safeUrl.includes('project=') 
        ? `?project=${new URLSearchParams(safeUrl.split('?')[1]).get('project')}` 
        : '';
      return `${basePart}${projectPart}`;
    }
    return url;
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setAllComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    getComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200 || comment.length === 0) {
      toast.error("Comment must be between 1 and 200 characters.");
      return;
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setComment("");
        toast.success("Comment added successfully!");
        setAllComments([data, ...allComments]);
      } else {
        toast.error(data.message || "Failed to post comment");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });

      if (res.ok) {
        const data = await res.json();
        setAllComments(
          allComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment,
          ),
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = (comment, editedContent) => {
    setAllComments(
      allComments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c,
      ),
    );
  };

  const handleDelete = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAllComments(allComments.filter((c) => c._id !== commentId));
        toast.success("Comment deleted");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-slate-500 text-sm">
          <p>Signed in as:</p>
          <img
            src={getSafeImageUrl(currentUser.profilePicture)}
            alt="Profile"
            className="h-6 w-6 object-cover rounded-full border border-slate-200"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-slate-600 my-5 flex gap-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span>You must be signed in to join the discussion.</span>
          <Link to={"/sign-in"} className="text-blue-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form className="border border-slate-300 rounded-lg p-4 bg-white shadow-sm" onSubmit={handleSubmit}>
          <Textarea
            placeholder="Add a comment..."
            className="border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 min-h-[100px]"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            maxLength="200"
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-slate-400 text-xs italic">{200 - comment.length} characters remaining</p>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-semibold">
              Post Comment
            </Button>
          </div>
        </form>
      )}

      <div className="mt-10">
        {allComments.length === 0 ? (
          <p className="text-sm text-slate-400 text-center italic py-10 border-t border-slate-100">
            Be the first to share your thoughts on this story.
          </p>
        ) : (
          <>
            <div className="text-sm my-5 flex items-center gap-2 font-bold text-slate-800">
              <p>Discussion</p>
              <span className="bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full text-xs">
                {allComments.length}
              </span>
            </div>
            <div className="space-y-4">
              {allComments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;