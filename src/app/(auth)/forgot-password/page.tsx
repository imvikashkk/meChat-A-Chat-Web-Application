"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Shantell_Sans } from "next/font/google";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const shantell_Sans = Shantell_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

interface IFormInput {
  email: string;
}

function ForgotPassword() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, data.email);
      setMessage("Password Reset Link sent to your email.");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      let errorMessage = error?.message;
      setError(errorMessage);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen w-screen overflow-auto">
      <form
        className={`w-full mx-3 max-w-2xl shadow-lg border-2 border-solid border-slate-200 rounded-lg ${
          loading && "cursor-progress"
        }`}
        onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 w-full py-8 px-10 sm:py-4 sm:px-4 relative">
          {loading && (
            <span className="absolute top-0 left-0 w-full h-full bg-transparent z-[50]"></span>
          )}
          <h1
            className={`text-3xl text-center font-semibold text-[#0b3a65ff] dark:text-[#5199dd]  select-none ${shantell_Sans.className}`}>
            me<span className="font-bold text-[#eeab63ff]">C</span>h
            <span className="font-bold text-[#f15a5a]">a</span>t
          </h1>

          {/* Email */}
          <div>
            <label htmlFor="email" className="label">
              <span className="text-base label-text">Email</span>
            </label>
            <input
              id="email"
              placeholder="Enter your email"
              className="w-full input input-bordered"
              {...register("email", {
                required: "email is required",
                pattern: {
                  value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                  message: "email not valid",
                },
              })}
              type="email"
            />
            {errors?.email && (
              <span className="text-red-500">{`*${errors?.email?.message}`}</span>
            )}
          </div>

          {/* Message */}
          {message && (
            <div>
              <p className="text-green-600 text-lg text-center">{message}</p>
            </div>
          )}

          {/* button */}
          {message ? (
            <div>
            <button
              type="button"
              onClick={()=>router.replace("/login")}
              className={`btn btn-block bg-[#0b3a65ff] text-white hover:text-[#0b3a65ff]`}>
                Back to Login
            </button>
            {error && <span className="text-red-600">! {error}</span>}
          </div>
          ) : (
            <div>
              <button
                type="submit"
                className={`btn btn-block bg-[#0b3a65ff] text-white hover:text-[#0b3a65ff]`}>
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Send Link"
                )}
              </button>
              {error && <span className="text-red-600">! {error}</span>}
            </div>
          )}

          {/* Navigate to Login */}
          <span className="text-right sm:text-center w-full block">
            {"Back to "}
            <Link
              href={"/login"}
              className="text-blue-600 hover:text-blue-800 hover:underline">
              Login?
            </Link>
          </span>
          
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
