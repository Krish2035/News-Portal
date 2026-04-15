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
    <div className="flex flex-col items-center justify-center w-full p-3">
      {currentUser?.isAdmin && comments.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Updated</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>PostId</TableHead>
                <TableHead>UserId</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {comments.map((comment) => (
                <TableRow key={comment._id} className="bg-white">
                  <TableCell>{new Date(comment.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                  <TableCell>{comment.numberOfLikes}</TableCell>
                  <TableCell className="font-mono text-xs">{comment.postId}</TableCell>
                  <TableCell className="font-mono text-xs">{comment.userId}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span onClick={() => setCommentIdToDelete(comment._id)} className="text-red-600 cursor-pointer hover:underline">Delete</span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600" onClick={handleDeleteComment}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-blue-700 py-7 text-sm font-semibold">Show More</button>
          )}
        </>
      ) : (
        <div className="mt-10 text-gray-400 italic font-medium">No comments found in database.</div>
      )}
    </div>
  );
};

export default DashboardComments;