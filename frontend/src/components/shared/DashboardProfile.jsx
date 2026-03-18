import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
} from "@/redux/user/userSlice";
import { getFileView, uploadFile } from "@/lib/appwrite/uploadImage";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
  const { currentUser, loading } = useSelector((state) => state.user);
  const profilePicRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("File is too large (Max 2MB)");
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    try {
      const uploadedFile = await uploadFile(imageFile);
      const fileUrlObject = getFileView(uploadedFile.$id);
      let profilePictureUrl = fileUrlObject.href || fileUrlObject.toString();

      if (profilePictureUrl.includes('/preview')) {
        profilePictureUrl = profilePictureUrl.replace('/preview', '/view');
      }
      return `${profilePictureUrl}&t=${new Date().getTime()}`;
    } catch (error) {
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0 && !imageFile) {
      toast.info("No changes to update.");
      return;
    }

    try {
      dispatch(updateStart());
      let profilePicture = currentUser.profilePicture;
      if (imageFile) {
        profilePicture = await uploadImage();
      }

      const updateProfileData = { ...formData };
      if (imageFile) updateProfileData.profilePicture = profilePicture;

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // PRODUCTION FIX: Required to send/verify session cookies
        credentials: "include", 
        body: JSON.stringify(updateProfileData),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        toast.error(data.message);
      } else {
        dispatch(updateSuccess(data));
        toast.success("Profile updated successfully!");
        setImageFile(null);
        setImageFileUrl(null);
        setFormData({});
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
        credentials: "include", // PRODUCTION FIX
      });
      if (res.ok) {
        dispatch(signOutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include", // PRODUCTION FIX
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        navigate("/sign-in");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 w-full bg-white rounded-2xl shadow-sm border border-slate-100 my-10">
      <h1 className="mb-8 text-center font-extrabold text-3xl text-slate-900 tracking-tight">
        Profile Settings
      </h1>
      
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <input type="file" accept="image/*" hidden ref={profilePicRef} onChange={handleImageChange} />
        <div className="relative w-36 h-36 self-center cursor-pointer group">
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="profile"
            className={`rounded-full w-full h-full object-cover border-4 border-white shadow-lg transition-all duration-300 group-hover:brightness-90 ${loading ? "animate-pulse opacity-50" : ""}`}
            onClick={() => profilePicRef.current.click()}
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
            <input type="text" id="username" defaultValue={currentUser.username} className="h-12 border border-slate-200 rounded-xl px-4" onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
            <input type="email" id="email" defaultValue={currentUser.email} className="h-12 border border-slate-200 rounded-xl px-4" onChange={handleChange} />
          </div>
        </div>

        <Button type="submit" className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl" disabled={loading}>
          {loading ? "Processing..." : "Save Changes"}
        </Button>
      </form>

      <div className="text-red-600 flex justify-between mt-5 font-bold cursor-pointer">
        <AlertDialog>
          <AlertDialogTrigger>Delete Account</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <span onClick={handleSignout}>Sign Out</span>
      </div>
    </div>
  );
};

export default DashboardProfile;