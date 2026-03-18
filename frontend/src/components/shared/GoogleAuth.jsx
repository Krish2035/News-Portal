import React from "react";
import { Button } from "../ui/button";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { app } from "@/firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "@/redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Define the Base URL
  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const firebaseResponse = await signInWithPopup(auth, provider);

      // UPDATED: Added backendBase to the fetch call
      const res = await fetch(`${backendBase}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: firebaseResponse.user.displayName,
          email: firebaseResponse.user.email,
          profilePhotoUrl: firebaseResponse.user.photoURL,
        }),
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok) {
          dispatch(signInSuccess(data));
          navigate("/");
        }
      } else {
        console.error("Server did not return JSON");
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  return (
    <div>
      <Button
        type="button"
        className="bg-green-500 w-full py-3 rounded-2xl text-white pt-6 pb-6 hover:bg-green-600"
        onClick={handleGoogleClick}
      >
        Continue With Google
      </Button>
    </div>
  );
};

export default GoogleAuth;