import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { getFilePreview, uploadFile } from "@/lib/appwrite/uploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const EditPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({});

  // console.log(formData);
  const [updatePostError, setUpdatePostError] = useState(null);

  // 1. Fetch post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`, {
          method: "GET",
          credentials: "include", // Essential for verifying admin access
        });

        const data = await res.json();

        if (!res.ok) {
          setUpdatePostError(data.message);
          return;
        }

        if (res.ok) {
          setUpdatePostError(null);
          // Assuming your backend returns { posts: [...] }
          if (data.posts && data.posts.length > 0) {
            setFormData(data.posts[0]);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setUpdatePostError("Failed to fetch post data.");
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // 2. Handle Image Upload to Appwrite
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image!");
        toast.error("Please select an image!");
        return;
      }
      setImageUploading(true);
      setImageUploadError(null);

      const uploadedFile = await uploadFile(file);
      const postImageUrl = getFilePreview(uploadedFile.$id);

      setFormData((prev) => ({ ...prev, image: postImageUrl }));

      toast.success("Image uploaded successfully!");
      setImageUploading(false);
    } catch (error) {
      console.error("Upload Error:", error);
      setImageUploadError("Image upload failed");
      toast.error("Image upload failed");
      setImageUploading(false);
    }
  };

  // 3. Handle Form Submission (Update Post)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Logic: Ensure we pass both postId and the authorized userId to the backend
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Crucial for verifyToken middleware
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setUpdatePostError(data.message);
        toast.error(data.message || "Failed to update post");
        return;
      }

      setUpdatePostError(null);
      toast.success("Post updated successfully!");
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setUpdatePostError("Something went wrong! Please try again.");
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">
        Edit Post
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Title"
            required
            id="title"
            className="p-3 w-full sm:w-3/4 h-12 border border-slate-400 rounded-md focus:outline-none"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            value={formData.title || ""}
          />

          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            value={formData.category || ""}
          >
            <SelectTrigger className="w-full sm:w-1/4 h-12 border border-slate-400">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="worldnews">World News</SelectItem>
                <SelectItem value="sportsnews">Sports News</SelectItem>
                <SelectItem value="localnews">Local News</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-slate-600 border-dotted p-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            className="bg-slate-700"
            onClick={handleUploadImage}
            disabled={imageUploading}
          >
            {imageUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>

        {imageUploadError && (
          <p className="text-red-600 text-sm">{imageUploadError}</p>
        )}

        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded preview"
            className="w-full h-72 object-cover rounded-md mt-4 border border-slate-200 shadow-sm"
          />
        )}

        <div className="h-72 mb-12">
          <ReactQuill
            theme="snow"
            placeholder="Write something here..."
            className="h-full"
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value }))
            }
            value={formData.content || ""}
          />
        </div>

        <Button
          type="submit"
          className="h-12 bg-green-600 font-semibold max-sm:mt-12 text-md"
        >
          Update Post
        </Button>

        {updatePostError && (
          <p className="text-red-500 mt-5">{updatePostError}</p>
        )}
      </form>
    </div>
  );
};

export default EditPost;