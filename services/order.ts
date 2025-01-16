import {
  CancelOrderState,
  CreateOrderState,
  OrderBaseState,
  OrderIdState,
} from "@models/order";
import { UserIdState } from "@models/user";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createOrder = async (
  token: string,
  model: CreateOrderState
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.order.createNewOrder}`,
    token: token,
    data: model,
  });
  return response.data;
};

const getListOrderByUser = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.order.getListOrderByUser}`,
    token: token,
  });
  return response.data;
};

const getListOrderByAdmin = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.order.getListOrderByAdmin}`,
    token: token,
  });
  return response.data;
};

const getOrderInfo = async (
  token: string,
  order_id: number
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.order.getOrderInfo}/${order_id}`,
    token: token,
  });
  return response.data;
};

const updateDeliveryStatus = async (
  token: string,
  model: OrderIdState
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.order.updateDeliveryStatus}`,
    token: token,
    data: model,
  });
  return response.data;
};

const updateReceiveStatus = async (
  token: string,
  model: OrderIdState
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.order.updateReceiveStatus}`,
    token: token,
    data: model,
  });
  return response.data;
};

const updateCancelStatus = async (
  token: string,
  model: CancelOrderState
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.order.updateCancelStatus}`,
    token: token,
    data: model,
  });
  return response.data;
};

const order = {
  createOrder,
  getListOrderByUser,
  getListOrderByAdmin,
  getOrderInfo,
  updateDeliveryStatus,
  updateReceiveStatus,
  updateCancelStatus,
};

export default order;
