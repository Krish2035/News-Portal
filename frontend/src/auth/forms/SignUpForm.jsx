import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import GoogleAuth from "@/components/shared/GoogleAuth";

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

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handling duplicate key error from MongoDB (E11000)
        const friendlyMessage = data.message?.includes("E11000")
          ? "Username or Email already exists."
          : data.message || "Sign up failed!";

        setErrorMessage(friendlyMessage);
        toast.error(friendlyMessage);
        setLoading(false);
        return;
      }

      // Success Logic
      toast.success("Sign up Successful!");
      setLoading(false);
      navigate("/sign-in");
    } catch (err) {
      setErrorMessage("Unable to connect to the server.");
      toast.error("Something went wrong!");
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl sm:max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-5">
        
        {/* Left Section: Branding & Rebranding to News Nova */}
        <div className="flex-1">
          <Link
            to={"/"}
            className="font-bold text-2xl sm:text-4xl flex flex-wrap"
          >
            {/* Consistent branding colors for News Nova */}
            <span className="text-blue-700">News</span>
            <span className="text-red-600 ml-1">Nova</span>
          </Link>

          <h2 className="text-[24px] md:text-[30px] font-bold leading-[140%] tracking-tighter pt-5 sm:pt-12">
            Create a new Account
          </h2>

          <p className="text-slate-500 text-[14px] md:text-[16px] mt-2">
            Welcome to News Nova, Please provide your details
          </p>
        </div>

        {/* Right Section: Form */}
        <div className="flex-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 bg-white p-6 rounded shadow-md border border-slate-100"
          >
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                placeholder="Enter your username here..."
                className="mt-2 block w-full rounded border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 outline-none border"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="xyz@gmail.com"
                className="mt-2 block w-full rounded border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 outline-none border"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password here..."
                className="mt-2 block w-full rounded border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 outline-none border"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-colors py-3 rounded-2xl w-full text-white font-semibold shadow-lg"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>

            <div className="relative my-4">
               <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
               <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or continue with</span></div>
            </div>

            <GoogleAuth />

            <div className="flex gap-2 text-sm mt-5 justify-center">
              <span>Have an Account?</span>
              <Link to={"/sign-in"} className="text-blue-600 font-semibold hover:underline">
                Sign In
              </Link>
            </div>
          </form>

          {/* Error Message Display */}
          {errorMessage && (
            <p className="mt-5 text-red-500 text-center font-medium bg-red-50 p-2 rounded border border-red-100">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;