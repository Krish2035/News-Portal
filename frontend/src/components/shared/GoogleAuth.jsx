import React, { useState } from "react";
import { Button } from "../ui/button";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Standardized import
import { app } from "@/firebase";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "@/redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import apiRequest from "@/utils/api"; 

const GoogleAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    // Forces the account selection screen every time
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      setLoading(true);
      const firebaseResponse = await signInWithPopup(auth, provider);

      /**
       * Send Firebase data to News Nova Backend.
       * The 'profilePhotoUrl' key here matches the expected field 
       * in your backend auth.controller.js.
       */
      const data = await apiRequest("/api/auth/google", {
        method: "POST",
        body: {
          name: firebaseResponse.user.displayName,
          email: firebaseResponse.user.email,
          profilePhotoUrl: firebaseResponse.user.photoURL,
        },
      });

      dispatch(signInSuccess(data));
      toast.success("Welcome to News Nova!");
      navigate("/");
    } catch (error) {
      console.error("Google Auth Error:", error);
      // Handles both Firebase cancelation and Backend errors
      const errorMessage = error.message || "Could not complete Google Sign-in.";
      dispatch(signInFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        type="button"
        className="w-full py-6 rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70"
        onClick={handleGoogleClick}
        disabled={loading}
      >
        {loading ? (
          "Connecting..."
        ) : (
          <>
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.228 1.216-3.144 2.344-6.384 2.344-5.128 0-9.152-4.128-9.152-9.28s4.024-9.28 9.152-9.28c2.768 0 4.756 1.088 6.24 2.512l2.304-2.304C18.596 1.44 15.896 0 12.48 0 5.584 0 0 5.584 0 12.48s5.584 12.48 12.48 12.48c3.752 0 6.576-1.232 8.776-3.536 2.272-2.272 2.992-5.472 2.992-8.112 0-.768-.064-1.496-.184-2.184h-11.576z" />
            </svg>
            Continue with Google
          </>
        )}
      </Button>
    </div>
  );
};

export default GoogleAuth;