import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "../ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const DashboardComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${backendBase}/api/comment/getcomments`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) setShowMore(false);
        } else {
          toast.error(data.message || "Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error.message);
      }
    };
    if (currentUser?.isAdmin) fetchComments();
  }, [currentUser?._id, backendBase]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`${backendBase}/api/comment/getcomments?startIndex=${startIndex}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(`${backendBase}/api/comment/deleteComment/${commentIdToDelete}`, { 
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete));
        toast.success(data.message || "Comment deleted");
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="w-full">
      {currentUser?.isAdmin && comments.length > 0 ? (
        <div className="w-full">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto scrollbar-hide bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">Date Updated</TableHead>
                  <TableHead className="font-bold">Comment</TableHead>
                  <TableHead className="font-bold">Likes</TableHead>
                  <TableHead className="font-bold">PostId</TableHead>
                  <TableHead className="font-bold">UserId</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y">
                {comments.map((comment) => (
                  <TableRow key={comment._id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">{new Date(comment.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="max-w-xs truncate text-slate-800 font-medium">{comment.content}</TableCell>
                    <TableCell className="text-center font-bold text-blue-600">{comment.numberOfLikes}</TableCell>
                    <TableCell className="font-mono text-[10px] text-slate-400">{comment.postId}</TableCell>
                    <TableCell className="font-mono text-[10px] text-slate-400">{comment.userId}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <span onClick={() => setCommentIdToDelete(comment._id)} className="text-red-500 font-bold hover:underline cursor-pointer text-sm">Delete</span>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader><AlertDialogTitle>Remove Comment?</AlertDialogTitle></AlertDialogHeader>
                          <AlertDialogDescription>This action will permanently delete the comment from the platform.</AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700 rounded-xl" onClick={handleDeleteComment}>Confirm Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden flex flex-col gap-4 p-2">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Updated</span>
                    <span className="text-xs font-bold text-slate-700">{new Date(comment.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Likes</span>
                    <span className="text-xs font-bold text-blue-600">{comment.numberOfLikes} Likes</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-sm text-slate-700 leading-relaxed relative">
                  <span className="absolute -top-2 left-4 bg-white px-2 text-[8px] font-bold text-slate-300 uppercase">Content</span>
                  "{comment.content}"
                </div>

                <div className="grid grid-cols-1 gap-2">
                   <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-bold uppercase">Post ID:</span>
                      <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{comment.postId}</span>
                   </div>
                   <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-bold uppercase">User ID:</span>
                      <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{comment.userId}</span>
                   </div>
                </div>

                <div className="pt-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button 
                        onClick={() => setCommentIdToDelete(comment._id)} 
                        className="w-full h-12 rounded-xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors border border-red-100"
                      >
                        Permanently Remove
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader><AlertDialogTitle>Delete Comment Forever?</AlertDialogTitle></AlertDialogHeader>
                      <AlertDialogDescription>This action is irreversible and the comment will be gone for good.</AlertDialogDescription>
                      <AlertDialogFooter className="flex flex-col gap-2">
                        <AlertDialogAction className="w-full bg-red-600 rounded-xl" onClick={handleDeleteComment}>Confirm Removal</AlertDialogAction>
                        <AlertDialogCancel className="w-full rounded-xl border-none">Keep Comment</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>

          {showMore && (
            <div className="flex justify-center mt-6 pb-6">
              <button onClick={handleShowMore} className="w-full md:w-auto text-blue-600 font-bold hover:underline py-4 px-8 bg-blue-50 rounded-xl border border-blue-100">
                Show More Comments
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 text-slate-400 italic font-medium">No comments found in the database.</div>
      )}
    </div>
  );
};

export default DashboardComments;