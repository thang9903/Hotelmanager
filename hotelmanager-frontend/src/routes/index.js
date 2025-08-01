import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import Booking from "../pages/BookingPage";
import BookingDetail from "../pages/BookingDetailPage";
import RoomManagement from "../pages/RoomManagementPage";
import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";

import "../styles/Layout.css";
import ServiceManagement from "../pages/ServiceManagementPage copy";
import Dashboard from "../pages/DashBoardPage";
import EmployeeManagement from "../pages/EmployeeManagementPage";
import Report from "../pages/Report";

// Layout dùng chung
const Layout = () => {
  return (
    <div className="layout-container">
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Trang đăng nhập không cần bảo vệ */}
        <Route path="/login" element={<LoginPage />} />

        {/* Layout và các trang bên trong được bảo vệ */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Mặc định chuyển hướng về /booking */}
          <Route index element={<Navigate to="booking" replace />} />
          <Route path="booking" element={<Booking />} />
          <Route path="booking-detail/:id" element={<BookingDetail />} />
          <Route path="room-management" element={<RoomManagement />} />
          <Route path="service-management" element={<ServiceManagement />} />
          <Route path="employee-management" element={<EmployeeManagement />} />
          <Route path="overview" element={<Dashboard />} />
          <Route path="report" element={<Report />} />
          <Route path="home" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
