import useDispatch from "@hooks/use-dispatch";
import { NotificationState, UpdateNotiState } from "@models/notification";
import notification from "@services/notification";
import { setSliderMenuItemSelectedKey } from "@slices/global";
import { NotificationEnum, ROLE_ADMIN } from "@utils/constants";
import { toastError } from "@utils/global";
import { formatDateTimeVN } from "@utils/helpers";
import { Avatar, Badge, Space } from "antd";
import moment from "moment";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FaDotCircle } from "react-icons/fa";
import {
  IoIosLogOut,
  IoIosNotificationsOutline,
  IoMdNotifications,
} from "react-icons/io";
import { IoCheckmarkDone, IoPersonCircleOutline } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

const HeaderManagePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const notificationRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const [newNotifyCount, setNewNotifyCount] = useState<number>(0);

  useEffect(() => {
    if (session?.user) {
      document.title = `Food Ordering | Admin`;
    } else {
      document.title = "Food Ordering";
    }
  }, [session?.user]);

  const seenAllNotifications = async () => {
    if (session) {
      try {
        await notification.markAllAsSeen(session?.user?.token);

        setNotifications((prevNotifications) =>
          prevNotifications.map((noti) => ({
            ...noti,
            is_new: false,
          }))
        );

        setNewNotifyCount(0);
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
        toastError("Failed to mark all as read");
      }
    }
  };

  const seenNotification = async (noti: NotificationState) => {
    if (session?.user.token) {
      try {
        const updatedData: UpdateNotiState = {
          is_new: false,
          noti_title: noti.noti_title,
          noti_type: noti.noti_type,
          noti_describe: noti.noti_describe,
        };

        const responseGetNotifications = await notification.markSeenOne(
          noti.noti_id,
          updatedData
        );

        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => {
            if (notification.noti_id === noti.noti_id) {
              return {
                ...notification,
                is_new: false,
              };
            }
            return notification;
          })
        );

        setNewNotifyCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      } catch (error: any) {
        toastError(error);
        console.error("Có lỗi:", error);
      } finally {
      }
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session?.user?.token) {
        try {
          const responseGetNotifications =
            await notification.getAllNotifications(session?.user.token);

          const adminNotifications = responseGetNotifications
            .filter((noti) => noti.noti_type === NotificationEnum.TO_ADMIN)
            .reverse();

          setNotifications(adminNotifications);
          setNewNotifyCount(
            adminNotifications.filter((noti) => noti.is_new).length
          );
        } catch (error: any) {
          toastError(error);
          console.error("Có lỗi khi tải dữ liệu noti:", error);
        } finally {
        }
      }
    };

    fetchNotifications();
  }, [session?.user.token, router.asPath]);

  useEffect(() => {
    if (pathname) {
      const cleanPath = pathname.replace(/^\//, "");

      dispatch(setSliderMenuItemSelectedKey(cleanPath));
    }
  }, [pathname, dispatch]);

  const handleNotificationClick = async (noti: NotificationState) => {
    await seenNotification(noti);

    switch (noti.noti_type) {
      case NotificationEnum.TO_ADMIN:
        router.push("/admin/manage-order");
        break;

      default:
        break;
    }
  };

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
              router.push("/admin/manage-user");
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
                  <div
                    className="absolute top-2 right-3"
                    onClick={seenAllNotifications}
                  >
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
                        onClick={() => {
                          handleNotificationClick(noti);
                        }}
                      >
                        <div className="w-full pl-2">
                          <div className="text-gray-500 text-sm mb-1.5">
                            <span className="font-semibold text-gray-900">
                              {`${noti?.noti_title?.replace(/_/g, " ")} `}
                            </span>
                          </div>
                          <div className="text-gray-500 text-sm mb-1.5">
                            <span className="text-gray-900">{`${noti.noti_describe} `}</span>
                          </div>
                          <div
                            className={`text-xs ${
                              !noti.is_new ? "text-gray-600" : "text-blue-600"
                            } `}
                          >
                            {formatDateTimeVN(noti.created_at)}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-5 h-5 bg-white-600 border border-white rounded-full">
                            <FaDotCircle
                              onClick={() => {
                                noti.is_new && seenNotification(noti);
                              }}
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
