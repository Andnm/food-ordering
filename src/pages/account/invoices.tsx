import AccountLayout from "@layout/AccountLayout";
import React, { useEffect, useState } from "react";
import {
  Card,
  Empty,
  Spin,
  List,
  Typography,
  Divider,
  Tag,
  Table,
  Row,
  Col,
  Space,
} from "antd";
import { useSession } from "next-auth/react";
import invoice from "@services/invoice";
import { toastError } from "@utils/global";
import { useRouter } from "next/router";
import { InvoiceState } from "@models/invoice";
import { formatCurrencyToVND, formatDateTimeVN } from "@utils/helpers";

const { Title, Text } = Typography;

const InvoicePage = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [invoiceList, setInvoiceList] = useState<InvoiceState[]>([]);

  useEffect(() => {
    if (session?.user?.token) {
      fetchInvoices();
    }
  }, [session?.user?.token, router.asPath]);

  const fetchInvoices = async () => {
    if (!session?.user?.token) return;

    try {
      setLoading(true);
      const invoicesList = await invoice.getAllInvoices(session?.user?.token);
      console.log("invoicesList: ", invoicesList);
      setInvoiceList(invoicesList);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusTag = (status: string) => {
    switch (status) {
      case 'success':
        return <Tag color="success">Success</Tag>;
      case 'canceled':
        return <Tag color="warning">Canceled</Tag>;
      default:
        return <Tag color="default">Processing</Tag>;
    }
  };

  const columns = [
    {
      title: "Item",
      dataIndex: "item_name",
      key: "item_name",
      render: (text: string, record: any) => (
        <Space>
          <img
            src={record.image_url}
            alt={text}
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "right" as const,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right" as const,
      render: (price: string) => formatCurrencyToVND(price),
    },
    {
      title: "Total",
      key: "total",
      align: "right" as const,
      render: (record: any) =>
        formatCurrencyToVND(record.price * record.quantity),
    },
  ];

  const renderInvoiceCard = (invoice: InvoiceState) => (
    <Card style={{ height: '100%' }}>
      <Row justify="space-between" align="top">
        <Col>
          <Title level={2}>INVOICE</Title>
          <Text type="secondary">
            #{invoice.invoice_id.toString().padStart(6, "0")}
          </Text>
        </Col>
        <Col>
          <Text strong>Order Date </Text>
          <Text>{formatDateTimeVN(invoice.invoice_date)}</Text>
          <br />
          <Text strong>Order Id </Text>
          <Text>#{invoice.order_id}</Text>
        </Col>
      </Row>

      <Divider />

      <Row gutter={24}>
        <Col span={12}>
          <Title level={5}>Bill To:</Title>
          <Text strong>Name: </Text>
          <Text>{invoice.order.customer.name} </Text>
          <br />
          <Text strong>Address: </Text>
          <Text>{invoice.order.customer.address}</Text>
          <br />
          <Text strong>Phone: </Text>
          <Text>{invoice.order.customer.phone}</Text>
        </Col>
        <Col span={12}>
          <Title level={5}>Payment Info:</Title>
          <Text strong>Payment method: </Text>
          <Text>{invoice?.payment?.payment_method}</Text>
          <br />
          <Text strong>Payment status: </Text>
          <Text>
            {getOrderStatusTag(invoice?.payment?.payment_status)}
          </Text>
        </Col>
      </Row>

      <Divider />

      <Table
        columns={columns}
        dataSource={invoice.order.details}
        pagination={false}
        rowKey="item_id"
        scroll={{ x: true }}
      />

      <Row justify="space-between" style={{ marginTop: 24 }}>
        <Col span={12}>
          <Title level={5}>Notes:</Title>
          <Text>{invoice.order.note || "No notes provided"}</Text>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Space direction="vertical" align="end">
            <Text strong>Total Amount:</Text>
            <Title level={3}>
              {formatCurrencyToVND(invoice.order.total)} VNĐ
            </Title>
          </Space>
        </Col>
      </Row>
    </Card>
  );

  return (
    <AccountLayout>
      <div className="container mx-auto px-4">
        <Spin spinning={loading}>
          {invoiceList.length === 0 ? (
            <Empty description="No invoices found" />
          ) : (
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
              dataSource={invoiceList}
              renderItem={(invoice) => (
                <List.Item key={invoice.invoice_id}>
                  {renderInvoiceCard(invoice)}
                </List.Item>
              )}
            />
          )}
        </Spin>
      </div>
    </AccountLayout>
  );
};

export default InvoicePage;