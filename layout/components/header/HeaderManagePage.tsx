import useDispatch from "@hooks/use-dispatch";
import { setSliderMenuItemSelectedKey } from "@slices/global";
import { ROLE_ADMIN } from "@utils/constants";
import { toastError } from "@utils/global";
import { Avatar, Badge, Space } from "antd";
import moment from "moment";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaDotCircle } from "react-icons/fa";
import {
  IoIosLogOut,
  IoIosNotificationsOutline,
  IoMdNotifications,
} from "react-icons/io";
import { IoCheckmarkDone, IoPersonCircleOutline } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";

const HeaderManagePage = () => {
  const route = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const notificationRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any>([]);
  const [newNotifyCount, setNewNotifyCount] = useState<number>(0);

  useEffect(() => {
    if (session?.user?.roles) {
      document.title = `Food Ordering | Admin`;
    } else {
      document.title = "Food Ordering";
    }
  }, [session?.user?.roles]);

  useEffect(() => {
    if (pathname) {
      const cleanPath = pathname.replace(/^\//, "");

      dispatch(setSliderMenuItemSelectedKey(cleanPath));
    }
  }, [pathname, dispatch]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       notificationRef.current &&
  //       !notificationRef.current.contains(event.target as Node)
  //     ) {
  //       setShowNotification(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return (
    <div
      className="header-manage-page"
      style={{ borderBottom: "1px solid black" }}
    >
      <div className="flex justify-between flex-row mx-5 my-3">
        <div className="left flex justify-between flex-row items-center gap-4">
          <Image
            src="/images/logo.png"
            width={150}
            height={80}
            alt="logo"
            loading="lazy"
            onClick={() => {
              route.push("/admin/user");
            }}
            className="cursor-pointer"
          />
          <div className="break-line"></div>
          <p className="role-name font-bold text-lg ml-5">My Admin</p>
        </div>

        <div className="right flex justify-between flex-row items-center gap-2">
          <Space
            className="m-2 hover:cursor-pointer relative"
            onClick={() => {
              setShowNotification(!showNotification);
            }}
          >
            <Badge count={newNotifyCount}>
              <Avatar
                className="bg-white hover:bg-[#e3eced]/50 flex justify-center items-center"
                style={{ borderColor: "#ffa412" }}
                shape="circle"
                icon={
                  <IoIosNotificationsOutline
                    style={{ color: "#ffa412" }}
                    className="w-6 h-6"
                  />
                }
              />
            </Badge>
          </Space>

          <>
            {showNotification && (
              <div
                ref={notificationRef}
                className=" top-[80px] right-28 z-20 absolute w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow"
                aria-labelledby="dropdownNotificationButton"
              >
                <div className="block px-4 py-2 relative font-medium text-center text-[#01a0e9] rounded-t-lg bg-gray-50">
                  Notifications
                  <div className="absolute top-2 right-3" onClick={() => {}}>
                    <IoCheckmarkDone className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>
                <InfiniteScroll
                  dataLength={notifications?.length!}
                  next={() => {}}
                  height={"36rem"}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  // hasMore={Boolean(pageIndexNoti < totalPageNoti)}
                  hasMore={false}
                  loader={<h4>Loading...</h4>}
                  scrollableTarget="scrollableDiv"
                >
                  <div className="divide-y divide-gray-100">
                    {notifications?.map((noti, index) => (
                      <div
                        key={index}
                        className={`h-fit flex px-4 py-3 hover:bg-gray-100 hover:cursor-pointer
                  ${noti.is_new && "bg-blue-100"} `}
                        onClick={() => {}}
                      >
                        <div className="w-full pl-2">
                          <div className="text-gray-500 text-sm mb-1.5">
                            <span className="font-semibold text-gray-900">
                              {`${noti?.notification_type?.replace(
                                /_/g,
                                " "
                              )} `}
                            </span>
                          </div>
                          <div className="text-gray-500 text-sm mb-1.5">
                            <span className="text-gray-900">{`${noti.information} `}</span>
                          </div>
                          <div
                            className={`text-xs ${
                              !noti.is_new ? "text-gray-600" : "text-blue-600"
                            } `}
                          >
                            {moment(noti.createdAt).hour() > 1
                              ? moment(noti.createdAt).fromNow()
                              : moment(noti.createdAt)
                                  .locale("en")
                                  .format("MMM DD HH:mm")}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-5 h-5 bg-white-600 border border-white rounded-full">
                            <FaDotCircle
                              onClick={
                                () => {}
                                // !noti.is_new && seenNotification(noti.id!)
                              }
                              color={` ${!noti.is_new ? "gray" : "#01a0e9"}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </InfiniteScroll>
              </div>
            )}
          </>

          <div
            className="btn-logout font-semibold flex justify-between flex-row items-center gap-2"
            onClick={() => {
              signOut({
                callbackUrl: `${process.env.NEXT_PUBLIC_CALLBACK_URL}`,
              });
            }}
          >
            <IoIosLogOut className="icon font-semibold" />
            Logout
          </div>

          <div className="profile flex justify-between flex-row items-center">
            <div className="name text-center font-semibold text-base">
              {session?.user.name}
            </div>
            <div className="icon-person flex justify-center items-center">
              <IoPersonCircleOutline className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderManagePage;
