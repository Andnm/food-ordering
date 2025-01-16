"use client";

import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, registerables } from "chart.js";


ChartJS.register(...registerables);

const ManagerLayoutNoSSR = dynamic(() => import("@layout/ManagerLayout"), {
  ssr: false,
});

const Dashboard = () => {
  const { data: token } = useSession();

  return (
    <ManagerLayoutNoSSR
      content={
        <div className="dashboard">
        
        </div>
      }
    />
  );
};

export default Dashboard;
