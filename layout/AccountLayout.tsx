// components/layout/AccountLayout.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import useSelector from "@hooks/use-selector";
import Link from "next/link";
import { FaUser, FaShoppingBag } from "react-icons/fa";
import { generateFallbackAvatar } from "@utils/helpers";
import AccountSidebar from "./components/slider/AccountSidebar";

const HomeLayoutNoSSR = dynamic(() => import("@layout/HomeLayout"), {
  ssr: false,
});

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
  const userData = useSelector((state) => state.user);

  return (
    <HomeLayoutNoSSR
      content={
        <div className="container account-page">
          <div className="flex h-fit ">
            <AccountSidebar />
            <div className="flex-1 px-8">
              {children}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default AccountLayout;