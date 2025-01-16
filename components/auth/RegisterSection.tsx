"use client";

import { RegisterUserState } from "@models/user";
import user from "@services/user";
import { toastError } from "@utils/global";
import { message } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsTelephone } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { GrSecure } from "react-icons/gr";
import { IoPerson, IoPersonOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";

interface Props {}

const RegisterSection: React.FC<Props> = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleRegister = async () => {
    setError("");

    if (
      !username ||
      !password ||
      !name ||
      !confirmPassword ||
      !email ||
      !phone
    ) {
      setError(
        "Please fill out your full name, email, phone, username, password and confirm password!"
      );
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address!");
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit phone number!");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (!isChecked) {
      setError("Please agree to the terms and policies before registering!");
      return;
    }

    try {
      setIsLoading(true);

      const data: RegisterUserState = {
        address: "",
        avatar_url: "",
        email: email,
        name: name,
        password: password,
        phone: phone,
        role_id: 1,
        username: username,
      };

      const responseRegis = await user.register(data);

      message.success("Account created successfully!");

      const responseLogin = await signIn("credentials", {
        redirect: false,
        username: username,
        password: password,
      });

      if (!responseLogin?.error) {
        message.success("Login successfully!", 1.5);
        return router.push("/account");
      }
    } catch (err: any) {
      console.error("Error creating account:", err);
      toastError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container login-section">
      <div className="left">
        <img src="/images/signup-img.png" alt={"signup-img"} loading="lazy" />
      </div>

      <div className="right">
        <div className="content">
          <h1 className="font-semibold text-center">Create New Account</h1>
          <p className="text-center font-medium mt-2">
            Create an account now to join Food Ordering
          </p>
          <div
            className="mt-7 btn-login-gg flex items-center justify-center gap-2"
            onClick={() => {}}
          >
            <FcGoogle />{" "}
            <span className="font-medium">Register with Google</span>
          </div>

          <div className="line-text font-medium my-7">Or</div>

          <div className="input-field relative">
            <input
              type="text"
              required
              placeholder="Enter your full name"
              className="font-semibold text-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <IoPerson className="absolute left-3 w-6 h-6 opacity-30" />
          </div>

          <div className="input-field relative mt-6">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="font-semibold text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MdOutlineMail className="absolute left-3 w-6 h-6 opacity-30" />
          </div>

          <div className="input-field relative mt-6">
            <input
              type="tel"
              required
              placeholder="Enter your phone number"
              className="font-semibold text-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <BsTelephone className="absolute left-3 w-6 h-6 opacity-30" />
          </div>

          <div className="input-field relative mt-6">
            <input
              type="text"
              required
              placeholder="Enter your username"
              className="font-semibold text-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <IoPersonOutline className="absolute left-3 w-6 h-6 opacity-30" />
          </div>

          <div className="input-field relative mt-6">
            <input
              type="password"
              required
              placeholder="Enter your password"
              className="font-semibold text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <GrSecure className="absolute left-3 w-6 h-6 opacity-30" />
          </div>

          <div className="input-field relative mt-6">
            <input
              type="password"
              required
              placeholder="Confirm your password"
              className="font-semibold text-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <GrSecure className="absolute left-3 w-6 h-6 opacity-30" />
          </div>

          <div className="my-6 flex flex-row items-center justify-between">
            <div>
              <input
                type="checkbox"
                id="forgot-checkbox"
                className="cursor-pointer"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <label
                htmlFor="forgot-checkbox"
                className="cursor-pointer font-semibold ml-2"
              >
                I agree to the terms and policies
              </label>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-center mt-2 mb-2">{error}</p>
          )}

          <div
            className="btn-action-login-register text-center text-lg cursor-pointer"
            onClick={handleRegister}
          >
            {isLoading ? "Handling..." : "Register"}
          </div>
          <p className="text-center mt-6 text-register font-semibold">
            Already have an account?{" "}
            <span onClick={() => router.push("/login")} className="font-normal">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSection;
