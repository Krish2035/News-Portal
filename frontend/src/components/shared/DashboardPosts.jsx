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

  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${backendBase}/api/post/getposts?userId=${currentUser._id}&startIndex=${userPosts.length}`);
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
      const res = await fetch(`${backendBase}/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
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
    <div className="w-full">
      {currentUser?.isAdmin && userPosts.length > 0 ? (
        <div className="w-full">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <Table>
              <TableCaption>Managing {userPosts.length} published articles.</TableCaption>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold whitespace-nowrap">Date Updated</TableHead>
                  <TableHead className="font-bold">Image</TableHead>
                  <TableHead className="font-bold">Title</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y">
                {userPosts.map((post) => (
                  <TableRow key={post._id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="text-slate-500 text-sm whitespace-nowrap">
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
                      <Link className="font-bold text-slate-800 hover:text-blue-600 truncate max-w-[200px] block" to={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase">
                        {post.category}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
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
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {userPosts.map((post) => (
              <div key={post._id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex gap-4">
                  <Link to={`/post/${post.slug}`} className="shrink-0">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-24 h-16 object-cover bg-slate-200 rounded-xl border border-slate-100 shadow-sm" 
                    />
                  </Link>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                    <Link to={`/post/${post.slug}`} className="font-bold text-slate-800 line-clamp-2 leading-snug">
                      {post.title}
                    </Link>
                    <div className="mt-1">
                       <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <Link className="text-emerald-600 font-bold hover:underline text-sm px-4 py-2 bg-emerald-50 rounded-xl" to={`/update-post/${post._id}`}>
                    Edit Post
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button onClick={() => setPostIdToDelete(post._id)} className="font-bold text-red-500 hover:underline text-sm px-4 py-2 bg-red-50 rounded-xl">
                        Delete
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                        <AlertDialogDescription>This action is permanent.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-col gap-2">
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700 rounded-xl w-full" onClick={handleDeletePost}>
                          Delete Forever
                        </AlertDialogAction>
                        <AlertDialogCancel className="rounded-xl w-full border-none">Cancel</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>

          {showMore && (
            <div className="flex justify-center mt-6 pb-4">
              <Button variant="outline" onClick={fetchPosts} className="w-full md:w-auto text-blue-600 font-bold border-blue-100 hover:bg-blue-50 rounded-xl px-8">
                Load More Articles
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