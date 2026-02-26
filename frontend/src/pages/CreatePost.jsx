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
import { getFileView, uploadFile } from "@/lib/appwrite/uploadImage";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreatePost = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "worldnews",
    content: "",
    image: "",
  });
  const [publishError, setPublishError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 2097152) {
      setImageUploadError("Image is too large. Choose a file under 2MB.");
      toast.error("File exceeds 2MB limit");
      setFile(null);
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
    setImageUploadError(null);
  };

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

      if (!uploadedFile || !uploadedFile.$id) {
        throw new Error("Upload succeeded but file ID is missing.");
      }

      const previewRes = getFileView(uploadedFile.$id);

      if (!previewRes) {
        throw new Error("Could not generate image URL.");
      }

      const postImageUrl = previewRes.href || previewRes.toString();
      setFormData((prev) => ({ ...prev, image: postImageUrl }));

      toast.success("Image uploaded successfully!");
      setImageUploading(false);
    } catch (error) {
      console.error("Upload Error:", error);
      setImageUploadError("Upload failed. Check Appwrite bucket permissions.");
      toast.error("Image upload failed");
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      setPublishError("Please upload an image first.");
      toast.error("Please upload an image first.");
      return;
    }

    try {
      setPublishError(null);
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message || "Failed to publish post");
        toast.error(data.message || "Failed to publish post");
        return;
      }

      toast.success("Post published successfully!");
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError("Something went wrong! Please try again.");
      toast.error("Something went wrong");
      console.error("Submit Error:", error);
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
            defaultValue="worldnews"
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
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
            onChange={handleFileChange}
            className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
          />
          <Button
            type="button"
            className="bg-slate-700 text-white"
            onClick={handleUploadImage}
            disabled={imageUploading}
          >
            {imageUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>

        {imageUploadError && (
          <p className="text-red-600 text-sm font-medium">{imageUploadError}</p>
        )}

        {formData.image && (
          <div className="relative group animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-sm text-green-600 mb-1 font-medium italic">
              ✓ Image verified. Ready to publish.
            </p>
            <img
              src={formData.image}
              alt="Uploaded preview"
              className="w-full h-72 object-cover rounded-md border border-slate-200 shadow-sm"
              onError={(e) => {
                if (!e.target.src.includes("placehold.co")) {
                  e.target.src =
                    "https://placehold.co/600x400?text=Preview+Error";
                }
              }}
            />
          </div>
        )}

        <div className="h-72 mb-12">
          <ReactQuill
            theme="snow"
            placeholder="Write something here..."
            className="h-full"
            required
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value }))
            }
          />
        </div>

        <Button
          type="submit"
          className="h-12 bg-green-600 hover:bg-green-700 text-white font-semibold max-sm:mt-12 transition-all disabled:opacity-50"
          disabled={imageUploading}
        >
          Publish Your Article
        </Button>

        {publishError && (
          <p className="text-red-500 mt-5 font-medium text-center">
            {publishError}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
