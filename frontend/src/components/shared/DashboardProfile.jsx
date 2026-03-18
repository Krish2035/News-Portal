import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "@/redux/user/userSlice";
import { getFileView, uploadFile } from "@/lib/appwrite/uploadImage";
import { toast } from "sonner";
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

const DashboardProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const profilePicRef = useRef();
  const dispatch = useDispatch();

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});

  // Define the Base URL
  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const uploadImage = async () => {
    if (!imageFile) return currentUser.profilePicture;
    try {
      const uploadedFile = await uploadFile(imageFile);
      const fileUrlObject = getFileView(uploadedFile.$id);
      let profilePictureUrl = fileUrlObject.href || fileUrlObject.toString();

      if (profilePictureUrl.includes('/preview')) {
        profilePictureUrl = profilePictureUrl.replace('/preview', '/view');
      }
      return `${profilePictureUrl}&t=${new Date().getTime()}`;
    } catch (error) {
      toast.error("Image upload failed.");
      return currentUser.profilePicture;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0 && !imageFile) {
      toast.info("No changes made.");
      return;
    }

    try {
      dispatch(updateStart());
      const profilePicture = await uploadImage();
      const updateProfileData = { ...formData, profilePicture };

      // UPDATED: Added backendBase
      const res = await fetch(`${backendBase}/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important for session cookies
        body: JSON.stringify(updateProfileData),
      });

      const data = await res.json();
      if (res.ok === false || data.success === false) {
        dispatch(updateFailure(data.message || "Update failed"));
        toast.error(data.message || "Update failed");
      } else {
        dispatch(updateSuccess(data));
        toast.success("Profile updated successfully!");
        setImageFile(null);
        setImageFileUrl(null);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error("An error occurred during update.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      // UPDATED: Added backendBase
      const res = await fetch(`${backendBase}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
      } else {
        dispatch(deleteUserSuccess());
        toast.success("Account deleted.");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      // UPDATED: Added backendBase
      const res = await fetch(`${backendBase}/api/user/signout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        dispatch(signOutSuccess());
        toast.success("Signed out.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-bold text-3xl text-slate-800">Update Your Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="file" accept="image/*" hidden ref={profilePicRef} onChange={handleImageChange} />
        <div className="relative w-32 h-32 self-center cursor-pointer group">
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="profile"
            className={`rounded-full w-full h-full object-cover border-8 border-slate-200 ${loading ? "opacity-50" : ""}`}
            onClick={() => profilePicRef.current.click()}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600 pl-1">Username</label>
          <input type="text" id="username" defaultValue={currentUser.username} className="h-12 border border-slate-300 rounded-md pl-4" onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600 pl-1">Email</label>
          <input type="email" id="email" defaultValue={currentUser.email} className="h-12 border border-slate-300 rounded-md pl-4" onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600 pl-1">New Password</label>
          <input type="password" id="password" placeholder="Leave empty to keep current" className="h-12 border border-slate-300 rounded-md pl-4" onChange={handleChange} />
        </div>
        <Button type="submit" className="h-12 bg-blue-600 text-white font-bold" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
      <div className="flex justify-between mt-8 border-t pt-5 border-slate-200">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="text-red-500 font-medium">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600" onClick={handleDeleteUser}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="ghost" className="text-slate-500 font-medium" onClick={handleSignout}>Sign Out</Button>
      </div>
      {error && <p className="text-red-600 mt-5 text-center text-sm font-bold bg-red-50 py-2 rounded border border-red-100">{error}</p>}
    </div>
  );
};

export default DashboardProfile;