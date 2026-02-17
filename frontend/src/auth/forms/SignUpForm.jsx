import React from 'react'
import { Link } from 'react-router-dom'
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be atleast 2 characters" }),
  email: z
    .string()
    .email({ message: "Invalid Email Address." }),
  password: z
    .string()
    .min(8, { message: "Passoword must be atleast 8 characters long." }),
});

const SignUpForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email:"",
      password:"",
    },
  })

  function onSubmit(values) {
    console.log(values)
  }
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl sm:max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left defined */}
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

          <p className="text-slate-500 text-[14px] font-medium leading-[140%] md:text-[16px] md:font-normal mt-2">
            Welcome to Morning Dispatch, Please provide your details
          </p>
        </div>

        {/* right defined */}
        <div className="flex-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 bg-white p-6 rounded shadow-md"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                placeholder="Enter your username here..."
                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-3 mt-2"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                {...register("email")}
                type="text"
                placeholder="xyz@gmail.com"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-3 mt-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password here..."
                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-3 mt-2"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="bg-blue-500 pt-3 pb-3 rounded-2xl mt-2.5 w-full"
              >
                Submit
              </button>
            </div>
            <div className="flex gap-2 text-sm mt-5">
              <span>Have an Account?</span>
              <Link to={"/sign-in"} className="text-blue-500">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm