import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import "../styles/BookingDetailPage.css";
import backgroundImage from "../assets/images/bg.jpg";
import { useNavigate, useParams } from "react-router-dom";
import {
  cancelBooking,
  findBookingById,
  updateBooking,
} from "../services/booking";
import { calculateTime } from "../utils/caculate-time";
import { findByRoomType, findRoomTypeByRoomId } from "../services/room";
import { calculatePrice } from "../utils/caculate-price";
import Drawer from "../components/modal/Drawer";
import InvoiceDrawer from "../components/modal/InvoiceDrawer";
import CustomerModal from "../components/modal/CustomerModal";
import { searchService } from "../services/service";
import { debounce } from "lodash";
import {
  createBookingItem,
  getBookingItemsByBooking,
  removeBookingItem,
  updateBookingItem,
} from "../services/booking-service";

const channels = [
  { id: "direct", name: "Khách đến trực tiếp", icon: "fa-solid fa-store" },
  { id: "facebook", name: "Facebook", icon: "fa-brands fa-facebook" },
  { id: "zalo", name: "Zalo", icon: "fa-solid fa-comment-dots" },
  { id: "online", name: "Đặt online", icon: "fa-solid fa-globe" },
];

export default function BookingDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [servicesItems, setServiceItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [searchRoom, setSearchRoom] = useState("");
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [booking, setBooking] = useState({
    id: "",
    customerName: "",
    customerPhone: "",
    cccd: "",
    checkInDate: "",
    checkOutDate: "",
    type: "",
    status: "",
    unitPrice: 0,
    totalPrice: 0,
    depositAmount: 0,
    channel: "",
    totalServicePrice: 0,
  });
  const [room, setRoom] = useState({
    roomId: "",
    roomName: "",
    status: 1,
    clean: "",
    state: "",
  });

  const [rooms, setRooms] = useState([]);

  const [roomType, setRoomType] = useState({
    roomTypeId: "",
    roomTypeName: "",
    priceByDay: 0,
    priceByHour: 0,
    priceOvernight: 0,
    status: 1,
  });

  const [timeQuantity, setTimeQuantity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [services, setServices] = useState([]);
  const [searchServiceName, setSearchServiceName] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { id: bookingId } = useParams();

  const handleDelete = async (id) => {
    const deleted = await removeBookingItem(id);
    if (deleted) {
      setServiceItems((prev) => prev.filter((service) => service.id !== id));
      const { changeTotal } = deleted;
      setBooking((prev) => ({
        ...prev,
        totalServicePrice: prev.totalServicePrice + changeTotal,
      }));
    }
  };

  const handleSelectRoom = (room) => {
    // setRoomName(room.name);
    setRoom(room);
    setSearchRoom(room.roomName); // Điền tên phòng vào input
    setFilteredRooms([]); // Ẩn danh sách gợi ý
  };

  const handleRoomSearchChange = (e) => {
    const value = e.target.value;
    setSearchRoom(value);

    // Lọc danh sách phòng dựa trên từ khóa
    if (value.trim() === "") {
      setFilteredRooms([]);
    } else {
      const filtered = rooms.filter((room) =>
        room.roomName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRooms(filtered);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchTab = activeTab === "Tất cả" || s.type === activeTab;
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

  const handleclickServiceCard = (service) => {
    const exists = servicesItems.find((s) => s.service?.id === service.id);
    if (exists) {
      updateItem(exists.id, exists.quantity + 1);
    } else {
      createItem(bookingId, service.id, 1);
    }
  };

  const fetchRoomType = async (roomId) => {
    const roomType = await findRoomTypeByRoomId(roomId);
    if (roomType) {
      console.log("room type", roomType);
      setRoomType(roomType);
    }
  };
  const fetchBooking = async () => {
    const { booking, room } = await findBookingById(bookingId);
    if (booking && room) {
      // console.log("----", booking);
      fetchRoomType(room.roomId);
      setRoom(room);
      setBooking(booking);
    }
  };
  const fetchRooms = async (roomTypeId) => {
    const rooms = await findByRoomType(roomTypeId, 1);

    if (rooms) {
      setRooms(rooms);
    } else {
      setRooms([]);
    }
  };

  const fetchServices = async (name, type, inventory, status) => {
    const services = await searchService({ name, type, inventory, status });
    setServices(services);
  };

  const fetchBookingItem = async () => {
    const serviceItems = await getBookingItemsByBooking(bookingId);

    setServiceItems(serviceItems);
  };

  const debouncedSearch = useCallback(
    debounce(async (name, type, inventory, status) => {
      try {
        const services = await searchService({ name, type, inventory, status });

        setServices(services);

        console.log("Kết quả tìm kiếm:", services);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
    }, 1000),
    []
  );

  const handleChangeSearchName = (e) => {
    const newValue = e.target.value;
    setSearchServiceName(e.target.value);
    debouncedSearch(newValue, activeTab, "", 1);
  };

  const handleEditBooking = async () => {
    const updatedBooking = await updateBooking({
      ...booking,
      roomId: room.roomId,
      bookingId,
    });
  };

  const handleConfirmCancleBooking = async () => {
    const canceled = await cancelBooking(bookingId);
    if (canceled) {
      navigate("/booking");
    }
  };

  const createItem = async (bookingId, serviceId, quantity) => {
    const newBooking = await createBookingItem({
      bookingId,
      serviceId,
      quantity,
    });

    if (newBooking) {
      setServiceItems((prev) => [newBooking, ...prev]);
      setBooking((prev) => ({
        ...prev,
        totalServicePrice: prev.totalServicePrice + newBooking.totalPrice,
      }));
    }
  };

  const updateItem = async (bookingId, quantity) => {
    if (quantity >= 1) {
      const data = await updateBookingItem(bookingId, { quantity });

      if (data) {
        const { bookingItem, changeTotal } = data;
        setServiceItems((prev) =>
          prev.map((item) => (item.id === bookingItem.id ? bookingItem : item))
        );

        setBooking((prev) => ({
          ...prev,
          totalServicePrice: prev.totalServicePrice + changeTotal,
        }));
      }
    }
  };

  useEffect(() => {
    fetchBooking();
    fetchServices("", "", "", 1);
    fetchBookingItem();
  }, []);

  useEffect(() => {
    setSearchRoom(room.roomName);
  }, [room.roomName]);

  useEffect(() => {
    if (roomType.roomTypeId) {
      const price =
        booking.type == "Ngày"
          ? roomType.priceByDay
          : booking.type == "Đêm"
          ? roomType.priceOvernight
          : roomType.priceByHour;

      console.log("check dame", booking.type, price, roomType);

      const timeQuantity = calculateTime(
        booking.checkInDate,
        booking.checkOutDate
      );
      const totalPrice = calculatePrice({
        checkInStr: booking.checkInDate,
        checkOutStr: booking.checkOutDate,
        type: booking.type,
        price: price,
      });
      setTimeQuantity(timeQuantity);
      setBooking((prev) => ({ ...prev, totalPrice, unitPrice: price }));
    }
  }, [booking.checkInDate, booking.checkOutDate, booking.type]);

  useEffect(() => {
    const timeQuantity = calculateTime(
      booking.checkInDate,
      booking.checkOutDate
    );

    setTimeQuantity(timeQuantity);
  }, [booking.checkInDate, booking.checkOutDate]);

  useEffect(() => {
    if (roomType.roomTypeId) fetchRooms(roomType.roomTypeId);
  }, [roomType.roomTypeId]);

  useEffect(() => {
    console.log("change", booking);
  }, [booking]);

  useEffect(() => {
    console.log("service item::", servicesItems);
  }, [servicesItems]);

  useEffect(() => {
    fetchServices("", activeTab, "", 1);
  }, [activeTab]);

  return (
    <div className="booking-detail-page">
      <div className="booking-detail-container">
        {/* Customer Information Section */}
        <div className="customer-info">
          {/* Customer */}
          <div className="customer-section">
            {booking.customerName === "" ? (
              <>
                <h3 className="section-title">Khách hàng</h3>
                <div className="search-customer">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <input
                    type="text"
                    placeholder="Nhập tên, SĐT, mã CCCD khách hàng"
                    className="search-customer-input"
                    value={booking.customerName}
                    onChange={(e) =>
                      setBooking((prev) => ({
                        ...prev,
                        customerName: e.target.value,
                      }))
                    }
                  />
                  <button onClick={() => setOpenCustomerModal(true)}>
                    <i class="fa-solid fa-circle-plus"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="search-customer">
                <div className="customer-info-details">
                  <div className="customer-contact">
                    <span className="customer-name">
                      <i class="fa-regular fa-user"></i>
                      {booking.customerName}
                    </span>
                    <span className="customer-phone">
                      <i class="fa-solid fa-phone"></i>
                      {booking.customerPhone ? booking.customerPhone : "---"}
                    </span>
                    <span className="customer-cccd">
                      <i class="fa-solid fa-id-card"></i>
                      {booking.cccd ? booking.cccd : "---"}
                    </span>
                  </div>
                </div>
                <button onClick={() => setOpenCustomerModal(true)}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  onClick={() =>
                    setBooking((prev) => ({
                      ...prev,
                      customerName: "",
                      customerPhone: "",
                      cccd: "",
                    }))
                  }
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            )}
          </div>

          {/* Sales Channel */}
          <div className="sales-channel">
            <h3 className="section-title">Kênh bán</h3>
            <div className="channel-dropdown">
              <div
                className="channel-selected"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <i
                  className={
                    channels.find((ch) => ch.name === booking.channel)?.icon
                  }
                ></i>
                <span>
                  {channels.find((ch) => ch.name === booking.channel)?.name}
                </span>
              </div>
              {isDropdownOpen && (
                <div className="channel-options">
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className="channel-option"
                      onClick={() => {
                        setBooking((prev) => ({
                          ...prev,
                          channel: channel.name,
                        }));

                        setIsDropdownOpen(false);
                      }}
                    >
                      <i className={channel.icon}></i>
                      <span>{channel.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="notes-section">
            <h3 className="section-title">Ghi chú</h3>
            <span className="text-muted">Chưa có ghi chú</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Sidebar */}
          <div className="sidebar">
            <h3>Sản phẩm/Dịch vụ</h3>
            <div className="room-details">
              <div className="search-service" style={{ maxWidth: "400px" }}>
                <i class="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ"
                  className="search-service-input"
                  onChange={(e) => handleChangeSearchName(e)}
                  value={searchServiceName}
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
                      onClick={() => handleclickServiceCard(service)}
                    >
                      <i
                        className={
                          service.type === "Dịch vụ"
                            ? "fa-solid fa-hand-holding-heart"
                            : service.type === "Đồ ăn"
                            ? "fa-solid fa-utensils"
                            : "fa-solid fa-mug-hot"
                        }
                      ></i>
                      <div className="service-info">
                        <h4>{service.name}</h4>
                        <p>
                          {service.sellPrice?.toLocaleString("vi-VN")}₫
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
          </div>

          {/* Main Content */}
          <div className="main-content-detail">
            <div className="content">
              <div className="content-header">
                <h2 className="content-title">
                  {room.roomName} - {roomType.roomTypeName}
                </h2>
              </div>

              <div className="content-body">
                <div className="room-details">
                  <div className="table-header" style={{ maxHeight: "50px" }}>
                    <span>Phòng</span>
                    <span>Hình thức</span>
                    <span>Nhận phòng</span>
                    <span>Trả phòng</span>
                  </div>
                  <div className="table-body">
                    <div className="table-row">
                      <div className="autocomplete-container">
                        <input
                          type="text"
                          className="autocomplete-input"
                          placeholder="Tên phòng"
                          value={searchRoom}
                          onChange={handleRoomSearchChange}
                        />
                        {filteredRooms.length > 0 && (
                          <div className="autocomplete-dropdown">
                            {filteredRooms.map((room) => (
                              <div
                                key={room.roomId}
                                className="autocomplete-item"
                                onClick={() => handleSelectRoom(room)}
                              >
                                {room.roomName}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <select
                        className="input-select"
                        value={booking.type} // Giá trị mặc định
                        onChange={(e) => {
                          // Xử lý khi người dùng thay đổi lựa chọn
                          console.log("Selected type:", e.target.value);
                          setBooking((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }));
                        }}
                      >
                        <option value="Ngày">Ngày</option>
                        <option value="Đêm">Đêm</option>
                        <option value="Giờ">Giờ</option>
                      </select>

                      <input
                        type="datetime-local"
                        className="input-date"
                        value={booking.checkInDate}
                        onChange={(e) =>
                          setBooking((prev) => ({
                            ...prev,
                            checkInDate: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="datetime-local"
                        className="input-date"
                        value={booking.checkOutDate}
                        onChange={(e) =>
                          setBooking((prev) => ({
                            ...prev,
                            checkOutDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="room-items">
                  <div className="table-header">
                    <span>STT</span>
                    <span>Hạng mục</span>
                    <span>Số lượng</span>
                    <span>Đơn giá</span>
                    <span>Thành tiền</span>
                  </div>
                  <div className="table-body">
                    <div className="table-row" key={booking.id}>
                      <span>1.</span>
                      <span>{roomType.roomTypeName}</span>
                      <div className="quantity-control">
                        <span>{timeQuantity}</span>
                      </div>
                      <span>{booking.unitPrice.toLocaleString()} ₫</span>
                      <span>
                        {booking.totalPrice.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>

                    {servicesItems.map((item, index) => (
                      <div className="table-row" key={item.id}>
                        <span>{index + 2}.</span>
                        <span>{item.service?.name}</span>
                        <div className="quantity-control">
                          <button
                            className="decrement-btn"
                            onClick={() =>
                              updateItem(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity === 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="increment-btn"
                            onClick={() =>
                              updateItem(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <span>{item.unitPrice?.toLocaleString("vi-VN")} ₫</span>
                        <span>{item.totalPrice.toLocaleString("vi-VN")}₫</span>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="content-footer">
                <span>Tổng tiền</span>
                <span>
                  {(
                    booking.totalPrice + booking.totalServicePrice
                  ).toLocaleString()}{" "}
                  ₫
                </span>
              </div>
            </div>

            <div className="content-detail-footer">
              <div className="footer-buttons">
                <button
                  className="add-button"
                  onClick={() => {
                    setIsConfirmDialogOpen(true);
                  }}
                >
                  Hủy Đơn
                </button>
                <button className="edit-button" onClick={handleEditBooking}>
                  Lưu
                </button>
                <button
                  className="add-button"
                  onClick={() => {
                    setOpenDrawer(true);
                  }}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvoiceDrawer
        isOpen={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
        }}
        bookingId={bookingId}
      />

      <CustomerModal
        isOpen={openCustomerModal}
        onClose={() => setOpenCustomerModal(false)}
        custommer={{
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          cccd: booking.cccd,
        }}
        setCustomer={setBooking}
      />

      {isConfirmDialogOpen && (
        <div className="confirm-dialog">
          <div className="dialog-content">
            <p>Bạn có chắc chắn muốn hủy đơn </p>
            <div className="dialog-actions">
              <button
                className="cancel-button"
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                Hủy
              </button>
              <button
                className="confirm-button"
                onClick={() => handleConfirmCancleBooking()}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
