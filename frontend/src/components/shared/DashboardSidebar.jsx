import { signOutSuccess } from "@/redux/user/userSlice";
import React from "react";
import { FaComments, FaUserCircle, FaUsers } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosCreate } from "react-icons/io";
import { MdDashboardCustomize } from "react-icons/md";

const DashboardSidebar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleSignout = async () => {
    try {
      /**
       * 🚨 CRITICAL: Use the ABSOLUTE URL of your backend.
       * If you use a relative path like "/api/user/signout", 
       * the frontend looks for the route on its own domain, which causes a 404.
       */
      const BACKEND_URL = "https://news-portal-nu-three.vercel.app"; 
      
      const res = await fetch(`${BACKEND_URL}/api/user/signout`, {
        method: "POST",
        // No headers needed for a simple signout unless you send data
      });

      const contentType = res.headers.get("content-type");

      // Check if the response is actually JSON before parsing
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok) {
          console.error("Signout failed:", data.message);
        } else {
          // Successfully logged out from backend
          dispatch(signOutSuccess());
        }
      } else {
        /**
         * If we hit this, Vercel is sending back HTML (likely a 404 page).
         * This usually means the BACKEND_URL or the route path is wrong.
         */
        console.error("The server returned HTML instead of JSON. Check your backend URL/Routes.");
      }
    } catch (error) {
      console.log("Signout Error:", error);
    }
  };

  return (
    <aside className="h-screen w-64 bg-slate-200 text-slate-800 flex flex-col">
      <div className="p-4 flex items-center justify-center bg-slate-200 border-b border-slate-300">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <nav className="flex-1 p-4 flex flex-col justify-between">
        <ul className="space-y-2">
          {currentUser?.isAdmin && (
            <li>
              <Link
                to={"/dashboard?tab=dashboard"}
                className="flex items-center p-2 hover:bg-slate-300 rounded"
              >
                <MdDashboardCustomize className="mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
          )}
          
          <li>
            <Link
              to="/dashboard?tab=profile"
              className="flex items-center p-2 hover:bg-slate-300 rounded"
            >
              <FaUserCircle className="mr-3" />
              <span>Profile</span>
            </Link>
          </li>

          {currentUser?.isAdmin && (
            <>
              <li>
                <Link
                  to="/create-post"
                  className="flex items-center p-2 hover:bg-slate-300 rounded"
                >
                  <IoIosCreate className="mr-3" />
                  <span>Create Post</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard?tab=posts"
                  className="flex items-center p-2 hover:bg-slate-300 rounded"
                >
                  <IoIosCreate className="mr-3" />
                  <span>Your Articles</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard?tab=users"
                  className="flex items-center p-2 hover:bg-slate-300 rounded"
                >
                  <FaUsers className="mr-3" />
                  <span>All Users</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/dashboard?tab=comments"}
                  className="flex items-center p-2 hover:bg-slate-300 rounded"
                >
                  <FaComments className="mr-3" />
                  <span>All Comments</span>
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="pt-4 border-t border-slate-400">
          <button
            className="flex items-center w-full p-2 hover:bg-slate-300 rounded text-red-600 font-medium transition-colors"
            onClick={handleSignout}
          >
            <RiLogoutBoxRFill className="text-lg" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;