import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import { formatDate } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MainDashboard = () => {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const res = await fetch(url, { method: "GET", credentials: "include" });
        const data = await res.json();
        if (res.ok) setter(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchData("/api/user/getusers?limit=5", (data) => {
        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        setLastMonthUsers(data.lastMonthUsers);
      });
      fetchData("/api/post/getposts?limit=5", (data) => {
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setLastMonthPosts(data.lastMonthPosts);
      });
      fetchData("/api/comment/getcomments?limit=5", (data) => {
        setComments(data.comments);
        setTotalComments(data.totalComments);
        setLastMonthComments(data.lastMonthComments);
      });
    }
  }, [currentUser]);

  const dateRange = `${formatDate(currentUser?.createdAt)} - ${formatDate(new Date())}`;

  return (
    <div className="p-3 md:mx-auto w-full max-w-7xl">
      {/* --- UPPER SECTION: STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DashboardCard
          title="All Users"
          description={dateRange}
          chartData={[{ value: totalUsers, fill: "blue" }]}
          chartConfig={{ value: { label: "Users" } }}
          totalValue={totalUsers}
          lastMonthValue={lastMonthUsers}
          footerText="Showing total users"
          endAngle={250}
        />
        <DashboardCard
          title="All Posts"
          description={dateRange}
          chartData={[{ value: totalPosts, fill: "green" }]}
          chartConfig={{ value: { label: "Posts" } }}
          totalValue={totalPosts}
          lastMonthValue={lastMonthPosts}
          footerText="Showing total posts"
          endAngle={110}
        />
        <DashboardCard
          title="All Comments"
          description={dateRange}
          chartData={[{ value: totalComments, fill: "orange" }]}
          chartConfig={{ value: { label: "Comments" } }}
          totalValue={totalComments}
          lastMonthValue={lastMonthComments}
          footerText="Showing total comments"
          endAngle={160}
        />
      </div>

      {/* --- LOWER SECTION: RECENT TABLES --- */}
      {/* Reduced the gap and set items-start to avoid unnecessary stretching */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full items-start">
        {/* Recent Users - Height decreased to fit sidebar bottom */}
        <div className="flex flex-col shadow-sm rounded-lg border bg-card text-card-foreground overflow-hidden h-[345px]">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h1 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Users
            </h1>
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[10px] bg-slate-700 text-white hover:bg-slate-800"
              asChild
            >
              <Link to="/dashboard?tab=users">See all</Link>
            </Button>
          </div>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="px-4 py-1.5 h-auto">User image</TableHead>
                <TableHead className="px-4 py-1.5 h-auto">Username</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="px-4 py-1.5">
                    <img
                      src={user.profilePicture}
                      className="w-7 h-7 rounded-full object-cover border"
                      alt={user.username}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-1.5 text-xs font-medium truncate max-w-[100px]">
                    {user.username}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Recent Comments - Height decreased */}
        <div className="flex flex-col shadow-sm rounded-lg border bg-card text-card-foreground overflow-hidden h-[345px]">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h1 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Comments
            </h1>
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[10px] bg-slate-700 text-white hover:bg-slate-800"
              asChild
            >
              <Link to="/dashboard?tab=comments">See all</Link>
            </Button>
          </div>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="px-4 py-1.5 h-auto">Comment</TableHead>
                <TableHead className="px-4 py-1.5 h-auto text-right">
                  Likes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments &&
                comments.map((comment) => (
                  <TableRow
                    key={comment._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="px-4 py-1.5">
                      <div className="max-h-10 overflow-y-auto pr-1 text-[11px] text-slate-600 dark:text-gray-300 scrollbar-none">
                        <p className="break-words leading-tight">
                          {comment.content}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-1.5 text-xs text-right">
                      {comment.numberOfLikes}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Recent Posts - Height decreased */}
        <div className="flex flex-col shadow-sm rounded-lg border bg-card text-card-foreground overflow-hidden h-[345px]">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h1 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Posts
            </h1>
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[10px] bg-slate-700 text-white hover:bg-slate-800"
              asChild
            >
              <Link to="/dashboard?tab=posts">See all</Link>
            </Button>
          </div>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="px-3 py-1.5 h-auto">Post image</TableHead>
                <TableHead className="px-3 py-1.5 h-auto">Post Title</TableHead>
                <TableHead className="px-3 py-1.5 h-auto">Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts && posts.map((post) => (
                <TableRow
                  key={post._id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="px-3 py-1.5">
                    <img
                      src={post.image}
                      className="w-7 h-7 rounded-full object-cover border"
                      alt={post.title}
                    />
                  </TableCell>
                  <TableCell className="px-3 py-1.5 text-[11px] font-medium">
                    <span className="line-clamp-1 leading-tight">
                      {post.title}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-1.5">
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full text-slate-600 dark:text-slate-300 truncate max-w-[50px] inline-block">
                      {post.category}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;