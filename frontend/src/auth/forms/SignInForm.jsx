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

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      // ✅ Proper error handling
      if (!res.ok) {
        dispatch(signInFailure(data.message));
        toast.error(data.message || "Sign in failed!");
        return;
      }

      // ✅ Success
      dispatch(signInSuccess(data));
      toast.success("Sign in Successful!");
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message));
      toast.error("Something went wrong!");
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
            <span className="text-slate-500">Morning</span>
            <span className="text-slate-900">Dispatch</span>
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
              className="bg-blue-500 py-6 rounded-2xl w-full"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>

            <div className="flex gap-2 text-sm mt-5">
              <span>Don't have an Account?</span>
              <Link to={"/sign-up"} className="text-blue-500">
                Sign Up
              </Link>
            </div>
          </form>

          {/* ✅ Redux error display */}
          {error && (
            <p className="text-red-500 text-center text-sm mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
