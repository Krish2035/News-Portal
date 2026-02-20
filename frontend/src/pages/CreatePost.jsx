import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem, // Fixed capitalization
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// 1. Change the import to react-quill-new
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";

const CreatePost = () => {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">
        Create a Post
      </h1>

      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Title"
            required
            id="title"
            className="p-3 w-full sm:w-3/4 h-12 border border-slate-400 rounded-md focus:outline-none"
          />

          <Select>
            <SelectTrigger className="w-full sm:w-1/4 h-12 border border-slate-400">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {/* 2. Fixed 'selectItem' to 'SelectItem' */}
                <SelectItem value="worldnews">World News</SelectItem>
                <SelectItem value="sportsnews">Sports News</SelectItem>
                <SelectItem value="localnews">Local News</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-slate-600 border-dotted p-3">
          <input type="file" accept="image/*" />
          <Button type="button" className="bg-slate-700">
            Upload Image
          </Button>
        </div>

        {/* 3. ReactQuill-new works perfectly here with React 18/19 */}
        <ReactQuill
          theme="snow"
          placeholder="Write something here..."
          className="h-72 mb-12"
        />

        <Button
          type="submit"
          className="h-12 bg-green-600 font-semibold max-sm:mt-12 text-md"
        >
          Publish Your Article
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
