import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutSuccess } from "@/redux/user/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // The Header component automatically re-renders whenever Redux state changes
  const { currentUser } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/sign-in"); // Redirect user after signing out
      }
    } catch (error) {
      console.error("Signout Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm); // Standardized to camelCase
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className="shadow-lg sticky top-0 z-50 bg-white">
      <div className="flex justify-between items-center max-w-6xl lg:max-w-7xl mx-auto p-4">
        {/* Logo Section */}
        <Link to={"/"}>
          <h1 className="font-bold text-xl sm:text-2xl flex flex-wrap">
            <span className="text-slate-500">Morning</span>
            <span className="text-slate-900">Dispatch</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          className="p-3 bg-slate-100 rounded-lg flex items-center transition-all focus-within:ring-2 focus-within:ring-slate-300"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search..."
            className="focus:outline-none bg-transparent w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FaSearch className="text-slate-600 hover:text-slate-900 transition-colors" />
          </button>
        </form>

        {/* Navigation & User Menu */}
        <ul className="flex gap-4 items-center">
          <li className="hidden lg:inline">
            <Link
              to={"/"}
              className="text-slate-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
          </li>
          <li className="hidden lg:inline">
            <Link
              to={"/about"}
              className="text-slate-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
          </li>
          <li className="hidden lg:inline">
            <Link
              to={"/news"}
              className="text-slate-700 hover:text-blue-600 transition-colors"
            >
              News Articles
            </Link>
          </li>

          <li>
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer ml-5 outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500 rounded-full">
                    {/* KEY POINT: key={currentUser.profilePicture} 
                      forces the <img> tag to refresh if the URL changes 
                    */}
                    {currentUser.profilePicture ? (
                      <img
                        key={currentUser.profilePicture}
                        src={currentUser.profilePicture}
                        alt="User Profile"
                        className="h-9 w-9 rounded-full object-cover border-2 border-slate-200 shadow-sm hover:scale-110 transition-transform duration-200"
                      />
                    ) : (
                      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold shadow-md hover:bg-purple-700 transition-colors">
                        {currentUser.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-bold">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-2">
                    <span className="text-xs text-gray-500">Signed in as</span>
                    <span className="font-semibold truncate w-full text-slate-800">
                      @{currentUser.username}
                    </span>
                    <span className="text-xs text-gray-400 truncate w-full italic">
                      {currentUser.email}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard?tab=profile"
                      className="cursor-pointer w-full flex items-center"
                    >
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-red-600 font-semibold cursor-pointer focus:bg-red-50"
                    onClick={handleSignout}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to={"/sign-in"}>
                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
