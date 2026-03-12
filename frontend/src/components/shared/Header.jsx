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

  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  /**
   * FIXED: Strict URL Sanitizer for Appwrite Free Tier
   * This forces the '/view' endpoint and strips ALL transformation query params.
   */
  const getCorrectImageUrl = (url) => {
    if (!url) return null;
    
    if (url.includes('appwrite.io')) {
      // 1. Force the 'view' endpoint (Original file) instead of 'preview'
      let safeUrl = url.replace('/preview', '/view');
      
      try {
        const urlObj = new URL(safeUrl);
        // 2. We only keep the 'project' ID. 
        // Stripping width, height, quality, etc., stops the 403 error.
        const projectId = urlObj.searchParams.get('project');
        return `${urlObj.origin}${urlObj.pathname}?project=${projectId}`;
      } catch (e) {
        // Fallback if URL parsing fails
        return safeUrl.split('&width')[0].split('&height')[0];
      }
    }
    return url;
  };

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
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Signout Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="flex justify-between items-center max-w-6xl lg:max-w-7xl mx-auto p-4">
        
        {/* Logo Section */}
        <Link to={"/"} className="hover:opacity-80 transition-opacity">
          <h1 className="font-bold text-xl sm:text-2xl flex flex-wrap tracking-tighter">
            <span className="text-blue-700">News</span>
            <span className="text-red-600 ml-1">Nova</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          className="hidden sm:flex p-2.5 bg-slate-100 rounded-full items-center px-4 transition-all focus-within:ring-2 focus-within:ring-blue-200 focus-within:bg-white border border-transparent focus-within:border-blue-100"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search stories..."
            className="focus:outline-none bg-transparent w-32 lg:w-80 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FaSearch className="text-slate-400 hover:text-blue-600 transition-colors" />
          </button>
        </form>

        {/* Navigation & User Menu */}
        <nav className="flex gap-4 items-center">
          <ul className="hidden md:flex gap-6 items-center mr-4">
            <li>
              <Link to={"/"} className="text-slate-600 hover:text-blue-700 transition-colors font-semibold text-sm">
                Home
              </Link>
            </li>
            <li>
              <Link to={"/news"} className="text-slate-600 hover:text-blue-700 transition-colors font-semibold text-sm">
                Latest News
              </Link>
            </li>
          </ul>

          <div className="flex items-center">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center outline-none group">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all shadow-sm">
                      {currentUser.profilePicture ? (
                        <img
                          src={getCorrectImageUrl(currentUser.profilePicture)}
                          alt="User Profile"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${currentUser.username}&background=2563eb&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          {currentUser.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64 mt-2" align="end">
                  <DropdownMenuLabel className="flex flex-col gap-0.5 p-3">
                    <span className="text-xs font-normal text-slate-500 uppercase tracking-wider">Account</span>
                    <span className="font-bold text-slate-900 truncate">@{currentUser.username}</span>
                    <span className="text-xs text-slate-400 truncate">{currentUser.email}</span>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/dashboard?tab=profile" className="cursor-pointer p-3 font-medium">
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>

                  {currentUser.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard?tab=posts" className="cursor-pointer p-3 font-medium">
                        Manage Content
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600 font-bold cursor-pointer p-3 focus:bg-red-50"
                    onClick={handleSignout}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to={"/sign-in"}>
                <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 rounded-full font-bold transition-all shadow-md">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;