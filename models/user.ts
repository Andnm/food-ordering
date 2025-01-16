import { Base, PagingModel } from "./base";

export interface LoginResponse {
  access_token: string;
  tokenType: string;
  userId: string;
  expiresIn: number;
  userName: string;
  email: string;
  phoneNumber?: string;
  currenNoticeCount: number;
  roles: string[];
}

export interface User extends Base {
  id: string;
  phone?: string;
  userName?: string;
  fullname?: string;
  email?: string;
  address?: string;
  roles?: string[];
  role?: string;
  name: string;
  avatar_url?: string;
  isActive?: boolean;
}

export interface RegisterUserState {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar_url: string;
  role_id: number;
  password: string;
  username: string;
}

export interface UpdateUserState {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar_url: string;
}

export interface ForgotPasswordState {
  email: string;
}

export interface ChangePasswordState {
  old_password: string;
  new_password: string;
}

export interface UserIdState {
  user_id: number;
}

export interface UserState {
  user_id: number | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar_url: string;
  role_id: number | null;
}

