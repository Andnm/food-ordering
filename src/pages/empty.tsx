"use client";
import React from "react";
import { Button, Empty } from "antd";
import { useRouter } from "next/router";

const EmptyPage: React.FC = () => {
  const router = useRouter();
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div></div>
      <Empty description={<span>No data</span>}>
        <Button onClick={() => router.push("/")} type="primary">
          Go Home
        </Button>
      </Empty>
    </div>
  );
};

export default EmptyPage;
