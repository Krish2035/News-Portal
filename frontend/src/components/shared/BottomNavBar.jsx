import { signOutSuccess } from '@/redux/user/userSlice';
import React from 'react'
import { FaHome, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { MdSpaceDashboard } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";

const BottomNavBar = () => {
    const dispatch = useDispatch()

    const handleSignout = async () => {
      try {
        const res = await fetch("/api/user/signout", {
          method: "POST",
        })

        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signOutSuccess());
        }
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-200 border-t border-gray-300 p-2 flex justify-around">
        <Link to="/" className="flex flex-col items-center text-slate-800">
          <FaHome size={20} />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          to="/dashboard?tab=profile"
          className="flex flex-col items-center text-slate-800"
        >
          <FaUser size={20} />
          <span className="text-xs">Profile</span>
        </Link>

        <button
          className="flex flex-col items-center text-slate-800"
          onClick={handleSignout}
        >
          <FaSignOutAlt size={20} />
          <span className="test-xs">Logout</span>
        </button>
      </nav>
    );
}

export default BottomNavBar