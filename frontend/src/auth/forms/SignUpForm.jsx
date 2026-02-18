import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import GoogleAuth from "@/components/shared/GoogleAuth";

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
        const friendlyMessage = data.message?.includes("E11000")
          ? "Username or Email already exists."
          : data.message || "Sign up failed!";

        setErrorMessage(friendlyMessage);
        toast.error(friendlyMessage);
        setLoading(false);
        return;
      }

      // ✅ Success
      toast.success("Sign up Successful!");
      setLoading(false);
      navigate("/sign-in");
    } catch (err) {
      setErrorMessage("Unable to connect to the server.");
      toast.err("Something went wrong!");
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl sm:max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left Section */}
        <div className="flex-1">
          <Link
            to={"/"}
            className="font-bold text-2xl sm:text-4xl flex flex-wrap"
          >
            <span className="text-slate-500">Morning</span>
            <span className="text-slate-900">Dispatch</span>
          </Link>

          <h2 className="text-[24px] md:text-[30px] font-bold leading-[140%] tracking-tighter pt-5 sm:pt-12">
            Create a new Account
          </h2>

          <p className="text-slate-500 text-[14px] md:text-[16px] mt-2">
            Welcome to Morning Dispatch, Please provide your details
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 bg-white p-6 rounded shadow-md"
          >
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                placeholder="Enter your username here..."
                className="mt-2 block w-full rounded border-gray-300 shadow-sm p-3"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="xyz@gmail.com"
                className="mt-2 block w-full rounded border-gray-300 shadow-sm p-3"
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
                className="mt-2 block w-full rounded border-gray-300 shadow-sm p-3"
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
              className="bg-blue-500 py-3 rounded-2xl w-full text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>

            <GoogleAuth />

            <div className="flex gap-2 text-sm mt-5">
              <span>Have an Account?</span>
              <Link to={"/sign-in"} className="text-blue-500">
                Sign In
              </Link>
            </div>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <p className="mt-5 text-red-500 text-center">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
