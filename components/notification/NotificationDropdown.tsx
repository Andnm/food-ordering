import React, { useEffect, useState } from "react";
import {
  Badge,
  Dropdown,
  List,
  Typography,
  Empty,
  Button,
  Space,
  message,
} from "antd";
import { BellOutlined } from "@ant-design/icons";
import {
  CreateNotiState,
  NotificationState,
  UpdateNotiState,
} from "@models/notification";
import notification from "@services/notification";
import { formatDateTimeVN } from "@utils/helpers";
import { useSession } from "next-auth/react";
import { toastError } from "@utils/global";
import { NotificationEnum } from "@utils/constants";
import { useRouter } from "next/router";

const { Text } = Typography;

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  const fetchNotifications = async () => {
    if (!session?.user?.token) return;

    try {
      setLoading(true);
      const response = await notification.getAllNotifications(
        session.user.token
      );

      const userNotifications = response
        .filter((noti) => noti.noti_type === NotificationEnum.TO_USER)
        .reverse();

      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter((noti) => noti.is_new).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      fetchNotifications();
    }
  }, [session?.user?.token, router.asPath]);

  const markAsRead = async (noti: NotificationState) => {
    if (!noti.is_new) return;

    try {
      const updatedData: UpdateNotiState = {
        is_new: false,
        noti_title: noti.noti_title,
        noti_type: noti.noti_type,
        noti_describe: noti.noti_describe,
      };

      await notification.markSeenOne(noti.noti_id, updatedData);

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

      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toastError("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    if (session) {
      try {
        await notification.markAllAsSeen(session?.user?.token);

        setNotifications((prevNotifications) =>
          prevNotifications.map((noti) => ({
            ...noti,
            is_new: false,
          }))
        );

        setUnreadCount(0);
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
        toastError("Failed to mark all as read");
      }
    }
  };

  const handleNotificationClick = async (noti: NotificationState) => {
    await markAsRead(noti);

    switch (noti.noti_type) {
      case NotificationEnum.TO_USER:
        router.push("/account/orders");
        break;

      default:
        break;
    }
  };

  const notificationList = (
    <div
      className="notification-dropdown bg-white"
      style={{ width: 350, maxHeight: 400, overflow: "auto" }}
    >
      {unreadCount > 0 && (
        <div className="p-2 border-b">
          <Button type="link" onClick={markAllAsRead} size="small">
            Mark all as read
          </Button>
        </div>
      )}

      <List
        loading={loading}
        locale={{ emptyText: <Empty description="No notifications" /> }}
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            className={`cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
              item.is_new ? "bg-blue-50" : ""
            }`}
            onClick={() => handleNotificationClick(item)}
          >
            <List.Item.Meta
              className="px-6"
              title={
                <Space>
                  {item.is_new ? <Badge status="processing" /> : <></>}
                  <Text strong>{item.noti_title}</Text>
                </Space>
              }
              description={
                <div>
                  <Text className="text-gray-600">{item.noti_describe}</Text>
                  <br />
                  <Text className="text-gray-400 text-xs">
                    {formatDateTimeVN(item.created_at)}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Dropdown
      overlay={notificationList}
      trigger={["click"]}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
    >
      <Badge count={unreadCount} size="small" className="mx-3">
        <BellOutlined
          className="text-2xl cursor-pointer hover:text-red-500"
          style={{ color: "#fbf4e2" }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
