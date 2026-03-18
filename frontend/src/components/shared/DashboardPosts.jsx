import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableCaption, TableHeader, TableRow, TableHead, TableCell } from "../ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";

const DashboardPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  const fetchPosts = async () => {
    try {
      // Relative path utilizes Vite Proxy for clean auth handling
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${userPosts.length}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  useEffect(() => {
    if (currentUser?.isAdmin) fetchPosts();
  }, [currentUser._id]);

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
        toast.success("Article deleted successfully");
      } else {
        toast.error(data.message || "Unauthorized");
      }
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="w-full p-3 overflow-x-auto scrollbar-hide">
      {currentUser?.isAdmin && userPosts.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <Table>
            <TableCaption>Managing {userPosts.length} published articles.</TableCaption>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold">Date Updated</TableHead>
                <TableHead className="font-bold">Image</TableHead>
                <TableHead className="font-bold">Title</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {userPosts.map((post) => (
                <TableRow key={post._id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-20 h-12 object-cover bg-slate-200 rounded-lg shadow-sm border border-slate-100" 
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link className="font-bold text-slate-800 hover:text-blue-600 truncate max-w-xs block" to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase">
                      {post.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Link className="text-emerald-600 font-bold hover:underline text-sm" to={`/update-post/${post._id}`}>
                        Edit
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <span onClick={() => setPostIdToDelete(post._id)} className="font-bold text-red-500 hover:underline cursor-pointer text-sm">
                            Delete
                          </span>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone. This post will be permanently removed from News Nova.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700 rounded-xl" onClick={handleDeletePost}>
                              Confirm Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {showMore && (
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={fetchPosts} className="text-blue-600 font-bold border-blue-100 hover:bg-blue-50 rounded-xl px-8">
                Load More
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium">You haven't published any news stories yet.</p>
          <Link to="/create-post">
            <Button className="mt-4 bg-blue-600 rounded-xl">Create Your First Post</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPosts;