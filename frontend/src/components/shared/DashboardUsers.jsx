import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableCaption, TableHeader, TableRow, TableHead, TableCell } from "../ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";

const DashboardUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${backendBase}/api/user/getusers`, {
          method: "GET",
          credentials: "include", 
        });
        const data = await res.json();
        
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) setShowMore(false);
        } else {
          toast.error(data.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };
    if (currentUser?.isAdmin) fetchUsers();
  }, [currentUser?._id, backendBase]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`${backendBase}/api/user/getusers?startIndex=${startIndex}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`${backendBase}/api/user/delete/${userIdToDelete}`, { 
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userIdToDelete));
        toast.success(data.message || "User deleted");
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="w-full">
      {currentUser?.isAdmin && users.length > 0 ? (
        <div className="w-full">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto scrollbar-hide bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <Table className="min-w-[700px]">
              <TableCaption>A list of your registered users.</TableCaption>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">Joined On</TableHead>
                  <TableHead className="font-bold">User Image</TableHead>
                  <TableHead className="font-bold">Username</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold text-center">Admin</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y">
                {users.map((user) => (
                  <TableRow key={user._id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover bg-slate-200 rounded-full border border-slate-100 shadow-sm" />
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">{user.username}</TableCell>
                    <TableCell className="text-slate-500">{user.email}</TableCell>
                    <TableCell className="text-center">{user.isAdmin ? <FaCheck className="text-green-600 mx-auto" /> : <ImCross className="text-red-600 mx-auto text-[10px]" />}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <span onClick={() => setUserIdToDelete(user._id)} className="font-bold text-red-500 hover:underline cursor-pointer text-sm">Delete</span>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete user?</AlertDialogTitle>
                            <AlertDialogDescription>This action is permanent and cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700 rounded-xl" onClick={handleDeleteUser}>Confirm Delete</AlertDialogAction>
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
            {users.map((user) => (
              <div key={user._id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <img src={user.profilePicture} alt={user.username} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 text-lg truncate">@{user.username}</span>
                    <span className="text-sm text-slate-500 truncate">{user.email}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined On</span>
                    <span className="text-xs font-bold text-slate-700">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Role</span>
                    <span className="text-xs font-bold text-slate-700 text-right flex items-center justify-end gap-1">
                       {user.isAdmin ? <><FaCheck className="text-green-600" /> Admin</> : "Member"}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button 
                        onClick={() => setUserIdToDelete(user._id)} 
                        className="w-full h-12 rounded-xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors border border-red-100"
                      >
                        Delete User
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User Forever?</AlertDialogTitle>
                        <AlertDialogDescription>All their activity will be purged. This cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-col gap-2">
                        <AlertDialogAction className="w-full bg-red-600 rounded-xl" onClick={handleDeleteUser}>Confirm Deletion</AlertDialogAction>
                        <AlertDialogCancel className="w-full rounded-xl border-none">Keep User</AlertDialogCancel>
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
                Show More Users
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-10 text-slate-400 italic font-medium">No users found or unauthorized access.</p>
      )}
    </div>
  );
};

export default DashboardUsers;