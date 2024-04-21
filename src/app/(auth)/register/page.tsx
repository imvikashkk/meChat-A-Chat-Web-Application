"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { AvatarGenerator } from "random-avatar-generator";
import { Shantell_Sans } from "next/font/google";
import Image from "next/image";
import EyeIcon from "@/components/Icons/UnhideEye";
import EyeSlashIcon from "@/components/Icons/HideEye";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import GoogleIcon from "@/components/Icons/GoogleIcon";

const shantell_Sans = Shantell_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const provider = new GoogleAuthProvider();

interface IFormInput {
  name: string;
  email: string;
  password: string;
  confirmPass: string;
}

function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [avatar, setAvatar] = useState<string>("/");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const generateRandomAvatar = () => {
    const generator = new AvatarGenerator();
    const avatar = generator.generateRandomAvatar();
    return avatar;
  };

  const handleRefreshAvatar = () => {
    setAvatar(generateRandomAvatar());
  };

  useEffect(() => {
    setAvatar(generateRandomAvatar());
  }, []);

  const GoogleSignUP = () => {
    setError("");
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        if (user) {
          try {
            onSnapshot(
              query(collection(firestore, "users"), where("email", "==", user.email)),
              async (snapshot: any) => {
                console.log(snapshot)
                if(snapshot?.userData){
                  console.log("User Already Registered !")
                }else{
                  const docRef = doc(firestore, "users", user.uid);
                  await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    avatar: user.photoURL,
                  });
                }
              }
            );
          } catch (error) {
            console.log({error:error})
          }
        } else {
          setError("Something Wrong !");
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        let errorMessage = error.message;

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = await userCredential.user;
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {
        name: data.name,
        email: data.email,
        avatar,
      });
      alert("You are registered successfully.");
      setLoading(false);
      router.replace("/");
    } catch (error: any) {
      setLoading(false);
      setError(error?.message || "some error ocuured !");
    }
  };

  return (
    <div className="flex justify-center items-center  w-screen py-8 sm:py-5 overflow-auto">
      <form
        className={`w-full mx-3 max-w-2xl shadow-lg border-2 border-solid border-slate-200 rounded-lg ${
          loading && "cursor-progress"
        }`}
        onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 w-full py-8 px-10 sm:py-4 sm:px-3 relative">
          {loading && (
            <span className="absolute top-0 left-0 w-full h-full bg-transparent z-[50]"></span>
          )}
          <h1
            className={`text-3xl text-center font-semibold text-[#0b3a65ff] dark:text-[#5199dd]  select-none ${shantell_Sans.className}`}>
            me<span className="font-bold text-[#eeab63ff]">C</span>h
            <span className="font-bold text-[#f15a5a]">a</span>t
          </h1>

          {/* SignUP With Google */}
          <div
            onClick={(e) => {
              e.preventDefault();
              GoogleSignUP()
            }}
            className={`btn btn-block  bg-lime-200 dark:bg-slate-500 dark:text-slate-300  text-[#202020] hover:text-[#0b3a65ff] flex items-center group`}>
            <GoogleIcon className="w-7 h-7 dark:contrast-150 group-hover:brightness-50" />
            SignUP With Google
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

          {/* Avatar */}
          <div className="flex items-center space-y2 justify-between border border-gray-200 p-2">
            <Image
              priority={true}
              loading="eager"
              alt="avatar"
              src={avatar}
              width={100}
              height={100}
              className="rounded-full h-20 w-20"
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleRefreshAvatar}>
              New Avatar
            </button>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="label">
              <span className="text-base label-text">Name</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full input input-bordered"
              {...register("name", {
                required: "name is required",
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "invalid name",
                },
                maxLength: {
                  value: 20,
                  message: "maxLength is 20",
                },
              })}
            />
            {errors?.name && (
              <span className="text-red-500">{`*${errors?.name?.message}`}</span>
            )}
          </div>

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

          {/* password */}
          <div>
            <label htmlFor="password" className="label">
              <span className="text-base label-text">Password</span>
            </label>
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

          {/* confirmPassword */}
          <div>
            <label htmlFor="confirmPass" className="label">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <div className="flex relative w-full">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="confirmPass"
                placeholder="Enter confirm Password"
                className="w-full input input-bordered"
                {...register("confirmPass", {
                  required: "confirm password is required",
                  validate: (value, formValues) =>
                    value === formValues.password || "password not matching",
                })}
              />
              {showCurrentPassword ? (
                <EyeSlashIcon
                  className="absolute right-2 w-6 h-6 top-3 cursor-pointer"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                />
              ) : (
                <EyeIcon
                  className="absolute right-2 w-6 h-6 top-3 cursor-pointer"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                />
              )}
            </div>
            {errors.confirmPass && (
              <span className="text-red-500">{`*${errors?.confirmPass?.message}`}</span>
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
                "Register"
              )}
            </button>
            {error && <span className="text-red-600">! {error}</span>}
          </div>

          {/* Navigate to Login */}
          <span className="text-right sm:text-center w-full block">
            Already have an Account?{" "}
            <Link
              href={"/login"}
              className="text-blue-600 hover:text-blue-800 hover:underline">
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default Register;
