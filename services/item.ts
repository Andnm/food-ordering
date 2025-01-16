import { BaseItemState, CreateItemState, ItemIdState } from "@models/item";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createItem = async (
  token: string,
  model: CreateItemState
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.item.createItem}`,
    token: token,
    data: model,
  });
  return response.data;
};

const getListItems = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.item.getListItems}`,
    token: token,
  });
  return response.data;
};

const getItemInfo = async (token: string, model: ItemIdState): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.item.getListItems}`,
    token: token,
    data: model,
  });
  return response.data;
};

const deleteItem = async (token: string, model: ItemIdState): Promise<any> => {
  const response = await httpClient.delete({
    url: `${apiLinks.item.deleteItem}`,
    token: token,
    data: model,
  });
  return response.data;
};

const updateItem = async (
  token: string,
  model: BaseItemState
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.item.updateItem}`,
    token: token,
    data: model,
  });
  return response.data;
};

const item = { createItem, updateItem, getListItems, getItemInfo, deleteItem };

export default item;
