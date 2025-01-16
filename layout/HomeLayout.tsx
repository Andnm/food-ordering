"use client";
import React, { ReactNode } from "react";
import { Layout, theme } from "antd";
import HeaderHomePage from "./components/header/HeaderHomePage";
import FooterHomePage from "./components/footer/FooterHomePage";

const { Content } = Layout;

interface Props {
  content: ReactNode;
}

const HomeLayout: React.FC<Props> = (props) => {
  const { content } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div className="h-auto background-main">
      <HeaderHomePage />
      {content}
      <FooterHomePage />
    </div>
  );
};

export default HomeLayout;
