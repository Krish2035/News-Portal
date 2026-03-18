import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableCaption, TableHeader, TableRow, TableHead, TableCell } from "../ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const DashboardComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          const fetchedComments = data.comments || data;
          if (Array.isArray(fetchedComments)) {
            setComments(fetchedComments);
            if (fetchedComments.length < 9) setShowMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching comments:", error.message);
      }
    };
    if (currentUser?.isAdmin) fetchComments();
  }, [currentUser?._id, currentUser?.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        const newComments = data.comments || data;
        setComments((prev) => [...prev, ...newComments]);
        if (newComments.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete));
        toast.success("Comment deleted");
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
            <button onClick={handleShowMore} className="w-full text-blue-700 py-7 text-sm">Show More</button>
          )}
        </>
      ) : (
        <div className="mt-10 text-gray-500 italic">No comments found.</div>
      )}
    </div>
  );
};

export default DashboardComments;