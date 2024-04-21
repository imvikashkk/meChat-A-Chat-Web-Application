"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Shantell_Sans } from "next/font/google";
import EyeIcon from "@/components/Icons/UnhideEye";
import EyeSlashIcon from "@/components/Icons/HideEye";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import GoogleIcon from "@/components/Icons/GoogleIcon";

const shantell_Sans = Shantell_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

interface IFormInput {
  email: string;
  password: string;
}

const provider = new GoogleAuthProvider();

function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const GoogleLogin = () => {
    setError("");
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        if (user) {
          router.replace("/");
        } else {
          setError("Invalid Credential");
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        let errorMessage = error.message;
        console.log({error: error.message, errorCode: errorCode})
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...

        console.log({ error: error.code });
        switch (errorCode) {
          case "auth/invalid-email":
            errorMessage = "Invalid email address";
            break;
          case "auth/user-disabled":
            errorMessage = "User account is disabled";
            break;
          case "auth/user-not-found":
            errorMessage = "User not found";
            break;
          case "auth/wrong-password":
            errorMessage = "Invalid email or password";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many requests. Try again later";
            break;
          case "auth/invalid-credential":
            errorMessage = "Invalid Credentials";
            break;
          default:
            errorMessage = "An error occurred";
            break;
        }
        setError(errorMessage);
      });
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      if (user) {
        router.replace("/");
      } else {
        setError("Invalid Credential");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      const errorCode = error.code;
      let errorMessage = error?.message;
      console.log({ error: error.code });
      switch (errorCode) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "User account is disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found";
          break;
        case "auth/wrong-password":
          errorMessage = "Invalid email or password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Try again later";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid Credentials";
          break;
        default:
          errorMessage = "An error occurred";
          break;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen  w-screen overflow-auto">
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
            className={`text-3xl text-center font-semibold text-[#0b3a65ff] dark:text-[#5199dd] select-none  mb-10 ${shantell_Sans.className}`}>
            me<span className="font-bold text-[#eeab63ff]">C</span>h
            <span className="font-bold text-[#f15a5a]">a</span>t
          </h1>

          {/* SignIn With Google */}
          <div
          onClick={()=>GoogleLogin()}
            className={`btn btn-block  bg-lime-200 dark:bg-slate-500 dark:text-slate-300  text-[#202020] hover:text-[#0b3a65ff] flex items-center group`}>
            <GoogleIcon className="w-7 h-7 dark:contrast-150 group-hover:brightness-50" />
            SignIN With Google
          </div>

          {/* Horizontal Line */}
          <div className="pb-4 pt-4">
            <div className="relative">
              <hr className=" absolute w-full h-[1px] bg-slate-400 border-none" />
              <p className="absolute -top-[10px] left-[48%] px-1 text-sm dark:bg-slate-700 bg-slate-300 rounded-lg">
                OR
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="">
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

          {/* password */}
          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="label">
                <span className="text-base label-text">Password</span>
              </label>
              <Link
                href={"/forgot-password"}
                className="text-blue-600 hover:text-blue-800 hover:underline text-right">
                Forgot Password?
              </Link>
            </div>
            <div className="flex relative w-full">
              <input
                id="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "password is required",
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    message: `- at least 8 characters\n
                      - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n
                      - Can contain special characters`,
                  },
                })}
                type={showPassword ? "text" : "password"}
                className="w-full input input-bordered"
              />
              {showPassword ? (
                <EyeSlashIcon
                  className="absolute right-2 w-6 h-6 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <EyeIcon
                  className="absolute right-2 w-6 h-6 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            {errors?.password && (
              <span className="text-red-500">{`*${errors?.password?.message}`}</span>
            )}
          </div>

          {/* button */}
          <div>
            <button
              type="submit"
              className={`btn btn-block bg-[#0b3a65ff] text-white hover:text-[#0b3a65ff]`}>
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
            {error && <span className="text-red-600">! {error}</span>}
          </div>

          {/* Navigate to Login */}
          <span className="text-right sm:text-center w-full block">
            {"Don't have an Account? "}
            <Link
              href={"/register"}
              className="text-blue-600 hover:text-blue-800 hover:underline">
              Register
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;
