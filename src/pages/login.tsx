"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import LoginSection from "@components/auth/LoginSection";

const HomeLayoutNoSSR = dynamic(() => import("@layout/HomeLayout"), {
  ssr: false,
});

const LoginPage = () => {
  return (
    <HomeLayoutNoSSR
      content={
        <div className="authen-page">
          <LoginSection  />
        </div>
      }
    />
  );
};

export default LoginPage;
