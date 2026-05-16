import { signOutSuccess } from '@/redux/user/userSlice';
import React from 'react'
import { FaHome, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { IoIosCreate, IoIosDocument } from 'react-icons/io';
import { MdSpaceDashboard } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import apiRequest from "@/utils/api";
import { toast } from "sonner";

const BottomNavBar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user);
    const urlParams = new URLSearchParams(location.search);
    const currentTab = urlParams.get("tab");

    const handleSignout = async () => {
      try {
        await apiRequest("/api/user/signout", {
          method: "POST",
        });
        dispatch(signOutSuccess());
        toast.success("Signed out");
      } catch (error) {
        console.error(error);
      }
    }

    const isActive = (path, tab = null) => {
      if (tab) {
        return currentTab === tab;
      }
      return location.pathname === path && !currentTab;
    };

    const linkClass = (active) => 
      `flex flex-col items-center gap-1 transition-all duration-300 ${
        active ? "text-blue-600 scale-110" : "text-slate-500 hover:text-slate-800"
      }`;

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 p-3 pb-6 flex justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <Link
          to="/"
          className={linkClass(isActive("/"))}
        >
          <FaHome size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </Link>

        {currentUser?.isAdmin && (
          <Link
            to="/dashboard?tab=dashboard"
            className={linkClass(isActive("/dashboard", "dashboard"))}
          >
            <MdSpaceDashboard size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Stats</span>
          </Link>
        )}

        {currentUser?.isAdmin && (
          <Link
            to="/dashboard?tab=posts"
            className={linkClass(isActive("/dashboard", "posts"))}
          >
            <IoIosDocument size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Posts</span>
          </Link>
        )}

        <Link
          to="/dashboard?tab=profile"
          className={linkClass(isActive("/dashboard", "profile"))}
        >
          <FaUser size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
        </Link>

        <button
          className="flex flex-col items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
          onClick={handleSignout}
        >
          <FaSignOutAlt size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Exit</span>
        </button>
      </nav>
    );
}

export default BottomNavBar;