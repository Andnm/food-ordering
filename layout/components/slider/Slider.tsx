"use client";
import React, { useEffect, useMemo } from "react";
import { Layout, Menu, theme } from "antd";
import useSelector from "@hooks/use-selector";
import { sliderMenu } from "@utils/global";
import useDispatch from "@hooks/use-dispatch";
import { setSliderMenuItemSelectedKey } from "@slices/global";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { filterMenuByRole } from "@utils/helpers";

const { Sider } = Layout;
const SliderComponent: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { collapsed, sliderMenuItemSelectedKey } = useSelector(
    (state) => state.global
  );
  const { data: session } = useSession();

  const filteredMenu = useMemo(
    () => filterMenuByRole(sliderMenu, session?.user?.role_id),
    [session]
  );

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={245}
      style={{
        background: colorBgContainer,
        marginTop: 10,
      }}
      className="slider-container"
    >
     <div className="demo-logo-vertical text-center uppercase text-2xl font-bold">
        General
      </div>
      <Menu
        mode="inline"
        selectedKeys={[sliderMenuItemSelectedKey]}
        items={filteredMenu}
        onClick={async (info) => {
          dispatch(setSliderMenuItemSelectedKey(info.key));
          router.push(`/${info.key}`);
        }}
         className="my-10"
      />
    </Sider>
  );
};

export default SliderComponent;
