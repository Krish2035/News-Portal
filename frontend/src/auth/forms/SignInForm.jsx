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
import apiRequest from "@/utils/api"; // Import your new central utility

// Form validation schema
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

  const onSubmit = async (values) => {
    try {
      dispatch(signInStart());

      // Use the centralized apiRequest
      const data = await apiRequest("/api/auth/signin", {
        method: "POST",
        body: values,
      });

      // If apiRequest doesn't throw, it's a success
      dispatch(signInSuccess(data));
      toast.success("Welcome back to News Nova!");
      navigate("/");
    } catch (err) {
      // The utility automatically throws the error message from the backend
      dispatch(signInFailure(err.message));
      toast.error(err.message || "Could not connect to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="flex w-full max-w-4xl flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-center md:text-left">
          <Link to="/" className="font-bold text-4xl flex gap-1 justify-center md:justify-start">
            <span className="text-blue-600">News</span>
            <span className="text-slate-900">Nova</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-6">
            Sign in to your account.
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Join our community and stay updated with the latest news.
          </p>
        </div>

        <div className="flex-1 w-full max-w-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="name@company.com"
                className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-bold text-lg transition-all"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Sign In"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or continue with</span></div>
            </div>

            <GoogleAuth />

            <p className="text-center text-sm text-slate-600 mt-6">
              New to News Nova? <Link to="/sign-up" className="text-blue-600 font-bold hover:underline">Create an account</Link>
            </p>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-600 text-center text-sm font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInForm;