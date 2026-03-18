import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiFillLike } from "react-icons/ai";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
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

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  const getSafeImageUrl = (url) => {
    if (!url) return "https://cdn-icons-png.flaticon.com/128/149/149071.png";
    if (url.includes('appwrite.io')) {
      let safeUrl = url.replace('/preview', '/view');
      const basePart = safeUrl.split('?')[0];
      const projectPart = safeUrl.includes('project=') 
        ? `?project=${new URLSearchParams(safeUrl.split('?')[1]).get('project')}` 
        : '';
      return `${basePart}${projectPart}`;
    }
    return url;
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });

      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex p-4 border-b border-slate-100 text-sm gap-3 hover:bg-slate-50/50 transition-colors">
      <div className="flex-shrink-0">
        <img
          src={getSafeImageUrl(user.profilePicture)}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-slate-200 object-cover border border-slate-100"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-1 gap-2">
          <span className="font-bold text-slate-800 truncate">
            {user.username ? `@${user.username}` : "Anonymous"}
          </span>
          <span className="text-slate-400 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-2">
            <Textarea
              className="mb-2 border-slate-300 focus:ring-blue-500"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" className="bg-blue-600" onClick={handleSave}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-slate-700 leading-relaxed py-1">{comment.content}</p>
            <div className="flex items-center pt-3 mt-1 gap-4">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={currentUser && comment.likes.includes(currentUser._id) ? "text-blue-600" : "text-slate-400"}
              >
                <AiFillLike className="text-lg" />
              </button>
              {comment.numberOfLikes > 0 && (
                <span className="text-slate-400 text-xs">
                  {comment.numberOfLikes} {comment.numberOfLikes === 1 ? "like" : "likes"}
                </span>
              )}
              {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                <div className="flex gap-3 ml-2 border-l border-slate-200 pl-4">
                  <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-blue-600 text-xs font-semibold uppercase">Edit</button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="text-slate-400 hover:text-red-600 text-xs font-semibold uppercase">Delete</button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove comment?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600" onClick={() => onDelete(comment._id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;