import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import GoogleAuth from "@/components/shared/GoogleAuth";
import apiRequest from "@/utils/api"; // Import your new central utility

// Form Validation Schema
const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid Email Address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

const SignUpForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      setLoading(true);
      setErrorMessage(null);

      // Using the centralized utility
      await apiRequest("/api/auth/signup", {
        method: "POST",
        body: values,
      });

      // Success Logic
      toast.success("Account created successfully! Please sign in.");
      navigate("/sign-in");
    } catch (err) {
      // Handle specific MongoDB duplicate key errors (E11000)
      const friendlyMessage = err.message?.includes("E11000")
        ? "Username or Email already exists."
        : err.message || "Sign up failed!";

      setErrorMessage(friendlyMessage);
      toast.error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen mt-20 px-4">
      <div className="flex p-3 max-w-3xl sm:max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-10">
        
        {/* Left Section: Branding */}
        <div className="flex-1">
          <Link to={"/"} className="font-bold text-3xl sm:text-4xl flex items-center">
            <span className="text-blue-600">News</span>
            <span className="text-slate-900 ml-1">Nova</span>
          </Link>

          <h2 className="text-[24px] md:text-[32px] font-extrabold leading-tight tracking-tight pt-5 sm:pt-12 text-slate-900">
            Create a new account.
          </h2>

          <p className="text-slate-500 text-[14px] md:text-[16px] mt-3 font-medium">
            Join the community and stay updated with the latest headlines.
          </p>
        </div>

        {/* Right Section: Form */}
        <div className="flex-1 w-full max-w-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
          >
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Username</label>
              <input
                {...register("username")}
                type="text"
                placeholder="Enter your username"
                className="w-full rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-all py-3.5 rounded-xl w-full text-white font-bold text-lg shadow-lg disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="relative my-6">
               <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
               <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500 font-semibold tracking-wider">Or continue with</span></div>
            </div>

            <GoogleAuth />

            <div className="flex gap-2 text-sm mt-6 justify-center text-slate-600">
              <span>Already have an account?</span>
              <Link to={"/sign-in"} className="text-blue-600 font-bold hover:underline">Sign In</Link>
            </div>
          </form>

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-600 text-center text-sm font-semibold">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;