"use client";

import { BaseItemState, CreateItemState } from "@models/item";
import SearchFilterHeader from "@components/manager/SearchFilterHeader";
import item from "@services/item";
import {
  formatCurrencyToVND,
  formatPrice,
  generateFallbackAvatar,
  handleUploadToFirebase,
} from "@utils/helpers";
import {
  Spin,
  Table,
  Button,
  Avatar,
  Menu,
  Dropdown,
  TableProps,
  Modal,
  Form,
  Upload,
  Input,
  Switch,
  InputNumber,
  Select,
} from "antd";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { BiDetail, BiUpload } from "react-icons/bi";
import { VscFolderActive } from "react-icons/vsc";
import { IoIosMore } from "react-icons/io";
import { toast } from "react-toastify";
import { MdBlock } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { handleActionNotSupport, toastError } from "@utils/global";
import { PiPlus } from "react-icons/pi";
import { useRouter } from "next/router";

const { confirm } = Modal;

const ManagerLayoutNoSSR = dynamic(() => import("@layout/ManagerLayout"), {
  ssr: false,
});

const Item = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<BaseItemState[]>([]);
  const [processingData, setProcessingData] = useState<BaseItemState[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [availabilityValue, setAvailabilityValue] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BaseItemState | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      if (session?.user.token) {
        setIsLoading(true);
        try {
          const responseGetAllItem = await item.getListItems(session.user.token);
          setOriginalData(responseGetAllItem);
          setProcessingData(responseGetAllItem);
        } catch (error: any) {
          toast.error("There was an error loading data!");
          toast.error(error!.response?.data?.message);
          console.error("There was an error loading data!:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchItems();
  }, [router.asPath, session?.user.token]);

  useEffect(() => {
    let updatedData = [...originalData];

    if (searchText) {
      updatedData = updatedData.filter((item: BaseItemState) =>
        item.item_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (categoryFilter) {
      updatedData = updatedData.filter((item: BaseItemState) => {
        if (categoryFilter === "Others") {
          return item.category !== "Food" && item.category !== "Beverage";
        }
        return item.category === categoryFilter;
      });
    }

    setProcessingData(updatedData);
  }, [searchText, categoryFilter, originalData]);

  const handleClearFilters = () => {
    setSearchText("");
    setCategoryFilter(undefined);
    setProcessingData(originalData);
  };

  const beforeUploadImage = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Chỉ chấp nhận file hình ảnh vào ô này!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const handleCreateSubmit = async (values: any) => {
    setUploading(true);
    try {
      const imgUrl = await handleUploadToFirebase(
        values.image_url.fileList[0].originFileObj,
        "item_FO"
      );

      const rawPrice = values.price.toString().replace(/\./g, "");

      const newItem: CreateItemState = {
        item_name: values.item_name,
        price: rawPrice,
        category: values.category,
        description: values.description,
        availability: availabilityValue,
        image_url: imgUrl,
      };

      const createItem = await item.createItem(session?.user.token!, newItem);

      toast.success("Add New Item Successfully!");
      setOriginalData((prevData) => [createItem.item, ...prevData]);
      setProcessingData((prevData) => [createItem.item, ...prevData]);
      setIsModalVisible(false);
      createForm.resetFields();
    } catch (error) {
      console.log("error:", error);
      toastError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (record: BaseItemState) => {
    setSelectedItem(record);
    editForm.setFieldsValue({
      item_name: record.item_name,
      price: formatPrice(record.price?.toString() || ""),
      category: record.category,
      description: record.description,
      availability: record.availability === 1,
    });
    setAvailabilityValue(record.availability || 0);
    setEditModalVisible(true);
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Item",
      dataIndex: "item_name",
      key: "item_name",
      render: (text: string, record: BaseItemState) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            shape="square"
            src={record.image_url}
            alt={record.item_name}
            style={{ marginRight: "8px", border: "1px solid #d9d9d9" }}
            size={55}
          />
          <div>
            <div className="text-base">{record.item_name}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string | undefined) =>
        category ? (
          category
        ) : (
          <i className="text-xs opacity-70">(Chưa cập nhật)</i>
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: string) => <span>{formatCurrencyToVND(price)} đ</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (Description: string | undefined) =>
        Description ? (
          Description
        ) : (
          <i className="text-xs opacity-70">(Chưa cập nhật)</i>
        ),
    },
    {
      title: "Status",
      dataIndex: "availability",
      key: "availability",
      width: "200px",
      render: (availability: number) => {
        return (
          <div className="flex items-center gap-2">
            <span
              style={{
                display: "inline-block",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: availability === 1 ? "#00FF19" : "#FF002E",
              }}
            />
            <span>
              {availability === 1 ? "Available" : "No longer available"}
            </span>
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (text: string, record: BaseItemState) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit">
              <Button
                type="link"
                onClick={() => handleEditClick(record)}
                icon={<BiDetail style={{ fontSize: "20px" }} />}
                style={{ color: "black" }}
                className="flex items-center"
              >
                Edit
              </Button>
            </Menu.Item>
            <Menu.Item key="delete">
              <Button
                type="link"
                onClick={() => {
                  confirm({
                    cancelText: "Cancel",
                    okText: "Confirm",
                    title: "Are you sure want to delete this item?",
                    async onOk() {
                      try {
                        await item.deleteItem(session?.user.token!, {
                          item_id: record.item_id!,
                        });
                        setOriginalData((prevData) =>
                          prevData.filter((item) => item.item_id !== record.item_id)
                        );
                        setProcessingData((prevData) =>
                          prevData.filter((item) => item.item_id !== record.item_id)
                        );
                        toast.success("Delete Item Successfully!");
                      } catch (error: any) {
                        toastError(error);
                      }
                    },
                    onCancel() {},
                  });
                }}
                icon={<FiTrash2 style={{ fontSize: "20px" }} />}
                style={{ color: "red" }}
                className="flex items-center"
              >
                Delete item
              </Button>
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="link" icon={<IoIosMore style={{ fontSize: "24px" }} />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <ManagerLayoutNoSSR
      content={
        <div>
          <div className="header-order">
            <SearchFilterHeader
              searchPlaceholder="Tìm kiếm người dùng"
              searchValue={searchText}
              onSearchChange={setSearchText}
              haveFilter={true}
              filters={[
                {
                  label: "Category",
                  options: [
                    { label: "Food", value: "Food" },
                    { label: "Beverage", value: "Beverage" },
                    { label: "Others", value: "Others" },
                  ],
                  value: categoryFilter,
                  onChange: setCategoryFilter,
                },
              ]}
              handleClearFilters={handleClearFilters}
            />

            <div className="p-4">
              <Button icon={<PiPlus />} onClick={() => setIsModalVisible(true)}>
                Add new item
              </Button>
              
              {/* Create Modal */}
              <Modal
                title="Add New Item"
                open={isModalVisible}
                onCancel={() => {
                  setIsModalVisible(false);
                  createForm.resetFields();
                }}
                okText="Create"
                cancelText="Cancel"
                onOk={() => createForm.submit()}
                confirmLoading={uploading}
              >
                <Form
                  form={createForm}
                  onFinish={handleCreateSubmit}
                  name="createForm"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ maxWidth: 600 }}
                  initialValues={{ remember: true }}
                >
                  <Form.Item
                    name="item_name"
                    label="Item name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Enter item name" />
                  </Form.Item>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true }]}
                  >
                    <Input
                      placeholder="Enter price"
                      onChange={(e) => {
                        const { value } = e.target;
                        const numericValue = value.replace(/[^\d]/g, "");
                        createForm.setFieldsValue({
                          price: formatPrice(numericValue),
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Select category"
                      options={[
                        { value: "Beverage", label: "Beverage" },
                        { value: "Food", label: "Food" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Enter description" />
                  </Form.Item>
                  <Form.Item
                    name="availability"
                    label="Availability"
                    valuePropName="checked"
                  >
                    <Switch
                      defaultChecked
                      onChange={(checked) => setAvailabilityValue(checked ? 1 : 0)}
                      checkedChildren="Available"
                      unCheckedChildren="Unavailable"
                    />
                  </Form.Item>
                  <Form.Item
                    name="image_url"
                    label="Image"
                    rules={[{ required: true }]}
                  >
                    <Upload
                      listType="picture"
                      beforeUpload={beforeUploadImage}
                      accept="image/*"
                      maxCount={1}
                    >
                      <Button icon={<BiUpload />}>Upload image</Button>
                    </Upload>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </div>

          <div className="mt-8">
            <Spin spinning={isLoading}>
              <Table
                columns={columns}
                dataSource={processingData}
                rowKey={(record) => record.item_id}
                pagination={{ pageSize: 10 }}
              />
            </Spin>
          </div>

          {/* Edit Modal */}
          <Modal
            title="Edit Item"
            open={editModalVisible}
            onCancel={() => {
              setEditModalVisible(false);
              setSelectedItem(null);
              editForm.resetFields();
            }}
            okText="Save"
            cancelText="Cancel"
            onOk={() => editForm.submit()}
            confirmLoading={uploading}
          >
            <Form
              form={editForm}
              name="editForm"
              onFinish={async (values) => {
                setUploading(true);
                try {
                  let imgUrl = selectedItem?.image_url || "";

                  if (values.image_url?.fileList?.[0]?.originFileObj) {
                    imgUrl = await handleUploadToFirebase(
                      values.image_url.fileList[0].originFileObj,
                      "item_FO"
                    );
                  }

                  const rawPrice = values.price.toString().replace(/\./g, "");

                  const updatedItem: BaseItemState = {
                    item_id: selectedItem?.item_id!,
                    item_name: values.item_name,
                    price: rawPrice,
                    category: values.category,
                    description: values.description,
                    availability: availabilityValue,
                    image_url: imgUrl,
                  };

                  await item.updateItem(session?.user.token!, updatedItem);

                  const updatedItemData = {
                    ...updatedItem,
                    item_id: selectedItem?.item_id!,
                  };

                  setOriginalData((prevData) =>
                    prevData.map((item) =>
                      item.item_id === selectedItem?.item_id
                        ? updatedItemData
                        : item
                    )
                  );
                  setProcessingData((prevData) =>
                    prevData.map((item) =>
                      item.item_id === selectedItem?.item_id
                        ? updatedItemData
                        : item
                    )
                  );

                  toast.success("Item updated successfully!");
                  setEditModalVisible(false);
                  editForm.resetFields();
                } catch (error) {
                  console.error("Error updating item:", error);
                  toastError(error);
                } finally {
                  setUploading(false);
                }
              }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{
                item_name: selectedItem?.item_name,
                price: formatPrice(selectedItem?.price?.toString() || ""),
                category: selectedItem?.category,
                description: selectedItem?.description,
                availability: selectedItem?.availability === 1,
              }}
            >
              <Form.Item
                name="item_name"
                label="Item name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter item name" />
              </Form.Item>

              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Enter price"
                  onChange={(e) => {
                    const { value } = e.target;
                    const numericValue = value.replace(/[^\d]/g, "");
                    editForm.setFieldsValue({
                      price: formatPrice(numericValue),
                    });
                  }}
                />
              </Form.Item>

              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select category"
                  options={[
                    { value: "Beverage", label: "Beverage" },
                    { value: "Food", label: "Food" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter description" />
              </Form.Item>

              <Form.Item
                name="availability"
                label="Availability"
                valuePropName="checked"
              >
                <Switch
                  defaultChecked={selectedItem?.availability === 1}
                  onChange={(checked) => setAvailabilityValue(checked ? 1 : 0)}
                  checkedChildren="Available"
                  unCheckedChildren="Unavailable"
                />
              </Form.Item>

              <Form.Item name="image_url" label="Image">
                <Upload
                  listType="picture"
                  beforeUpload={beforeUploadImage}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button icon={<BiUpload />}>Change image</Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      }
    />
  );
};

export default Item;
