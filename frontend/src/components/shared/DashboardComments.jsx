import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
          // Safety Catch: Handle both { comments: [] } and direct [] responses
          const fetchedComments = data.comments || data;

          if (Array.isArray(fetchedComments)) {
            setComments(fetchedComments);
            if (fetchedComments.length < 9) {
              setShowMore(false);
            }
          }
        }
      } catch (error) {
        console.log("Error fetching comments:", error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id, currentUser.isAdmin]); // Correct dependencies

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`,
      );
      const data = await res.json();

      if (res.ok) {
        const newComments = data.comments || data;
        if (Array.isArray(newComments)) {
          setComments((prev) => [...prev, ...newComments]);
          if (newComments.length < 9) {
            setShowMore(false);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();

      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete),
        );
        toast.success("Comment deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete comment");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("An error occurred while deleting");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-3 overflow-x-auto">
      {currentUser?.isAdmin && comments.length > 0 ? (
        <>
          <Table>
            <TableCaption>A list of recent comments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date Updated</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Number of Likes</TableHead>
                <TableHead>PostId</TableHead>
                <TableHead>UserId</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {comments.map((comment) => (
                <TableRow
                  key={comment._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {comment.content}
                  </TableCell>
                  <TableCell>{comment.numberOfLikes}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {comment.postId}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {comment.userId}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span
                          onClick={() => setCommentIdToDelete(comment._id)}
                          className="font-medium text-red-600 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this comment from the server.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDeleteComment}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-blue-700 self-center text-sm py-7 hover:underline"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 mt-10">
          <p className="text-gray-500 italic">You have no comments yet!</p>
          {!currentUser?.isAdmin && (
            <p className="text-red-500 text-xs">Admin access required.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardComments;
