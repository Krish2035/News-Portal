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
import { Link } from "react-router-dom";
import { toast } from "sonner";

const DashboardPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts?userId=${currentUser._id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("Error fetching posts:", error.message);
      }
    };
    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleDeletePost = async () => {
    if (!postIdToDelete || !currentUser?._id) return;

    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include", // Essential for sending the access_token cookie
        },
      );
      const data = await res.json();

      if (!res.ok) {
        // If this triggers 401, the verifyToken middleware rejected the cookie
        toast.error(data.message || "Unauthorized action");
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete),
        );
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      console.log("Delete error:", error.message);
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-3 overflow-x-auto">
      {currentUser?.isAdmin && userPosts.length > 0 ? (
        <>
          <Table>
            <TableCaption>A list of your published articles.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date Updated</TableHead>
                <TableHead>Post Image</TableHead>
                <TableHead>Post Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Delete</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {userPosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500 rounded-md"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-medium text-gray-900"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span
                          onClick={() => setPostIdToDelete(post._id)}
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
                            delete your post.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDeletePost}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-medium text-green-600 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <p className="mt-10">You have no posts yet!</p>
      )}
    </div>
  );
};

export default DashboardPosts;