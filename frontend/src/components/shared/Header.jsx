import React from "react";
import { Link } from "react-router-dom";
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
  const dispatch = useDispatch()

  const { currentUser } = useSelector((state) => state.user);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      })

      const data = await res.json()

      if(!res.ok){
        console.log(data.message)
      }else{
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header className="shadow-lg sticky top-0 z-50 bg-white">
      <div className="flex justify-between items-center max-w-6xl lg:max-w-7xl mx-auto p-4">
        <Link to={"/"}>
          <h1 className="font-bold text-xl sm:text-2xl flex flex-wrap">
            <span className="text-slate-500">Morning</span>
            <span className="text-slate-900">Dispatch</span>
          </h1>
        </Link>

        <form className="p-3 bg-slate-100 rounded-lg flex items-center">
          <input
            type="search"
            placeholder="Search..."
            className="focus:outline-none bg-transparent w-24 sm:w-64"
          />
          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="flex gap-4 items-center">
          <li className="hidden lg:inline">
            <Link to={"/"} className="text-slate-700 hover:underline">
              Home
            </Link>
          </li>
          <li className="hidden lg:inline">
            <Link to={"/about"} className="text-slate-700 hover:underline">
              About
            </Link>
          </li>
          <li className="hidden lg:inline">
            <Link to={"/news"} className="text-slate-700 hover:underline">
              News Articles
            </Link>
          </li>
          <li>
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer ml-5">
                    {/* Logic: If profilePicture exists, show image. Otherwise, show purple circle */}
                    {currentUser.profilePicture &&
                    currentUser.profilePicture !== "" ? (
                      <img
                        src={currentUser.profilePicture}
                        alt="user"
                        className="h-9 w-9 rounded-full object-cover border-2 border-slate-200"
                      />
                    ) : (
                      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold shadow-md">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />

                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-2">
                    <span className="text-xs text-gray-500 font-normal">
                      Signed in as
                    </span>
                    <span className="font-semibold truncate w-full text-slate-800">
                      @{currentUser.username}
                    </span>
                    <span className="text-xs text-gray-500 truncate w-full">
                      {currentUser.email}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard?tab=profile"
                      className="cursor-pointer w-full mt-2"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="text-red-600 font-semibold cursor-pointer mt-2" onClick={handleSignout}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to={"/sign-in"}>
                <Button>Sign In</Button>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;