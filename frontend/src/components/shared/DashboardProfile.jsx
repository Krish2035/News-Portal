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
      
      /** * FIX: We use getFileView instead of getFilePreview to bypass 
       * Appwrite 'Image Transformation Blocked' 403 error.
       */
      const fileUrlObject = getFileView(uploadedFile.$id);
      let profilePictureUrl = fileUrlObject.href || fileUrlObject.toString();

      // Ensure the URL is using /view and not /preview
      if (profilePictureUrl.includes('/preview')) {
        profilePictureUrl = profilePictureUrl.replace('/preview', '/view');
      }

      /**
       * CACHE BUSTER:
       * Appending a timestamp ensures the browser treats this as a brand new image
       * and forces the Header component to update the avatar immediately.
       */
      return `${profilePictureUrl}&t=${new Date().getTime()}`;
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
      console.error("Image upload failed: ", error);
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

      const updateProfileData = {
        ...formData,
        profilePicture,
      };

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateProfileData),
      });

      const data = await res.json();

      if (res.ok === false || data.success === false) {
        const errorMessage = data.message || "Update user failed.";
        toast.error(errorMessage);
        dispatch(updateFailure(errorMessage));
      } else {
        // Update Redux - this triggers Header.jsx to show the new News Nova avatar
        dispatch(updateSuccess(data));
        toast.success("Profile updated successfully!");
        setImageFile(null);
        setImageFileUrl(null);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error("An error occurred during update.");
      console.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
      } else {
        dispatch(deleteUserSuccess());
        toast.success("Account deleted successfully.");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("Could not delete account.");
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      if (res.ok) {
        dispatch(signOutSuccess());
        toast.success("Signed out successfully.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-bold text-3xl text-slate-800">
        Update Your Profile
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={profilePicRef}
          onChange={handleImageChange}
        />
        
        {/* Profile Image Preview Section */}
        <div className="relative w-32 h-32 self-center cursor-pointer group">
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="profile"
            className={`rounded-full w-full h-full object-cover border-8 border-slate-200 transition-all duration-300 ${
              loading ? "opacity-50 grayscale" : "opacity-100"
            }`}
            onClick={() => profilePicRef.current.click()}
          />
          <div
            onClick={() => profilePicRef.current.click()}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full"
          >
            <span className="text-white text-xs font-bold text-center px-2">
              Change Photo
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600 pl-1">Username</label>
          <input
            type="text"
            id="username"
            placeholder="username"
            defaultValue={currentUser.username}
            className="h-12 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none pl-4 transition-all"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600 pl-1">Email</label>
          <input
            type="email"
            id="email"
            placeholder="email"
            defaultValue={currentUser.email}
            className="h-12 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none pl-4 transition-all"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600 pl-1">New Password</label>
          <input
            type="password"
            id="password"
            placeholder="Leave empty to keep current"
            className="h-12 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none pl-4 transition-all"
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md mt-2"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>

      <div className="flex justify-between mt-8 border-t pt-5 border-slate-200">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 font-medium"
            >
              Delete Account
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from the News Nova servers.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteUser}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="ghost"
          className="text-slate-500 hover:text-slate-800 font-medium"
          onClick={handleSignout}
        >
          Sign Out
        </Button>
      </div>

      {error && (
        <p className="text-red-600 mt-5 text-center text-sm font-bold bg-red-50 py-2 rounded border border-red-100">
          {error}
        </p>
      )}
    </div>
  );
};

export default DashboardProfile;