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

  // Backend Base URL
  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.size > 2097152) {
      setImageUploadError("Image is too large. Choose a file under 2MB.");
      toast.error("File exceeds 2MB limit");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setImageUploadError(null);
  };

  const handleUploadImage = async () => {
    try {
      if (!file) {
        toast.error("Please select an image!");
        return;
      }
      setImageUploading(true);
      const uploadedFile = await uploadFile(file);
      const previewRes = getFileView(uploadedFile.$id);
      const postImageUrl = previewRes.href || previewRes.toString();
      setFormData((prev) => ({ ...prev, image: postImageUrl }));
      toast.success("Image uploaded successfully!");
      setImageUploading(false);
    } catch (error) {
      setImageUploadError("Upload failed.");
      toast.error("Image upload failed");
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload an image first.");
      return;
    }

    try {
      setPublishError(null);
      // UPDATED: Added backendBase
      const res = await fetch(`${backendBase}/api/post/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message || "Failed to publish");
        toast.error(data.message || "Failed to publish");
        return;
      }
      toast.success("Post published successfully!");
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError("Something went wrong!");
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">Create a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input type="text" placeholder="Title" required className="p-3 w-full sm:w-3/4 h-12 border border-slate-400 rounded-md" 
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} />
          <Select defaultValue="worldnews" onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
            <SelectTrigger className="w-full sm:w-1/4 h-12 border border-slate-400">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="worldnews">World News</SelectItem>
                <SelectItem value="sportsnews">Sports News</SelectItem>
                <SelectItem value="localnews">Local News</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-slate-600 border-dotted p-3">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button type="button" onClick={handleUploadImage} disabled={imageUploading}>
            {imageUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
        {formData.image && <img src={formData.image} alt="preview" className="w-full h-72 object-cover rounded-md" />}
        <div className="h-72 mb-12">
          <ReactQuill theme="snow" className="h-full" required onChange={(val) => setFormData((p) => ({ ...p, content: val }))} />
        </div>
        <Button type="submit" className="h-12 bg-green-600 text-white" disabled={imageUploading}>Publish Your Article</Button>
        {publishError && <p className="text-red-500 text-center">{publishError}</p>}
      </form>
    </div>
  );
};

export default CreatePost;