import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updatePostError, setUpdatePostError] = useState(null);

  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // UPDATED: Added backendBase
        const res = await fetch(`${backendBase}/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (res.ok) {
          setFormData(data.posts[0]);
        }
      } catch (error) {
        setUpdatePostError("Failed to fetch post data.");
      }
    };
    if (postId) fetchPost();
  }, [postId, backendBase]);

  const handleUploadImage = async () => {
    try {
      if (!file) return toast.error("Select an image");
      setImageUploading(true);
      const uploadedFile = await uploadFile(file);
      const postImageUrl = getFilePreview(uploadedFile.$id);
      setFormData((prev) => ({ ...prev, image: postImageUrl }));
      setImageUploading(false);
      toast.success("Uploaded!");
    } catch (error) {
      setImageUploading(false);
      toast.error("Upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // UPDATED: Added backendBase
      const res = await fetch(`${backendBase}/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setUpdatePostError(data.message);
        return;
      }
      toast.success("Post updated!");
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setUpdatePostError("Something went wrong!");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">Edit Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="text" required className="p-3 border rounded-md" value={formData.title || ""} 
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <div className="flex gap-4 items-center justify-between border-4 border-dotted p-3">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button type="button" onClick={handleUploadImage} disabled={imageUploading}>Upload</Button>
        </div>
        <div className="h-72 mb-12">
          <ReactQuill theme="snow" className="h-full" value={formData.content || ""} 
            onChange={(val) => setFormData({ ...formData, content: val })} />
        </div>
        <Button type="submit" className="h-12 bg-green-600 text-white">Update Post</Button>
      </form>
    </div>
  );
};

export default EditPost;