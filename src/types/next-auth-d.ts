import NextAuth, { DefaultSession } from "next-auth";
import { DataNode as AntdDataNode } from "antd/es/tree";

declare module "next-auth" {
  interface Session {
    expires: Date;
    user: {
      token: string;
      tokenType: string;
      userId: string;
      expiresIn: number;
      userName: string;
      currenNoticeCount: number;
      roles: string[];
      role_id: number;
    } & DefaultSession["user"];
  }

  interface DefaultUser {
    token: string;
    tokenType: string;
    userId: string;
    expiresIn: number;
    userName: string;
    loginDate: string;
    currenNoticeCount: number;
    roles: string[];
    role_id: number;
  }
}

declare module "next-auth/jwt" {
  interface DefaultJWT extends Record<string, unknown> {
    token: string;
    tokenType: string;
    userId: string;
    expiresIn: number;
    userName: string;
    loginDate: string;
    currenNoticeCount: number;
    roles: string[];
    role_id: number;
  }
}

export interface DataNode extends AntdDataNode {
  id?: string;
  title: string;
  key: string;
  name?: string;
  isLeaf?: boolean;
  parentId?: string;
  dateCreated?: string;
  dataUpdated?: string;
  children: DataNode[] | undefined;
  label?: string;
}
