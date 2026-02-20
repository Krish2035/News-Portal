import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "@/redux/user/userSlice";
import { getFilePreview, uploadFile } from "@/lib/appwrite/uploadImage";
import { toast } from "sonner";

const DashboardProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

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
  };

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
        <span className="hover:underline">Delete Account</span>
        <span className="hover:underline">Sign Out</span>
      </div>
    </div>
  );
};

export default DashboardProfile;