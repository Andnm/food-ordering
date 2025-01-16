"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import RegisterSection from "@components/auth/RegisterSection";

const HomeLayoutNoSSR = dynamic(() => import("@layout/HomeLayout"), {
  ssr: false,
});

const RegisterPage = () => {

  return (
    <HomeLayoutNoSSR
      content={
        <div className="authen-page">
            <RegisterSection  />
        </div>
      }
    />
  );
};

export default RegisterPage;