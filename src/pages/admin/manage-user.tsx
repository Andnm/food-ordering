"use client";

import { UserState } from "@models/user";
import SearchFilterHeader from "@components/manager/SearchFilterHeader";
import user from "@services/user";
import { generateFallbackAvatar } from "@utils/helpers";
import { Spin, Table, Button, Avatar, Menu, Dropdown, TableProps } from "antd";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { BiDetail } from "react-icons/bi";
import { IoIosMore } from "react-icons/io";
import { toast } from "react-toastify";

import { handleActionNotSupport } from "@utils/global";
import { useRouter } from "next/router";

const ManagerLayoutNoSSR = dynamic(() => import("@layout/ManagerLayout"), {
  ssr: false,
});

const columns: TableProps<any>["columns"] = [
  {
    title: "User",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: UserState) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={record.avatar_url || generateFallbackAvatar(record.name)}
          alt={record.name}
          style={{ marginRight: "8px", border: "1px solid #d9d9d9" }}
          size={55}
        />
        <div>
          <div className="text-base">{record.name}</div>
          <div className="opacity-70">{record.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: "Phone number",
    dataIndex: "phone",
    key: "phone",
    render: (phone: string | undefined) =>
      phone ? phone : <i className="text-xs opacity-70">(Chưa cập nhật)</i>,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (address: string | undefined) =>
      address ? address : <i className="text-xs opacity-70">(Chưa cập nhật)</i>,
  },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    render: (text: string, record: UserState) => {
      const menu = (
        <Menu>
          <Menu.Item key="view">
            <Button
              type="link"
              onClick={() => {
                handleActionNotSupport();
              }}
              icon={<BiDetail style={{ fontSize: "20px" }} />}
              style={{ color: "black" }}
              className="flex items-center"
            >
              Detail
            </Button>
          </Menu.Item>
        </Menu>
      );

      return (
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            type="link"
            icon={<IoIosMore style={{ fontSize: "24px" }} />}
          />
        </Dropdown>
      );
    },
  },
];

const User = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<UserState[]>([]);
  const [processingData, setProcessingData] = useState<UserState[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchCustomers = async () => {
      if (session?.user.token) {
        setIsLoading(true);
        try {
          const responseGetAllCustomer = await user.getAllUsersByAdmin(
            session.user.token
          );

          setOriginalData(responseGetAllCustomer);
          setProcessingData(responseGetAllCustomer);
        } catch (error: any) {
          toast.error("There was an error loading data!");
          toast.error(error!.response?.data?.message);
          console.error("There was an error loading data!:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCustomers();
  }, [router.asPath, session?.user.token]);

  useEffect(() => {
    let updatedData = [...originalData];

    if (searchText) {
      updatedData = updatedData.filter((user: UserState) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setProcessingData(updatedData);
  }, [searchText, statusFilter, originalData]);

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter(undefined);
    setProcessingData(originalData);
  };

  return (
    <ManagerLayoutNoSSR
      content={
        <div>
          <div className="header-order">
            <SearchFilterHeader
              searchPlaceholder="Tìm kiếm người dùng"
              searchValue={searchText}
              onSearchChange={setSearchText}
              haveFilter={false}
              handleClearFilters={handleClearFilters}
            />
          </div>
          <div className="mt-8">
            <Spin spinning={isLoading}>
              <Table
                columns={columns}
                dataSource={processingData}
                rowKey={(record) => record._id}
                pagination={{ pageSize: 10 }}
              />
            </Spin>
          </div>
        </div>
      }
    />
  );
};

export default User;
