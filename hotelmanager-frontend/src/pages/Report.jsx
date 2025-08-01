import React, { useState, useEffect } from "react";
import {
  Table,
  DatePicker,
  Select,
  Card,
  Row,
  Col,
  Tabs,
  Statistic,
} from "antd";
import moment from "moment";
import "../styles/Report.css";
import { findBookingByDate } from "../services/booking";
import { findBookingItemByDate } from "../services/booking-service";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const Report = () => {
  const [timeRange, setTimeRange] = useState("day");
  const [dateRange, setDateRange] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  const orderColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
    },

    {
      title: "Ngày nhận phòng",
      dataIndex: "checkInDate",
      key: "checkInDate",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày trả phòng",
      dataIndex: "checkOutDate",
      key: "checkOutDate",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },

    {
      title: "Giá giờ/đêm",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: "Tổng tiền phòng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: "Tiền dịch vụ",
      dataIndex: "totalServicePrice",
      key: "totalServicePrice",
      render: (price) => `${price.toLocaleString()} đ`,
    },

    {
      title: "Kênh đặt",
      dataIndex: "channel",
      key: "channel",
    },
    {
      title: "Phòng",
      key: "roomName",
      render: (_, record) => record.room?.roomName || "Không rõ",
    },
  ];

  // Cấu hình cột cho bảng dịch vụ
  const serviceColumns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "service_name",
      key: "service_name",
      width: 200,
    },
    {
      title: "Số lượng",
      dataIndex: "totalbookings",
      key: "totalbookings",
      width: 120,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalprice",
      key: "totalprice",
      width: 150,
      render: (amount) => Number(amount).toLocaleString("vi-VN") + " VNĐ",
    },
  ];

  // Xử lý thay đổi khoảng thời gian
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    let startDate, endDate;

    switch (value) {
      case "day":
        startDate = moment().startOf("day");
        endDate = moment().endOf("day");
        break;
      case "month":
        startDate = moment().startOf("month");
        endDate = moment().endOf("month");
        break;
      case "year":
        startDate = moment().startOf("year");
        endDate = moment().endOf("year");
        break;
      default:
        startDate = moment().startOf("day");
        endDate = moment().endOf("day");
    }

    setDateRange([startDate, endDate]);
  };

  // Xử lý thay đổi ngày
  const handleDateRangeChange = (dates) => {
    console.log(dates);
    setDateRange(dates);
  };

  // Xử lý thay đổi tab
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const bookings = await findBookingByDate(dateRange);
      const items = await findBookingItemByDate(dateRange);

      setOrders(bookings);
      setServices(items);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [timeRange, dateRange]);

  // Tính tổng tiền đơn hàng
  const totalOrderAmount = orders?.reduce(
    (sum, order) => sum + order.totalPrice + order.totalServicePrice,
    0
  );

  // Tính tổng tiền dịch vụ
  const totalServiceAmount = services?.reduce(
    (sum, service) => sum + +service.totalprice,
    0
  );

  return (
    <div className="report-management">
      <div className="report-header">
        <h1>Báo cáo</h1>
        <div className="report-filters">
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
          />
        </div>
      </div>

      <Card className="report-content">
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Danh sách đơn hàng" key="orders">
            <div className="total-amount">
              <Statistic
                title="Tổng doanh thu đơn hàng"
                value={totalOrderAmount}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                suffix="VNĐ"
                formatter={(value) => value.toLocaleString("vi-VN")}
              />
            </div>
            <Table
              columns={orderColumns}
              dataSource={orders}
              loading={loading}
              rowKey="id"
              scroll={{ x: 1000 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} đơn hàng`,
              }}
            />
          </TabPane>
          <TabPane tab="Danh sách dịch vụ đã bán" key="services">
            <div className="total-amount">
              <Statistic
                title="Tổng doanh thu dịch vụ"
                value={totalServiceAmount}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                suffix="VNĐ"
                formatter={(value) => value.toLocaleString("vi-VN")}
              />
            </div>
            <Table
              columns={serviceColumns}
              dataSource={services}
              loading={loading}
              rowKey="service_name"
              scroll={{ x: 1000 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} dịch vụ`,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Report;
