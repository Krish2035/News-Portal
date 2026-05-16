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

  // Get the backend URL from .env
  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        // UPDATED: Using absolute URL to ensure it hits the backend on Vercel
        const res = await fetch(`${backendBase}${endpoint}`, { 
          method: "GET", 
          credentials: "include" 
        });
        const data = await res.json();
        if (res.ok) {
          setter(data);
        }
      } catch (error) {
        console.log("Dashboard Fetch Error:", error.message);
      }
    };

    if (currentUser?.isAdmin) {
      // Fetch Users
      fetchData("/api/user/getusers?limit=5", (data) => {
        setUsers(data.users || []);
        setTotalUsers(data.totalUsers || 0);
        setLastMonthUsers(data.lastMonthUsers || 0);
      });
      
      // Fetch Posts
      fetchData("/api/post/getposts?limit=5", (data) => {
        setPosts(data.posts || []);
        setTotalPosts(data.totalPosts || 0);
        setLastMonthPosts(data.lastMonthPosts || 0);
      });
      
      // Fetch Comments
      fetchData("/api/comment/getcomments?limit=5", (data) => {
        setComments(data.comments || []);
        setTotalComments(data.totalComments || 0);
        setLastMonthComments(data.lastMonthComments || 0);
      });
    }
  }, [currentUser, backendBase]);

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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full items-start">
        {/* Recent Users */}
        <div className="flex flex-col shadow-sm rounded-2xl border bg-white overflow-hidden h-[360px] transition-all hover:shadow-md">
          <div className="flex justify-between items-center px-5 py-4 border-b bg-slate-50/50">
            <h1 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              Recent Users
            </h1>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] font-bold bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg shadow-sm"
              asChild
            >
              <Link to="/dashboard?tab=users">See all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-5 py-3 text-[10px] font-bold uppercase text-slate-400">User image</TableHead>
                  <TableHead className="px-5 py-3 text-[10px] font-bold uppercase text-slate-400">Username</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user._id}
                    className="hover:bg-slate-50/50 transition-colors border-slate-100"
                  >
                    <TableCell className="px-5 py-3">
                      <img
                        src={user.profilePicture}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                        alt={user.username}
                      />
                    </TableCell>
                    <TableCell className="px-5 py-3 text-xs font-bold text-slate-700 truncate">
                      @{user.username}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Comments */}
        <div className="flex flex-col shadow-sm rounded-2xl border bg-white overflow-hidden h-[360px] transition-all hover:shadow-md">
          <div className="flex justify-between items-center px-5 py-4 border-b bg-slate-50/50">
            <h1 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              Recent Comments
            </h1>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] font-bold bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg shadow-sm"
              asChild
            >
              <Link to="/dashboard?tab=comments">See all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-5 py-3 text-[10px] font-bold uppercase text-slate-400">Comment</TableHead>
                  <TableHead className="px-5 py-3 text-[10px] font-bold uppercase text-slate-400 text-right">
                    Likes
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments &&
                  comments.map((comment) => (
                    <TableRow
                      key={comment._id}
                      className="hover:bg-slate-50/50 transition-colors border-slate-100"
                    >
                      <TableCell className="px-5 py-3">
                        <div className="text-[11px] text-slate-600 font-medium">
                          <p className="line-clamp-2 leading-snug">
                            {comment.content}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-3 text-xs text-right font-bold text-blue-600">
                        {comment.numberOfLikes}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="flex flex-col shadow-sm rounded-2xl border bg-white overflow-hidden h-[360px] w-full transition-all hover:shadow-md">
          <div className="flex justify-between items-center px-5 py-4 border-b bg-slate-50/50">
            <h1 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              Recent Posts
            </h1>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] font-bold bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg shadow-sm"
              asChild
            >
              <Link to="/dashboard?tab=posts">See all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <Table className="table-fixed w-full min-w-[300px]">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[80px] px-5 py-3 text-[10px] font-bold uppercase text-slate-400">
                    Image
                  </TableHead>
                  <TableHead className="px-5 py-3 text-[10px] font-bold uppercase text-slate-400">
                    Title
                  </TableHead>
                  <TableHead className="w-[100px] px-5 py-3 text-[10px] font-bold uppercase text-slate-400">
                    Category
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts &&
                  posts.map((post) => (
                    <TableRow
                      key={post._id}
                      className="hover:bg-slate-50/50 transition-colors border-slate-100"
                    >
                      <TableCell className="px-5 py-3">
                        <img
                          src={post.image}
                          className="w-10 h-7 rounded-md object-cover border shadow-sm"
                          alt={post.title}
                        />
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <p className="text-[11px] font-bold leading-tight text-slate-800 line-clamp-2">
                          {post.title}
                        </p>
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold uppercase tracking-tighter truncate block text-center">
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
    </div>
  );
};

export default MainDashboard;