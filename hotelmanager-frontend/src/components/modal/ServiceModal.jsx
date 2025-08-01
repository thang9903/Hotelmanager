import React, { useState } from "react";
import "../../styles/modal/ServiceModal.css";
import backgroundImage from "../../assets/images/bg.jpg";

const services = [
  {
    id: 1,
    name: "Golf (Day)",
    price: 3000000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Fishing (Session)",
    price: 200000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Childcare (Day)",
    price: 500000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Car Rental (Day)",
    price: 2000000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Motorcycle Rental (Day)",
    price: 150000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Massage (Session)",
    price: 700000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    name: "Sauna (Session)",
    price: 400000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 8,
    name: "Haircut (Session)",
    price: 100000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 9,
    name: "Chips",
    price: 30000,
    unit: "pack",
    category: "Đồ ăn",
    image: "/placeholder.svg",
  },
  {
    id: 10,
    name: "Dried Beef",
    price: 80000,
    unit: "portion",
    category: "Đồ ăn",
    image: "/placeholder.svg",
  },
  {
    id: 11,
    name: "Giặt ủi (Bộ)",
    price: 100000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 12,
    name: "Dọn phòng (Lần)",
    price: 50000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 13,
    name: "Thuê xe đạp (Ngày)",
    price: 80000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 14,
    name: "Hướng dẫn viên du lịch (Ngày)",
    price: 1500000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 15,
    name: "Đặt vé máy bay",
    price: 300000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 16,
    name: "Đặt vé tàu",
    price: 200000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 17,
    name: "Thuê lều cắm trại (Ngày)",
    price: 100000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 18,
    name: "Dịch vụ spa (Lần)",
    price: 1200000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 19,
    name: "Dịch vụ làm móng (Lần)",
    price: 300000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 20,
    name: "Dịch vụ trang điểm (Lần)",
    price: 500000,
    category: "Dịch vụ",
    image: "/placeholder.svg",
  },
  {
    id: 21,
    name: "Nước suối",
    price: 10000,
    unit: "chai",
    category: "Đồ uống",
    image: "/placeholder.svg",
  },
  {
    id: 22,
    name: "Cà phê",
    price: 30000,
    unit: "ly",
    category: "Đồ uống",
    image: "/placeholder.svg",
  },
  {
    id: 23,
    name: "Trà sữa",
    price: 40000,
    unit: "ly",
    category: "Đồ uống",
    image: "/placeholder.svg",
  },
  {
    id: 24,
    name: "Nước ngọt",
    price: 20000,
    unit: "lon",
    category: "Đồ uống",
    image: "/placeholder.svg",
  },
  {
    id: 25,
    name: "Bánh mì",
    price: 15000,
    unit: "ổ",
    category: "Đồ ăn",
    image: "/placeholder.svg",
  },
  {
    id: 26,
    name: "Phở bò",
    price: 50000,
    unit: "tô",
    category: "Đồ ăn",
    image: "/placeholder.svg",
  },
  {
    id: 27,
    name: "Cơm gà",
    price: 60000,
    unit: "phần",
    category: "Đồ ăn",
    image: "/placeholder.svg",
  },
  {
    id: 28,
    name: "Bún chả",
    price: 55000,
    unit: "phần",
    category: "Đồ ăn",
    image: "/placeholder.svg",
  },
  {
    id: 29,
    name: "Cháo gà",
    price: 40000,
    unit: "tô",
    category: "Đồ ăn",
    image: "/placeholder.svg",
  },
  {
    id: 30,
    name: "Trái cây tươi",
    price: 30000,
    unit: "phần",
    category: "Đồ ăn",
    image: "/placeholder.svg",
  },
];

const ServiceModal = ({
  isOpen,
  onClose,
  customerName = "Customer",
  roomNumber = "1",
}) => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [servicesItems, setServiceItems] = useState([]);
  const [searchServiceName, setSearchServiceName] = useState(null);



  const handleDelete = (id) => {
    setSelectedServices((prev) => prev.filter((service) => service.id !== id));
    setQuantities((prev) => {
      const updatedQuantities = { ...prev };
      delete updatedQuantities[id];
      return updatedQuantities;
    });
  };

  const handleIncrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1), // Không cho giảm dưới 1
    }));
  };

  const quantity = 1; // Lấy số lượng hiện tại

  const filteredServices = services.filter((s) => {
    const matchTab = activeTab === "Tất cả" || s.category === activeTab;
    const matchSearch = s.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const displayed = filteredServices.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const toggleService = (service) => {
    const exists = selectedServices.find((s) => s.id === service.id);
    setSelectedServices(
      exists ? [...selectedServices] : [...selectedServices, service]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay service-modal">
      <div className="modal-container">
        <div className="modal-header">
          <div>
            <h2>Thêm sản phẩm, dịch vụ</h2>
            <p>
              {customerName} - Room {roomNumber}
            </p>
          </div>
          <button className="close-button" onClick={onClose}>
            <i class="fa-regular fa-circle-xmark"></i>
          </button>
        </div>

        <div className="modal-content">
          {/* Danh sách dịch vụ */}
          <div className="service-list">
            <div className="search-service">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ"
                className="search-service-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="modal-tabs">
              {["Tất cả", "Dịch vụ", "Đồ ăn", "Đồ uống"].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab[0].toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="modal-grid">
              {displayed.length ? (
                displayed.map((service) => (
                  <div
                    key={service.id}
                    className="service-card"
                    onClick={() => toggleService(service)}
                  >
                    <img src={backgroundImage} alt={service.name} />
                    <div className="service-info">
                      <h4>{service.name}</h4>
                      <p>
                        {service.price.toLocaleString("vi-VN")}
                        {service.unit ? `/${service.unit}` : ""}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-services">No services found</div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx}
                    className={`page-dot ${
                      currentPage === idx ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(idx)}
                  ></button>
                ))}
              </div>
            )}
          </div>

          <div className="selected-services">
            <h3>Dịch vụ đã chọn</h3>
            {selectedServices.length > 0 ? (
              <>
                {selectedServices.map((service, index) => (
                  <div className="table-body">
                    <div className="table-row">
                      <span>{index + 1}.</span>
                      <span>{service.name}</span>
                      <div className="quantity-control">
                        <button
                          className="decrement-btn"
                          onClick={() => handleDecrement(service.id)}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          className="increment-btn"
                          onClick={() => handleIncrement(service.id)}
                        >
                          +
                        </button>
                      </div>
                      <span>{service.price.toLocaleString()}</span>
                      <span>{service.price.toLocaleString()}</span>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(service.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>Chưa có dịch vụ nào được chọn.</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="save-btn"
            onClick={() => {
              onClose();
            }}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
