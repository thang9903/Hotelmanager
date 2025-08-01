import React, { use, useContext, useEffect, useState } from "react";
import "../styles/Header.css";
import avata from "../assets/images/bg.jpg";
import logo from "../assets/images/logo.png";
import { UserContext } from "../store/UserContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State để quản lý menu
  const { user, logout } = useContext(UserContext);
  const [tabActive, setTabActive] = useState("overview");
  const [isManager, setIsManager] = useState(user.role === "Quản lý"); // State để quản lý trạng thái của nút "Quản lý"

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Gọi hàm để chuyển trạng thái
  const handleChangeState = () => {
    if (user.role === "Quản lý") {
      setIsManager((prev) => !prev); // chỉ cập nhật state
    }
  };

  // Theo dõi thay đổi isManager để navigate
  useEffect(() => {
    if (!isManager) {
      navigate("/booking");
    } else if (isManager && user.role === "Quản lý") {
      navigate(`/${tabActive}`);
    }
  }, [isManager, tabActive]);

  useEffect(() => {
    if (user.role === "Quản lý") {
      if (isManager) {
        navigate(`/${tabActive}`);
      } else {
        navigate("/booking");
      }
    } else {
      navigate("/booking");
    }
  }, [isManager, tabActive]);

  return (
    <div className="header-container">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-image" />
        <span> SOLARIA</span>
      </div>
      {isManager ? (
        <div className="tabs">
          <button
            className={`tab-item ${tabActive === "overview" ? "active" : ""}`}
            onClick={() => setTabActive("overview")}
          >
            Tổng quan
          </button>

          <button
            className={`tab-item ${
              tabActive === "room-management" ? "active" : ""
            }`}
            onClick={() => setTabActive("room-management")}
          >
            Phòng
          </button>
          <button
            className={`tab-item ${
              tabActive === "service-management" ? "active" : ""
            }`}
            onClick={() => setTabActive("service-management")}
          >
            Dịch vụ
          </button>
          <button
            className={`tab-item ${tabActive === "report" ? "active" : ""}`}
            onClick={() => setTabActive("report")}
          >
            Báo cáo
          </button>
          <button
            className={`tab-item ${
              tabActive === "employee-management" ? "active" : ""
            }`}
            onClick={() => setTabActive("employee-management")}
          >
            Nhân viên
          </button>
        </div>
      ) : (
        <div className="tabs">
          <button className={`tab-item `} onClick={() => navigate("/booking")}>
            <i
              className="fa-solid fa-house"
              style={{ marginRight: "12px" }}
            ></i>
            Đặt phòng
          </button>
        </div>
      )}

      {user.role === "Quản lý" ? (
        !isManager ? (
          <button className="btn-manager" onClick={handleChangeState}>
            <i className="fa-brands fa-web-awesome"></i>
            <span>Quản lý</span>
          </button>
        ) : (
          <button className="btn-manager" onClick={() => setIsManager(false)}>
            <i className="fa-brands fa-font-awesome"></i>
            <span>Lễ tân</span>
          </button>
        )
      ) : null}

      <div className="user-info">
        <img src={avata} alt="User Avatar" className="avatar" />
        <div className="user-name">{user.fullName}</div>
        <div
          className="icon-circle"
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu khi click vào icon
        >
          <i className="fas fa-list-ul"></i> {/* Icon bên trong hình tròn */}
        </div>
        {isMenuOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
