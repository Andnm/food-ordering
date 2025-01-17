"use client";

import { OrderState } from "@models/order";
import SearchFilterHeader from "@components/manager/SearchFilterHeader";
import order from "@services/order";
import { formatCurrencyToVND, formatDateTimeVN } from "@utils/helpers";
import {
  Spin,
  Table,
  Button,
  Menu,
  Dropdown,
  TableProps,
  Modal,
  message,
  Avatar,
} from "antd";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { BiDetail } from "react-icons/bi";
import { IoIosMore } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { toastError } from "@utils/global";

const ManagerLayoutNoSSR = dynamic(() => import("@layout/ManagerLayout"), {
  ssr: false,
});

const ORDER_STATUS_LABELS = {
  0: { text: "Canceled", color: "#ff4d4f", bg: "#fff1f0" },
  1: { text: "Pending", color: "#faad14", bg: "#fffbe6" },
  2: { text: "Ready", color: "#1890ff", bg: "#e6f7ff" },
  3: { text: "Received", color: "#52c41a", bg: "#f6ffed" },
};

const OrderManagement = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<OrderState[]>([]);
  const [processingData, setProcessingData] = useState<OrderState[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const details = await order.getOrderInfo(session?.user.token!, orderId);
      setSelectedOrder(details);
      setIsDetailModalVisible(true);
    } catch (error) {
      toast.error("Failed to fetch order details");
      console.error(error);
    }
  };

  const handleUpdateDeliveryStatus = async (orderId: number) => {
    try {
      setIsLoading(true);
      const responseUpdateDelivery = await order.updateDeliveryStatus(
        session?.user.token!,
        {
          order_id: orderId,
        }
      );

      const updatedData = processingData.map((orderItem) =>
        orderItem.order_id === orderId ? { ...orderItem, status: 2 } : orderItem
      );

      setOriginalData(updatedData);
      setProcessingData(updatedData);

      toast.success("Order status updated successfully");
    } catch (error) {
      console.log("error update status: ", error);
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      render: (id: number) => <span>#{id}</span>,
    },
    {
      title: "Date",
      dataIndex: "order_date",
      key: "order_date",
      render: (date: string) => <span>{formatDateTimeVN(date)}</span>,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: any) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={user.avatar_url}
            alt={user.name}
            style={{ marginRight: "8px", border: "1px solid #d9d9d9" }}
            size={55}
          />
          <div>
            <div className="text-base">{user.name}</div>
            <div className="opacity-70">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
      render: (total: string) => <span>{formatCurrencyToVND(total)} đ</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <span
          style={{
            color: ORDER_STATUS_LABELS[status].color,
            backgroundColor: ORDER_STATUS_LABELS[status].bg,
            padding: "4px 8px",
            borderRadius: "12px",
          }}
        >
          {ORDER_STATUS_LABELS[status].text}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text: string, record: OrderState) => {
        const menu = (
          <Menu>
            <Menu.Item key="view">
              <Button
                type="link"
                onClick={() => fetchOrderDetails(record.order_id)}
                icon={<BiDetail style={{ fontSize: "20px" }} />}
                style={{ color: "black" }}
                className="flex items-center"
              >
                Detail
              </Button>
            </Menu.Item>
            {record.status === 1 && ( // Only show for Pending status
              <Menu.Item key="ready">
                <Button
                  type="link"
                  onClick={() => handleUpdateDeliveryStatus(record.order_id)}
                  icon={<TbTruckDelivery style={{ fontSize: "20px" }} />}
                  style={{ color: "black" }}
                  className="flex items-center"
                >
                  Ready to Delivery
                </Button>
              </Menu.Item>
            )}
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

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user.token) {
        setIsLoading(true);
        try {
          const response = await order.getListOrderByAdmin(session.user.token);
          setOriginalData(response);
          setProcessingData(response);
        } catch (error: any) {
          toastError(error);
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();
  }, [session?.user.token, router.asPath]);

  useEffect(() => {
    let updatedData = [...originalData];

    if (searchText) {
      updatedData = updatedData.filter((order) =>
        order.order_id.toString().includes(searchText)
      );
    }

    if (statusFilter) {
      updatedData = updatedData.filter(
        (order) => order.status.toString() === statusFilter
      );
    }

    setProcessingData(updatedData);
  }, [searchText, statusFilter, originalData]);

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter(undefined);
    setProcessingData(originalData);
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-500">Order ID:</p>
            <p className="font-medium">#{selectedOrder.order_id}</p>
          </div>
          <div>
            <p className="text-gray-500">Date:</p>
            <p className="font-medium">
              {formatDateTimeVN(selectedOrder.order_date)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Status:</p>
            <span
              className="px-2 py-1 rounded-full text-sm"
              style={{
                color: ORDER_STATUS_LABELS[selectedOrder.status].color,
                backgroundColor: ORDER_STATUS_LABELS[selectedOrder.status].bg,
              }}
            >
              {ORDER_STATUS_LABELS[selectedOrder.status].text}
            </span>
          </div>
          <div>
            <p className="text-gray-500">User ID:</p>
            <p className="font-medium">{selectedOrder.user_id}</p>
          </div>

          {selectedOrder.note && (
            <div className="border-t">
              <p className="text-gray-500">Note:</p>
              <p>{selectedOrder.note}</p>
            </div>
          )}
        </div>

        {selectedOrder.details && (
          <>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Order Items</h3>
              {selectedOrder.details.map((item: any) => (
                <div
                  key={item.item_id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.item_name}</p>
                      <p className="text-gray-500">
                        {formatCurrencyToVND(item.price)} đ x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-orange-500">
                    {formatCurrencyToVND(Number(item.price) * item.quantity)} đ
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <div>
                <p className="text-lg">Total Amount:</p>
                <p className="text-xl font-bold text-orange-500 text-end">
                  {formatCurrencyToVND(selectedOrder.total)} đ
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <ManagerLayoutNoSSR
      content={
        <div>
          <div className="header-order">
            <SearchFilterHeader
              searchPlaceholder="Search by Order ID"
              searchValue={searchText}
              onSearchChange={setSearchText}
              haveFilter={true}
              filters={[
                {
                  label: "Status",
                  options: [
                    { label: "Canceled", value: "0" },
                    { label: "Pending", value: "1" },
                    { label: "Ready", value: "2" },
                    { label: "Received", value: "3" },
                  ],
                  value: statusFilter,
                  onChange: setStatusFilter,
                },
              ]}
              handleClearFilters={handleClearFilters}
            />
          </div>

          <div className="mt-8">
            <Spin spinning={isLoading}>
              <Table
                columns={columns}
                dataSource={processingData}
                rowKey={(record) => record.order_id}
                pagination={{ pageSize: 10 }}
              />
            </Spin>
          </div>

          <Modal
            title="Order Details"
            open={isDetailModalVisible}
            onCancel={() => {
              setIsDetailModalVisible(false);
              setSelectedOrder(null);
            }}
            footer={null}
            width={800}
          >
            {renderOrderDetails()}
          </Modal>
        </div>
      }
    />
  );
};

export default OrderManagement;
