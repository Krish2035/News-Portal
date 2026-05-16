import React, { useEffect, useState } from "react";
// CRITICAL: Ensure 'select' matches your filename (e.g., Select.jsx vs select.jsx)
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { getFileView, uploadFile } from "@/lib/appwrite/uploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const EditPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  
  const [file, setFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "worldnews",
    content: "",
    image: "",
  });
  const [updatePostError, setUpdatePostError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        
        if (!res.ok) {
          setUpdatePostError(data.message);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setUpdatePostError(null);
          // Ensure we don't set undefined values
          setFormData(data.posts[0] || {});
          setLoading(false);
        }
      } catch (error) {
        setUpdatePostError("Failed to fetch post data.");
        setLoading(false);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) return toast.error("Please select an image first");
      setImageUploading(true);
      
      const uploadedFile = await uploadFile(file);
      const fileUrlObject = getFileView(uploadedFile.$id);
      
      let postImageUrl = fileUrlObject.href || fileUrlObject.toString();
      
      // Upgrade to 'view' endpoint for better quality/reliability
      if (postImageUrl.includes('/preview')) {
        postImageUrl = postImageUrl.replace('/preview', '/view');
      }

      setFormData((prev) => ({ ...prev, image: postImageUrl }));
      setImageUploading(false);
      toast.success("New banner uploaded!");
    } catch (error) {
      setImageUploading(false);
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser?._id || !formData?._id) {
      return toast.error("User or Post identification missing");
    }

    try {
      setUpdatePostError(null);
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setUpdatePostError(data.message);
        toast.error(data.message || "Update failed");
        return;
      }
      
      toast.success("Article updated successfully!");
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setUpdatePostError("Something went wrong!");
      toast.error("Failed to update the post.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-center text-4xl my-10 font-extrabold text-slate-900 tracking-tight">
        Edit Article
      </h1>
      
      <form className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input 
            type="text" 
            placeholder="Headline" 
            required 
            className="flex-1 h-12 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-lg" 
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
          <Select 
            value={formData.category || "worldnews"} 
            onValueChange={(val) => setFormData({ ...formData, category: val })}
          >
            <SelectTrigger className="w-full sm:w-48 h-12 border-slate-200 rounded-xl font-medium">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white shadow-xl">
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
            onChange={(e) => setFile(e.target.files[0])} 
          />
          <Button 
            type="button" 
            onClick={handleUploadImage} 
            disabled={imageUploading}
            className="rounded-xl bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 shadow-none font-bold"
          >
            {imageUploading ? "Uploading..." : "Replace Image"}
          </Button>
        </div>

        {formData.image && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
            <img src={formData.image} alt="preview" className="w-full h-80 object-cover" />
          </div>
        )}

        <div className="h-96 mb-16">
          <ReactQuill 
            theme="snow" 
            className="h-full rounded-2xl overflow-hidden border border-slate-200" 
            value={formData.content || ""}
            onChange={(val) => setFormData({ ...formData, content: val })} 
          />
        </div>

        <Button 
          type="submit" 
          className="h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg rounded-2xl shadow-lg transition-all"
          disabled={imageUploading}
        >
          Save Changes
        </Button>

        {updatePostError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
             <p className="text-red-600 text-center font-bold text-sm">{updatePostError}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditPost;