import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreatePost = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image!");
        toast.error("Please select an image!");
        return;
      }
      setImageUploading(true);
      setImageUploadError(null);

      // 1. Upload to Appwrite
      const uploadedFile = await uploadFile(file);
      // 2. Get the file preview URL
      const postImageUrl = getFilePreview(uploadedFile.$id);

      // 3. Update state using functional pattern to prevent stale data
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // THE FIX FOR 401:
      // 'credentials: "include"' tells the browser to send the access_token cookie
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        toast.error(data.message || "Failed to publish post");
        return;
      }

      setPublishError(null);
      toast.success("Post published successfully!");
      // Redirect to the newly created post
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError("Something went wrong! Please try again.");
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">
        Create a Post
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
          />

          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-1/4 h-12 border border-slate-400">
              <SelectValue placeholder="Select a Category" />
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

        {/* Display Image Preview if it exists */}
        {formData.image && (
          <div className="relative">
            <img
              src={formData.image}
              alt="Uploaded preview"
              className="w-full h-72 object-cover rounded-md mt-4 border border-slate-200 shadow-sm"
              onError={() => {
                console.error("Image preview failed to render.");
                toast.error("Preview failed to load.");
              }}
            />
          </div>
        )}

        <div className="h-72 mb-12">
          <ReactQuill
            theme="snow"
            placeholder="Write something here..."
            className="h-full"
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value }))
            }
          />
        </div>

        <Button
          type="submit"
          className="h-12 bg-green-600 font-semibold max-sm:mt-12 text-md"
        >
          Publish Your Article
        </Button>

        {publishError && <p className="text-red-500 mt-5">{publishError}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
