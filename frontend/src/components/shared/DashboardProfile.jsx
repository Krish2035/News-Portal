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
import { getFilePreview, uploadFile } from "@/lib/appwrite/uploadImage";
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
  const { currentUser, error } = useSelector((state) => state.user);

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
      const profilePictureUrl = getFilePreview(uploadedFile.$id);
      return profilePictureUrl;
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
      console.error("Image upload failed: ", error);
      return currentUser.profilePicture; // Fallback to current pic on failure
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateStart());

      // Wait for image uploading
      const profilePicture = await uploadImage();

      const updateProfile = {
        ...formData,
        profilePicture,
      };

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateProfile),
      });

      const data = await res.json();

      console.log(data)

      if (data.success === false) {
        toast.error(data.message || "Update user failed.");
        dispatch(updateFailure(data.message));
      } else {
        console.log("I am running");
        dispatch(updateSuccess(data));
        toast.success("User updated successfully.");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error("An error occurred during update.");
      console.error(error);
    }
  }

  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart())

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if(!res.ok){
        dispatch(deleteUserFailure(data.message))
      }else{
        dispatch(deleteUserSuccess())
      }
    } catch (error) {
      console.log(error)
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async() => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      })

      const data = await res.json()

      if(!res.ok){
        console.log(data.message)
      }else{
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">
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
        <div className="w-32 h-32 self-center cursor-pointer overflow-hidden">
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="profile"
            className="rounded-full w-full h-full object-cover border-8 border-gray-300"
            onClick={() => profilePicRef.current.click()}
          />
        </div>

        <input
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          className="h-12 border border-slate-400 focus-visible:ring-offset-0 pl-4"
          onChange={handleChange}
        />

        <input
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="h-12 border border-slate-400 focus-visible:ring-offset-0 pl-4"
          onChange={handleChange}
        />

        <input
          type="password"
          id="password"
          placeholder="password"
          className="h-12 border border-slate-400 focus-visible:ring-offset-0 pl-4"
          onChange={handleChange}
        />

        <Button type="submit" className="h-12 bg-green-600 hover:bg-green-700">
          Update Profile
        </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5 cursor-pointer">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="text-red-500 cursor-pointer">
              Delete Account
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely Sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This Action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {/* Note: Changed the second one to AlertDialogAction for the "Continue" logic */}
              <AlertDialogAction className="bg-red-600" onClick={handleDeleteUser}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={handleSignout}>
          Sign Out
        </Button>
      </div>

      <p className="text-red-600">{error}</p>
    </div>
  );
};

export default DashboardProfile;