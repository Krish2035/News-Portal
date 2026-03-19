import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { getFileView, uploadFile } from "@/lib/appwrite/uploadImage";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreatePost = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "worldnews",
    content: "",
    image: "",
  });
  const [publishError, setPublishError] = useState(null);

  // Get the backend URL from .env
  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUploadImage = async () => {
    if (!file) {
      toast.error("Select an image first!");
      return;
    }
    try {
      setImageUploading(true);
      const uploadedFile = await uploadFile(file);
      const previewRes = getFileView(uploadedFile.$id);
      
      let postImageUrl = previewRes.href || previewRes.toString();
      if (postImageUrl.includes('/preview')) {
        postImageUrl = postImageUrl.replace('/preview', '/view');
      }

      setFormData((prev) => ({ ...prev, image: postImageUrl }));
      toast.success("Banner image ready!");
      setImageUploading(false);
    } catch (error) {
      toast.error("Upload failed.");
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return toast.error("Please upload a banner image.");
    if (!formData.content || formData.content === "<p><br></p>") return toast.error("Article content is empty.");

    try {
      setPublishError(null);
      
      // UPDATED: Using backendBase to ensure post goes to the live database
      const res = await fetch(`${backendBase}/api/post/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        toast.error(data.message);
        return;
      }
      toast.success("Post published to News Nova!");
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError("Connection error.");
      toast.error("Failed to reach server.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-center text-4xl my-10 font-extrabold text-slate-900 tracking-tight">
        Write a Story
      </h1>
      
      <form className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input 
            type="text" 
            placeholder="Headline" 
            required 
            className="flex-1 h-12 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-lg" 
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} 
          />
          <Select defaultValue="worldnews" onValueChange={(val) => setFormData((p) => ({ ...p, category: val }))}>
            <SelectTrigger className="w-full sm:w-48 h-12 border-slate-200 rounded-xl font-medium">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="worldnews">World News</SelectItem>
                <SelectItem value="sportsnews">Sports</SelectItem>
                <SelectItem value="localnews">Local</SelectItem>
                <SelectItem value="technology">Tech</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-2 border-slate-200 border-dashed rounded-2xl p-4 bg-slate-50/50">
          <input 
            type="file" 
            accept="image/*" 
            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            onChange={handleFileChange} 
          />
          <Button 
            type="button" 
            onClick={handleUploadImage} 
            disabled={imageUploading}
            className="rounded-xl bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 shadow-none font-bold"
          >
            {imageUploading ? "Processing..." : "Upload Banner"}
          </Button>
        </div>

        {formData.image && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
            <img src={formData.image} alt="preview" className="w-full h-80 object-cover" />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md">Preview Image</div>
          </div>
        )}

        <div className="h-96 mb-16">
          <ReactQuill 
            theme="snow" 
            className="h-full rounded-2xl overflow-hidden border border-slate-200" 
            placeholder="Start writing the lead story..."
            onChange={(val) => setFormData((p) => ({ ...p, content: val }))} 
          />
        </div>

        <Button type="submit" className="h-14 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg rounded-2xl shadow-lg transition-all" disabled={imageUploading}>
          Publish Article
        </Button>

        {publishError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
             <p className="text-red-600 text-center font-bold text-sm">{publishError}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;