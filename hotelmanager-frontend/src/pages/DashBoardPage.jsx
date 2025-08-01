import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import {
  getCountBooking,
  getCountBookingByChannel,
  getRevenue,
  getServiceTypeSold,
  getTop5Service,
} from "../services/overview";
import Loader from "../components/Loader";

const bookingChannelData = [
  { name: "Trực tiếp", value: 200 },
  { name: "Zalo", value: 150 },
  { name: "Facebook", value: 100 },
  { name: "Website", value: 80 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("revenueLast30Days");
  const [countTimeFilter, setCountTimeFilter] = useState("today");
  const [serviceTimeFilter, setServiceTimeFilter] = useState("today");
  const [topServiceTimeFilter, setTopServiceTimeFilter] = useState("today");
  const [cancelTimeFilter, setCancelTimeFilter] = useState("today");
  const [bookingChannelTimeFilter, setBookingChannelTimeFilter] =
    useState("today");
  const [revenueData, setRevenueData] = useState({});
  const [countBookingData, setCountBookingData] = useState({});
  const [topServices, setTopServices] = useState({});
  const [countBookingChannel, setCountBookingChannel] = useState({});
  const [bookingChannelData, setBookingChannelData] = useState([]);
  const [countBookingSelected, setCountBookingSelected] = useState({
    revenue: 0,
    countBooking: 0,
    countCancel: 0,
  });

  const [serviceTypeData, setServiceTypeData] = useState({});

  const [serviceTypeSelected, setServiceTypeSelected] = useState([
    { serviceType: "Dịch vụ", value: 0 },
    { serviceType: "Đồ ăn", value: 0 },
    { serviceType: "Thức uống", value: 0 },
  ]);

  const [cancellationRate, setCancellationRate] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {
    const data = await getRevenue();
    if (data) {
      setRevenueData(data);
    }
  };

  const fetchCountBooking = async () => {
    const data = await getCountBooking();
    if (data) {
      setCountBookingData(data);
      setCountBookingSelected(data.today);

      const { countBooking, countCancel } = data.today;

      const cancellationRate = [
        { name: "Đã hủy", value: +countCancel },
        { name: "Thành công", value: +countBooking - +countCancel },
      ];

      setCancellationRate(cancellationRate);
    }
  };

  const fetchServiceType = async () => {
    const data = await getServiceTypeSold();
    if (data) {
      setServiceTypeData(data);
      setServiceTypeSelected(data.today);
    }
  };

  const fetchTop5Service = async () => {
    const data = await getTop5Service();
    if (data) {
      setTopServices(data);
      // setServiceTypeSelected(data.today);
    }
  };

  const fetchCountBookingByChannel = async () => {
    const data = await getCountBookingByChannel();
    if (data) {
      const transformed = {};
      Object.keys(data).forEach((key) => {
        transformed[key] = Object.entries(data[key]).map(([name, value]) => ({
          name,
          value,
        }));
      });
      setCountBookingChannel(transformed);
    }
  };

  useEffect(() => {
    const data = countBookingData?.[cancelTimeFilter];
    if (data) {
      const { countBooking, countCancel } = data;

      const cancellationRate = [
        { name: "Đã hủy", value: +countCancel },
        { name: "Thành công", value: +countBooking - +countCancel },
      ];

      setCancellationRate(cancellationRate);
    }
  }, [cancelTimeFilter]);

  // useEffect(() => {
  //   const data = countBookingChannel?.[bookingChannelTimeFilter];
  //   if (data) {
  //     const { countBooking, countCancel } = data;

  //     const cancellationRate = [
  //       { name: "Đã hủy", value: +countCancel },
  //       { name: "Thành công", value: +countBooking - +countCancel },
  //     ];

  //     setCancellationRate(cancellationRate);
  //   }
  // }, [bookingChannelTimeFilter]);

  useEffect(() => {
    setLoading(true);
    fetchRevenue();
    fetchCountBooking();
    fetchServiceType();
    fetchTop5Service();
    fetchCountBookingByChannel();
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log(countBookingSelected);
  }, [countBookingSelected]);
  return (
    <div className="dashboard-container p-6 space-y-8 pt-14 bg-gray-50 min-h-screen">
      {loading && <Loader />}

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Tổng quan hệ thống
          </h1>
          <p className="text-gray-500 mt-1">Thống kê và phân tích dữ liệu</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="timeFilter" className="font-medium text-gray-700">
            Xem theo:
          </label>
          <select
            id="countTimeFilter"
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            value={countTimeFilter}
            onChange={(e) => {
              setCountBookingSelected(countBookingData[e.target.value]);
              setCountTimeFilter(e.target.value);
            }}
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  Doanh thu
                </h2>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {countBookingSelected.revenue.toLocaleString()}₫
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <i className="fas fa-money-bill-wave text-green-600 text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  Dịch vụ đã bán
                </h2>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {serviceTypeData[countTimeFilter]?.reduce(
                    (sum, s) => sum + s.totalSold,
                    0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="fas fa-shopping-cart text-blue-600 text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  Lượt đặt phòng
                </h2>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {countBookingSelected.countBooking}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <i className="fas fa-calendar-check text-purple-600 text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Đơn hủy</h2>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {countBookingSelected.countCancel}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <i className="fas fa-times-circle text-red-600 text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Doanh thu</h2>
              <select
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="revenueLast30Days">30 ngày gần nhất</option>
                <option value="revenueThisWeek">Tuần này</option>
                <option value="revenueThisMonth">Tháng này</option>
                <option value="revenueLastMonth">Tháng trước</option>
                <option value="revenueThisYear">Năm nay</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData[timeFilter]}>
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}tr`} />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString()}₫`,
                      "Doanh thu",
                    ]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trend Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Xu hướng doanh thu
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData[timeFilter]}>
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}tr`} />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString()}₫`,
                      "Doanh thu",
                    ]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: "#10B981", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#10B981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Services Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Top dịch vụ phổ biến
              </h2>
              <select
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                value={topServiceTimeFilter}
                onChange={(e) => setTopServiceTimeFilter(e.target.value)}
              >
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={topServices[topServiceTimeFilter]}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="serviceName" width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="totalSold"
                    fill="#6366F1"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Service Type Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Tỷ lệ loại dịch vụ
              </h2>
              <select
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                value={serviceTimeFilter}
                onChange={(e) => {
                  setServiceTypeSelected(serviceTypeData[e.target.value]);
                  setServiceTimeFilter(e.target.value);
                }}
              >
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceTypeSelected}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="totalSold"
                    nameKey="serviceType"
                    label={({ serviceType, percent }) =>
                      `${serviceType}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {serviceTypeSelected.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} lượt bán`, name]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Booking Channel Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Tỷ lệ kênh đặt
              </h2>
              <select
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                value={bookingChannelTimeFilter}
                onChange={(e) => setBookingChannelTimeFilter(e.target.value)}
              >
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countBookingChannel?.[bookingChannelTimeFilter] || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {(
                      countBookingChannel?.[bookingChannelTimeFilter] || []
                    ).map((entry, index) => (
                      <Cell
                        key={`channel-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} lượt đặt`, name]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Rate Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Tỷ lệ đơn hủy
              </h2>
              <select
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                value={cancelTimeFilter}
                onChange={(e) => setCancelTimeFilter(e.target.value)}
              >
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cancellationRate}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {cancellationRate.map((entry, index) => (
                      <Cell
                        key={`cancel-${index}`}
                        fill={index === 0 ? "#EF4444" : "#10B981"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} lượt`, name]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
