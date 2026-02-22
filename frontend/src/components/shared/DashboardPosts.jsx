import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// ADDED: TableHead and TableCell to the import list
import {
  Table,
  TableBody,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
// ADDED: Link import from react-router-dom
import { Link } from "react-router-dom";

const DashboardPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);

  const [showMore, setShowMore] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts)

          if(data.posts.length < 2){
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (currentUser.isAdmin) {
      fetchPosts();
    }

  }, [currentUser._id])

  const handleShowMore = async() => {
    const startIndex = userPosts.length

    try {
      const res = await fetch(
        `/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`
      )

      const data = await res.json()

      if(res.ok){
        setUserPosts((prev) => [...prev, ...data.posts])

        if(data.posts.length < 9){
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full p-3 overflow-x-auto">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table>
            <TableCaption>A list of your published articles.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Date Updated</TableHead>
                <TableHead>Post Image</TableHead>
                <TableHead>Post Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Delete</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>

            {/* FIXED: The map should be INSIDE TableBody */}
            <TableBody className="divide-y">
              {userPosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500 rounded-md"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-medium text-gray-900"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-medium text-green-600 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-blue-700 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
};

export default DashboardPosts;
