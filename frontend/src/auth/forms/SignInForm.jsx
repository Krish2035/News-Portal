import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "@/redux/user/userSlice";
import GoogleAuth from "@/components/shared/GoogleAuth";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Define the Base URL (Fallback to your Render/Vercel backend URL)
  const backendBase = import.meta.env.VITE_API_URL || "https://news-portal-7g52.vercel.app";

  const { loading, error } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    try {
      dispatch(signInStart());

      // UPDATED: Use backendBase to avoid hitting the frontend Vercel URL
      const res = await fetch(`${backendBase}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        // This allows the browser to save the cookie sent by the server
        credentials: "include",
      });

      // Safely check if response is JSON to avoid "Unexpected token T"
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();

        if (!res.ok) {
          dispatch(signInFailure(data.message));
          toast.error(data.message || "Sign in failed!");
          return;
        }

        // Success logic
        dispatch(signInSuccess(data));
        toast.success("Sign in Successful!");
        navigate("/");
      } else {
        // Handle case where server returns HTML error page
        const errorText = await res.text();
        console.error("Non-JSON response received:", errorText);
        dispatch(signInFailure("Server error: Received HTML instead of JSON"));
        toast.error("Server configuration error. Please try again later.");
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
      toast.error("Network error: Could not reach the server.");
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl sm:max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link
            to={"/"}
            className="font-bold text-2xl sm:text-4xl flex flex-wrap"
          >
            <span className="text-slate-500">News</span>
            <span className="text-slate-900">Nova</span>
          </Link>

          <h2 className="text-[24px] md:text-[30px] font-bold leading-[140%] tracking-tighter pt-5 sm:pt-12">
            Sign in to your account.
          </h2>

          <p className="text-slate-500 text-[14px] font-medium mt-2">
            Welcome back, Please provide your details as required
          </p>
        </div>

        <div className="flex-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 bg-white p-6 rounded shadow-md"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                {...register("email")}
                type="text"
                placeholder="xyz@gmail.com"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-3"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password here..."
                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-3"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="bg-blue-500 py-6 rounded-2xl w-full text-white hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>

            <GoogleAuth />

            <div className="flex gap-2 text-sm mt-5">
              <span>Don't have an Account?</span>
              <Link to={"/sign-up"} className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </div>
          </form>

          {error && (
            <p className="text-red-500 text-center text-sm mt-4 font-semibold bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInForm;