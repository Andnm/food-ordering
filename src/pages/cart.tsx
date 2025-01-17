"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Card, Button, InputNumber, Empty, message, Input } from "antd";
import { DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@slices/cart";
import { formatCurrencyToVND } from "@utils/helpers";
import { useSession } from "next-auth/react";
import order from "@services/order";
import { CreateOrderState, OrderDetail } from "@models/order";
import useSelector from "@hooks/use-selector";
import useDispatch from "@hooks/use-dispatch";
import { toast } from "react-toastify";
import payment from "@services/payment";
import { CreatePaymentState } from "@models/payment";
import { toastError } from "@utils/global";
import notification from "@services/notification";
import { CreateNotiState } from "@models/notification";
import { NotificationEnum } from "@utils/constants";

const HomeLayoutNoSSR = dynamic(() => import("@layout/HomeLayout"), {
  ssr: false,
});

const CartPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const userData = useSelector((state) => state.user);

  const total = useSelector(selectCartTotal);
  const { data: session } = useSession();

  const [note, setNote] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (id: number, value: number) => {
    if (value > 0) {
      dispatch(updateQuantity({ id, quantity: value }));
    }
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);

      const orderDetails: OrderDetail[] = cartItems.map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
      }));

      const orderData: CreateOrderState = {
        user_id: userData?.user_id!,
        status: 1,
        note: note,
        details: orderDetails,
      };

      if (session?.user?.token) {
        localStorage.setItem("token", session.user.token);
      }

      const data: CreatePaymentState = {
        total: total,
        user_id: orderData.user_id,
        note: orderData.note,
        details: orderData.details,
      };

      const responseCreate = await payment.createPaymentLink(session?.user?.token!, data);

      if (responseCreate?.checkoutUrl) {
        router.push(responseCreate.checkoutUrl);
      }
      
      // await order.createOrder(session?.user?.token!, orderData);

      dispatch(clearCart());

      toast.success("Order created successfully!");
      // router.push("/account/orders");
    } catch (error: any) {
      toastError(error);
      console.error("Checkout error:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const renderHeader = () => (
    <div className="grid grid-cols-12 gap-4 mb-4 px-6 py-3 bg-gray-50 rounded-lg font-semibold text-gray-700">
      <div className="col-span-5">Item</div>
      <div className="col-span-2 text-center">Unit Price</div>
      <div className="col-span-2 text-center">Quantity</div>
      <div className="col-span-2 text-center">Amount</div>
      <div className="col-span-1 text-center">Action</div>
    </div>
  );

  const renderCartItem = (item: any) => (
    <Card key={item.item_id} className="shadow-sm mb-4">
      <div className="grid grid-cols-12 gap-4 items-center">
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
          <p className="text-gray-600 font-medium">
            {formatCurrencyToVND(item.price)} đ
          </p>
        </div>

        <div className="col-span-2 text-center">
          <InputNumber
            min={1}
            value={item.quantity}
            onChange={(value) =>
              handleQuantityChange(item.item_id!, value || 1)
            }
            className="w-20"
          />
        </div>

        <div className="col-span-2 text-center">
          <p className="text-orange-500 font-bold">
            {formatCurrencyToVND(Number(item.price) * item.quantity)} đ
          </p>
        </div>

        <div className="col-span-1 text-center">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined className="text-xl" />}
            onClick={() => handleRemoveItem(item.item_id!)}
          />
        </div>
      </div>
    </Card>
  );

  return (
    <HomeLayoutNoSSR
      content={
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <Empty description="Your cart is empty" />
          ) : (
            <div>
              {renderHeader()}
              <div className="mb-20">{cartItems.map(renderCartItem)}</div>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="container fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t">
              <div className="flex flex-row justify-between gap-4 px-10">
                <div className="flex items-center gap-3">
                  <FileTextOutlined className="text-xl text-gray-500" />
                  <Input.TextArea
                    placeholder="Note something here..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    autoSize={{ minRows: 1, maxRows: 2 }}
                    className="flex-1 w-96"
                    style={{ resize: "none" }}
                  />
                </div>

                <div className="flex justify-end items-center gap-10">
                  <div>
                    <p className="text-lg text-gray-600">Total:</p>
                    <p className="text-2xl font-bold text-orange-500">
                      {formatCurrencyToVND(total)} đ
                    </p>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    className="bg-red-500 hover:bg-red-600"
                    onClick={handleCheckout}
                    loading={isCheckingOut}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? "Processing..." : "Checkout"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};

export default CartPage;
