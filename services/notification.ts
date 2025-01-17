import { CreateNotiState, UpdateNotiState } from "@models/notification";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createNotification = async (
  token: string,
  model: CreateNotiState
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.notification.createNotification}`,
    token: token,
    data: model,
  });
  return response.data;
};

const getAllNotifications = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.notification.getAllNotifications}`,
    token: token,
  });
  return response.data;
};

const markAllAsSeen = async (token: string): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.notification.markAllAsSeen}`,
    token: token,
  });
  return response.data;
};

const markSeenOne = async (
  noti_id: number,
  model: UpdateNotiState
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.notification.markSeenOne}/${noti_id}`,
    data: model,
  });
  return response.data;
};

const notification = {
  createNotification,
  getAllNotifications,
  markAllAsSeen,
  markSeenOne,
};

export default notification;
