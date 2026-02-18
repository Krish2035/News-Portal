<li>
  {currentUser ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer ml-5">
          {/* Change: Only show image if profilePicture is not empty or null */}
          {currentUser.profilePicture && currentUser.profilePicture !== "" ? (
            <img
              src={currentUser.profilePicture}
              alt="user"
              className="h-9 w-9 rounded-full object-cover border-2 border-slate-200"
            />
          ) : (
            /* This is your purple circle 'S' symbol */
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
          <Link to="/dashboard?tab=profile" className="cursor-pointer w-full mt-2">
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-600 font-semibold cursor-pointer mt-2">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link to={"/sign-in"}>
      <Button>Sign In</Button>
    </Link>
  )}
</li>;
