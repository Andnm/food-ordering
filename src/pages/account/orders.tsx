import AccountLayout from "@layout/AccountLayout";
import React, { useEffect, useState } from "react";
import { Tabs, Card, Empty, Spin, Button } from "antd";
import order from "@services/order";
import { useSession } from "next-auth/react";
import useSelector from "@hooks/use-selector";
import { formatCurrencyToVND, formatDateTimeVN } from "@utils/helpers";
import { toastError } from "@utils/global";
import { OrderInfo } from "@models/order";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { CreateNotiState } from "@models/notification";
import { NotificationEnum } from "@utils/constants";
import notification from "@services/notification";

const { TabPane } = Tabs;

const ORDER_STATUS = {
  ALL: "all",
  CANCELED: "0",
  PENDING: "1",
  READY: "2",
  RECEIVED: "3",
};

const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.CANCELED]: "Canceled",
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.READY]: "Ready for Delivery",
  [ORDER_STATUS.RECEIVED]: "Received",
};

const OrderPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user?.token) {
      fetchOrders();
    }
  }, [session?.user?.token, router.asPath]);

  const fetchOrders = async () => {
    if (!session?.user?.token) return;

    try {
      setLoading(true);
      const ordersList = await order.getListOrderByUser(session?.user?.token);

      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status.toString() === activeTab;
  });

  const handleConfirmReceipt = async (orderId: number) => {
    try {
      setUpdatingOrderId(orderId);
      await order.updateReceiveStatus(session?.user?.token!, {
        order_id: orderId,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: 3 } : order
        )
      );

      toast.success("Order marked as received successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toastError(error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const renderOrder = (order: OrderInfo) => {
    return (
      <Card
        key={order.order_id}
        className="mb-6 shadow-sm"
        title={
          <div className="flex justify-between items-center">
            <span>Order #{order.order_id}</span>
            <div className="flex items-center gap-4">
              {order.status === 2 && (
                <Button
                  type="primary"
                  onClick={() => handleConfirmReceipt(order.order_id)}
                  loading={updatingOrderId === order.order_id}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Confirm receipt of items
                </Button>
              )}
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 0
                    ? "bg-red-100 text-red-600"
                    : order.status === 1
                    ? "bg-yellow-100 text-yellow-600"
                    : order.status === 2
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {ORDER_STATUS_LABELS[order.status.toString()]}
              </span>
              <span className="text-gray-500">
                {formatDateTimeVN(order.order_date)}
              </span>
            </div>
          </div>
        }
      >
        {order.details?.map((item) => (
          <div
            key={item.item_id}
            className="grid grid-cols-12 gap-4 items-center py-3 border-b"
          >
            <div className="col-span-5">
              <div className="flex items-center gap-4">
                <img
                  src={item.image_url}
                  alt={item.item_name}
                  className="w-20 h-20 object-cover rounded"
                />
                <h3 className="text-lg font-medium">{item.item_name}</h3>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <p className="text-gray-600">
                {formatCurrencyToVND(item.price)} đ
              </p>
            </div>
            <div className="col-span-2 text-center">
              <span>{item.quantity}</span>
            </div>
            <div className="col-span-3 text-center">
              <p className="text-orange-500 font-semibold">
                {formatCurrencyToVND(Number(item.price) * item.quantity)} đ
              </p>
            </div>
          </div>
        ))}

        <div className="mt-4 flex justify-between items-center">
          {order.note && (
            <div className="text-gray-500">
              <span className="font-medium">Note:</span> {order.note}
            </div>
          )}

          <div className="text-right">
            <span className="text-lg mr-2">Total Amount:</span>
            <span className="text-xl font-bold text-orange-500">
              {formatCurrencyToVND(order.total)} đ
            </span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <AccountLayout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-8">
          <TabPane tab="All Orders" key="all" />
          <TabPane tab="Pending" key="1" />
          <TabPane tab="Ready" key="2" />
          <TabPane tab="Received" key="3" />
          <TabPane tab="Canceled" key="0" />
        </Tabs>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div>{filteredOrders.map(renderOrder)}</div>
        ) : (
          <Empty description="No orders found" />
        )}
      </div>
    </AccountLayout>
  );
};

export default OrderPage;
