import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "@/redux/user/userSlice";
import { FaComments, FaUserCircle, FaUsers, FaNewspaper } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import { MdDashboardCustomize } from "react-icons/md";
import apiRequest from "@/utils/api"; // Import your centralized utility
import { toast } from "sonner";

const DashboardSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  /**
   * Refactored handleSignout
   * Uses the central apiRequest utility for consistency.
   */
  const handleSignout = async () => {
    try {
      // Points to the correct auth/signout route we defined in the backend
      await apiRequest("/api/auth/signout", {
        method: "POST",
      });

      // Clear local state and redirect
      dispatch(signOutSuccess());
      toast.success("Signed out successfully!");
      navigate("/sign-in");
    } catch (error) {
      console.error("Signout Error:", error.message);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const activeClass = (currentTab) => 
    `flex items-center p-3 rounded-lg transition-all duration-200 ${
      tab === currentTab 
      ? "bg-blue-600 text-white shadow-md font-bold" 
      : "hover:bg-slate-300 text-slate-700 font-medium"
    }`;

  return (
    <aside className="h-screen w-64 bg-slate-100 border-r border-slate-200 flex flex-col">
      <div className="p-6 flex items-center justify-center border-b border-slate-200 bg-white">
        <h1 className="text-xl font-bold tracking-tighter">
          <span className="text-blue-700">News</span>
          <span className="text-red-600">Nova</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
        <ul className="space-y-1">
          {currentUser?.isAdmin && (
            <li>
              <Link to="/dashboard?tab=dashboard" className={activeClass("dashboard")}>
                <MdDashboardCustomize className="mr-3 text-lg" />
                <span>Dashboard</span>
              </Link>
            </li>
          )}
          <li>
            <Link to="/dashboard?tab=profile" className={activeClass("profile")}>
              <FaUserCircle className="mr-3 text-lg" />
              <span>Profile</span>
            </Link>
          </li>
          {currentUser?.isAdmin && (
            <>
              <li>
                <Link to="/dashboard?tab=posts" className={activeClass("posts")}>
                  <FaNewspaper className="mr-3 text-lg" />
                  <span>Your Articles</span>
                </Link>
              </li>
              <li>
                <Link to="/create-post" className="flex items-center p-3 rounded-lg hover:bg-slate-300 text-slate-700 font-medium transition-all">
                  <IoIosCreate className="mr-3 text-lg" />
                  <span>Create Post</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=users" className={activeClass("users")}>
                  <FaUsers className="mr-3 text-lg" />
                  <span>All Users</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=comments" className={activeClass("comments")}>
                  <FaComments className="mr-3 text-lg" />
                  <span>All Comments</span>
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="pt-4 border-t border-slate-200">
          <button
            className="flex items-center w-full p-3 rounded-lg text-red-600 font-bold hover:bg-red-50 transition-colors"
            onClick={handleSignout}
          >
            <RiLogoutBoxRFill className="text-xl" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;