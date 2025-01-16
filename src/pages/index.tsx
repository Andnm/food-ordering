"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Tabs, Card, Image, Spin, Empty, Modal } from "antd";
import { BaseItemState } from "@models/item";
import item from "@services/item";
import { formatCurrencyToVND } from "@utils/helpers";
import { toast } from "react-toastify";
import { CoffeeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import useDispatch from "@hooks/use-dispatch";
import { addToCart } from "@slices/cart";

const { TabPane } = Tabs;

const HomeLayoutNoSSR = dynamic(() => import("@layout/HomeLayout"), {
  ssr: false,
});

const HomePage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("all");
  const [items, setItems] = useState<BaseItemState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await item.getListItems("");
      if (!response || response.length === 0) {
        setError("No items available at the moment");
        setItems([]);
      } else {
        const availableItems = response.filter(
          (item) => item.availability === 1
        );
        setItems(availableItems);
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || "Error loading items");
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true;
    return item.category?.toLowerCase() === activeTab;
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-[400px] flex-col">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-gray-500 mb-4">{error}</p>
                <p className="text-gray-400">Please check back later!</p>
              </div>
            }
          />
        </div>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <div className="flex justify-center items-center min-h-[400px] flex-col">
          <Empty
            image={<CoffeeOutlined style={{ fontSize: 48 }} />}
            description={
              <div className="text-center">
                <p className="text-gray-500 mb-2">
                  No items found in this category
                </p>
                <p className="text-gray-400">
                  Try selecting a different category
                </p>
              </div>
            }
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.item_id}
            hoverable
            className="shadow-md"
            cover={
              <div className="h-48 overflow-hidden">
                <Image
                  alt={item.item_name}
                  src={item.image_url}
                  className="object-cover w-full h-full"
                  fallback="/placeholder-image.jpg"
                />
              </div>
            }
            actions={[
              <ShoppingCartOutlined
                key="cart"
                onClick={() => handleAddToCart(item)}
                className="text-xl hover:text-red-500"
                style={{ fontSize: "28px" }}
              />,
            ]}
          >
            <Card.Meta
              title={
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {item.item_name}
                  </span>
                  <span className="text-orange-500 font-bold">
                    {formatCurrencyToVND(item.price)} đ
                  </span>
                </div>
              }
              description={
                <div className="mt-2">
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Category: {item.category}
                  </p>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    );
  };

  const handleAddToCart = (item: BaseItemState) => {
    if (!session) {
      Modal.info({
        title: "Please login",
        content: "You need to login before adding items to cart",
        okText: "OK",
      });
      return;
    }
    dispatch(addToCart(item));
  };

  return (
    <HomeLayoutNoSSR
      content={
        <>
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-2xl shadow-md max-w-2xl mx-auto mb-8">
              <div
                className="p-4"
                style={
                  {
                    "--tab-bg": "#f5f5f5",
                    "--tab-active": "#ff4d4f",
                  } as React.CSSProperties
                }
              >
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  centered
                  className="custom-tabs"
                  style={{
                    background: "var(--tab-bg)",
                    borderRadius: "12px",
                    padding: "4px",
                  }}
                >
                  <TabPane
                    tab={
                      <span
                        className={`px-8 py-2 inline-block rounded-lg ${
                          activeTab === "all"
                            ? "bg-white text-red-500 shadow-sm font-semibold"
                            : "text-gray-600 hover:text-red-500"
                        }`}
                      >
                        All
                      </span>
                    }
                    key="all"
                  />
                  <TabPane
                    tab={
                      <span
                        className={`px-8 py-2 inline-block rounded-lg ${
                          activeTab === "food"
                            ? "bg-white text-red-500 shadow-sm font-semibold"
                            : "text-gray-600 hover:text-red-500"
                        }`}
                      >
                        Food
                      </span>
                    }
                    key="food"
                  />
                  <TabPane
                    tab={
                      <span
                        className={`px-8 py-2 inline-block rounded-lg ${
                          activeTab === "beverage"
                            ? "bg-white text-red-500 shadow-sm font-semibold"
                            : "text-gray-600 hover:text-red-500"
                        }`}
                      >
                        Beverage
                      </span>
                    }
                    key="beverage"
                  />
                </Tabs>
              </div>
            </div>

            <style jsx global>{`
              .custom-tabs .ant-tabs-nav::before {
                border: none !important;
              }
              .custom-tabs .ant-tabs-ink-bar {
                display: none;
              }
              .custom-tabs .ant-tabs-tab {
                margin: 0 4px !important;
                padding: 0 !important;
                transition: all 0.3s ease;
              }
              .custom-tabs .ant-tabs-tab:hover {
                color: var(--tab-active);
              }
              .custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
                color: var(--tab-active) !important;
              }
            `}</style>

            <div className="mt-8">{renderContent()}</div>
          </div>
        </>
      }
    />
  );
};

export default HomePage;
