"use client"

import {
  EyeClosed,
  EyeIcon,
  Leaf,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import React from "react";
import { motion } from "motion/react";
import { useState } from "react";
import Image from "next/image";
import googleImg from "@/assets/google.png";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [showPassword, setSP] = useState(true);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const router = useRouter();

  
  const validateFields = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return; //  stop if validation fails

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log("this is RESULT : " ,result)

      if (result?.error) {

  const code = result.code // Because Nextjs Auth fails to return any result on unauthorised access
                            // we had  created a custom class of ERRORs in auth.ts

  if (code!.includes("USER_NOT_FOUND")) {
    setEmailError("No account found with this email.")
  } else if (code!.includes("WRONG_PASSWORD")) {
    setPasswordError("Incorrect password. Please try again.")
  } else if (code!.includes("Missing")) {
    setGeneralError("Please fill in all fields.")
  } else {
    setGeneralError("Something went wrong. Please try again.")
  }
}else {
        router.push("/");
      }
    } catch (err) {
      setGeneralError("Network error. Please check your connection.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <motion.h1
        className="text-2xl font-extrabold text-green-600 max-[300px]:text-lg mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Welcome Back
      </motion.h1>

      <motion.p
        className="text-[12px] text-gray-700 mt-2 flex gap-2 mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Login to Continue
        <Leaf className="h-5 w-5 text-green-600" />
      </motion.p>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-5 w-full max-w-sm"
      >
        
        {generalError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-xl px-4 py-3 text-center"
          >
            {generalError}
          </motion.div>
        )}

        <div className="flex flex-col gap-1">
          <div className="relative">
            <Mail className={`w-5 h-5 left-3 top-3.5 absolute ${emailError ? "text-red-400" : "text-gray-400"}`} />
            <input
              type="email"
              placeholder="Your Email"
              className={`w-full border rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 
                ${emailError
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-green-500"
                }`}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(""); // clear on type
              }}
              value={email}
            />
          </div>
        
          {emailError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs pl-1"
            >
              {emailError}
            </motion.p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Lock className={`w-5 h-5 left-3 top-3.5 absolute ${passwordError ? "text-red-400" : "text-gray-400"}`} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your Password Please"
              className={`w-full border rounded-xl py-3 pl-10 pr-10 text-gray-800 focus:outline-none focus:ring-2
                ${passwordError
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-green-500"
                }`}
              onChange={(e) => {
                setPass(e.target.value);
                setPasswordError(""); // clear on type
              }}
              value={password}
            />
            {showPassword ? (
              <EyeClosed
                className={`absolute right-3 top-3.5 text-gray-500 w-5 h-5 ${password === "" ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => setSP(false)}
              />
            ) : (
              <EyeIcon
                className="absolute right-3 top-3.5 text-gray-500 w-5 h-5 cursor-pointer"
                onClick={() => setSP(true)}
              />
            )}
          </div>
        
          {passwordError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs pl-1"
            >
              {passwordError}
            </motion.p>
          )}
        </div>

    
        {(() => {
          const formValidation = email !== "" && password !== "";
          return (
            <button
              disabled={!formValidation || loading}
              className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2
                ${formValidation
                  ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              onClick={handleLogin}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
            </button>
          );
        })()}

        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200"></span>
          OR
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        <div
          className="w-full flex items-center justify-center border py-3 rounded-xl gap-3 border-gray-300 hover:bg-gray-200 cursor-pointer transition-all duration-200"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Image src={googleImg} height={20} width={20} alt="google" />
          Continue with Google
        </div>
      </motion.form>

      <p className="flex mt-6 gap-2 justify-center items-center text-gray-500 hover:text-gray-800 cursor-pointer">
        Wanna Create New Account <LogIn className="h-4 w-4" /> :{" "}
        <span className="text-green-700" onClick={() => router.push("/register")}>Sign Up</span>
      </p>
    </div>
  );
}

export default Login;