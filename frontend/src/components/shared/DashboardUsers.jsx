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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    if (currentUser?.isAdmin) fetchUsers();
  }, [currentUser._id, currentUser?.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
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
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userIdToDelete));
        toast.success("User deleted");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-3">
      {currentUser?.isAdmin && users.length > 0 ? (
        <>
          <Table>
            <TableCaption>A list of your recent subscribers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Joined On</TableHead>
                <TableHead>User Image</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover bg-gray-500 rounded-full" />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.isAdmin ? <FaCheck className="text-green-600" /> : <ImCross className="text-red-600" />}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span onClick={() => setUserIdToDelete(user._id)} className="font-medium text-red-600 hover:underline cursor-pointer">Delete</span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete user?</AlertDialogTitle>
                          <AlertDialogDescription>This action is permanent.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600" onClick={handleDeleteUser}>Delete</AlertDialogAction>
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
        <p className="mt-10">No users found.</p>
      )}
    </div>
  );
};

export default DashboardUsers;