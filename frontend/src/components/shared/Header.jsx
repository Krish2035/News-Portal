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

  // Sync search input with URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm("");
    }
  }, [location.search]);

  const getCorrectImageUrl = (url) => {
    if (!url) return null;
    if (url.includes('appwrite.io')) {
      let safeUrl = url.replace('/preview', '/view');
      try {
        const urlObj = new URL(safeUrl);
        const projectId = urlObj.searchParams.get('project');
        return `${urlObj.origin}${urlObj.pathname}?project=${projectId}`;
      } catch (e) {
        return safeUrl.split('&')[0];
      }
    }
    return url;
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      if (res.ok) {
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
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-4 px-6">
        
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h1 className="font-bold text-xl sm:text-2xl flex tracking-tighter">
            <span className="text-blue-700">News</span>
            <span className="text-red-600 ml-1">Nova</span>
          </h1>
        </Link>

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
          <button type="submit">
            <FaSearch className="text-slate-400 hover:text-blue-600 transition-colors" />
          </button>
        </form>

        <nav className="flex gap-4 items-center">
          <ul className="hidden md:flex gap-6 items-center mr-4">
            <li>
              <Link to="/" className="text-slate-600 hover:text-blue-700 transition-colors font-semibold text-sm">
                Home
              </Link>
            </li>
            <li>
              <Link to="/news" className="text-slate-600 hover:text-blue-700 transition-colors font-semibold text-sm">
                Latest
              </Link>
            </li>
          </ul>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none group">
                  <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all shadow-sm">
                    <img
                      src={getCorrectImageUrl(currentUser.profilePicture)}
                      alt="User"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${currentUser.username}&background=2563eb&color=fff`;
                      }}
                    />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end">
                <DropdownMenuLabel className="flex flex-col p-3">
                  <span className="text-xs font-normal text-slate-500 uppercase">Account</span>
                  <span className="font-bold text-slate-900 truncate">@{currentUser.username}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard?tab=profile" className="cursor-pointer p-3 font-medium">Profile</Link>
                </DropdownMenuItem>
                {currentUser.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard?tab=posts" className="cursor-pointer p-3 font-medium">Manage Content</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 font-bold cursor-pointer p-3" onClick={handleSignout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/sign-in">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 rounded-full font-bold shadow-md">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;