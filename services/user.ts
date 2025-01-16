import {
  ChangePasswordState,
  ForgotPasswordState,
  RegisterUserState,
  UpdateUserState,
} from "@models/user";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getUserProfile = async (token: string): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.user.getInfo}`,
    token: token,
  });
  return response.data;
};

const updateUserProfile = async (
  token: string,
  model: UpdateUserState
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.user.updateInfo}`,
    token: token,
    data: model,
  });
  return response.data;
};

const loginWithUsername = async (
  username: string,
  password: string
): Promise<any> => {
  const response = await httpClient.post({
    url: apiLinks.user.loginWithUsername,
    data: {
      username: username,
      password: password,
    },
  });
  return response.data;
};

const register = async (model: RegisterUserState): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.user.register}`,
    data: model,
  });
  return response.data;
};

const forgotPassword = async (model: ForgotPasswordState): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.user.forgotPassword}`,
    data: model,
  });
  return response.data;
};

const changePassword = async (
  token: string,
  model: ChangePasswordState
): Promise<any> => {
  const response = await httpClient.post({
    url: `${apiLinks.user.changePassword}`,
    token: token,
    data: model,
  });
  return response.data;
};

const getAllUsersByAdmin = async (
  token: string
): Promise<any> => {
  const response = await httpClient.get({
    url: `${apiLinks.user.getAllUsersByAdmin}`,
    token: token,
  });
  return response.data;
};

const user = {
  getUserProfile,
  loginWithUsername,
  register,
  updateUserProfile,
  forgotPassword,
  changePassword,
  getAllUsersByAdmin
};

export default user;
