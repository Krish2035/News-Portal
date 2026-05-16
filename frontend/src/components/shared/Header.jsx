import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Disable scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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
      const res = await fetch(`${API_BASE_URL}/api/user/signout`, {
        method: "POST",
        credentials: "include", 
      });

      if (res.ok) {
        dispatch(signOutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Signout Error:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="shadow-sm sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-4 px-6">
        
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h1 className="font-bold text-xl sm:text-2xl flex tracking-tighter">
            <span className="text-blue-700">News</span>
            <span className="text-red-600 ml-1">Nova</span>
          </h1>
        </Link>

        {/* Desktop Search */}
        <form
          className="hidden md:flex p-2.5 bg-slate-100 rounded-full items-center px-4 transition-all focus-within:ring-2 focus-within:ring-blue-200 focus-within:bg-white border border-transparent focus-within:border-blue-100"
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
          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-6 items-center mr-4">
            <li>
              <Link to="/" className="text-slate-600 hover:text-blue-700 transition-colors font-semibold text-sm">
                Home
              </Link>
            </li>
            <li>
              <Link to="/search" className="text-slate-600 hover:text-blue-700 transition-colors font-semibold text-sm">
                Latest
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-4">
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
              <Link to="/sign-in" className="hidden sm:block">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 rounded-full font-bold shadow-md">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay (Backdrop) */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed top-0 left-0 h-screen w-[280px] bg-white z-[60] shadow-2xl transition-transform duration-300 ease-in-out transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex flex-col gap-8 h-full overflow-y-auto">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center">
             <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:opacity-80 transition-opacity">
                <h1 className="font-bold text-xl flex tracking-tighter">
                  <span className="text-blue-700">News</span>
                  <span className="text-red-600 ml-1">Nova</span>
                </h1>
              </Link>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-100"
              >
                <FaTimes size={20} />
              </button>
          </div>

          {/* Sidebar Search */}
          <form
            className="flex p-3.5 bg-slate-50 rounded-2xl items-center px-4 border border-slate-100 focus-within:border-blue-200 focus-within:bg-white transition-all shadow-inner"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Search latest news..."
              className="focus:outline-none bg-transparent flex-1 text-sm font-medium text-slate-700 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FaSearch className="text-slate-400 hover:text-blue-600 transition-colors" />
            </button>
          </form>

          {/* Sidebar Links */}
          <ul className="flex flex-col gap-2">
            <li>
              <Link 
                to="/" 
                className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 ${location.pathname === '/' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 font-semibold hover:bg-slate-50'}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/search" 
                className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 ${location.pathname === '/search' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 font-semibold hover:bg-slate-50'}`}
              >
                Latest News
              </Link>
            </li>
            
            {currentUser && currentUser.isAdmin && (
               <li>
               <Link 
                 to="/dashboard?tab=posts" 
                 className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 ${location.search.includes('tab=posts') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 font-semibold hover:bg-slate-50'}`}
               >
                 Manage Content
               </Link>
             </li>
            )}
          </ul>

          {/* Bottom Actions */}
          <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-slate-100">
            {!currentUser ? (
               <Link to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                 <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-2xl font-bold text-white shadow-lg shadow-blue-100 transition-all active:scale-95">
                   Sign In
                 </Button>
               </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest px-2 mb-1">Logged in as</p>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <img
                    src={getCorrectImageUrl(currentUser.profilePicture)}
                    alt="User"
                    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex flex-col truncate">
                    <span className="font-bold text-slate-900 text-sm truncate">@{currentUser.username}</span>
                    <span className="text-[10px] text-slate-500 font-medium truncate">{currentUser.email}</span>
                  </div>
                </div>
              </div>
            )}
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] text-center mt-2">© 2026 NEWS NOVA</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;