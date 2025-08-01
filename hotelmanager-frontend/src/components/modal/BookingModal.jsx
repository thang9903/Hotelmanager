import React, { useEffect, useState } from "react";
import "../../styles/modal/BookingModal.css";
import CustomerModal from "./CustomerModal";
import { findByRoomType } from "../../services/room";
import { addDays, format } from "date-fns";
import { calculatePrice } from "../../utils/caculate-price";
import { createBooking, findBookedTimeSlots } from "../../services/booking";
import BookingStatus from "../../type/booking-status-enum";
import RoomState from "../../type/room-state-enum";

const channels = [
  { id: "direct", name: "Khách đến trực tiếp", icon: "fa-solid fa-store" },
  { id: "facebook", name: "Facebook", icon: "fa-brands fa-facebook" },
  { id: "zalo", name: "Zalo", icon: "fa-solid fa-comment-dots" },
  { id: "online", name: "Đặt online", icon: "fa-solid fa-globe" },
];

const BookingModal = ({
  isOpen,
  onClose,
  onOpenServiceModal,
  room,
  bookingInfo,
  setBookingRoom,
}) => {
  const [selectedChannel, setSelectedChannel] = useState("direct"); // Kênh bán mặc định
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [booking, setBooking] = useState({
    roomTypeId: "",
    roomId: "",
    roomName: "Khách lẻ",
    type: "Ngày",
    checkInDate: "",
    checkOutDate: "",
    unitPrice: 0,
    totalPrice: 0,
    depositAmount: 0,
    channel: "Khách đến trực tiếp",
  });
  const [rooms, setRooms] = useState([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [typeBooking, setTypeBooking] = useState("");
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchRoom, setSearchRoom] = useState("");
  const [roomType, setRoomType] = useState({
    roomTypeId: "",
    roomTypeName: "",
    priceByDay: 0,
    priceByHour: 0,
    priceOvernight: 0,
    status: 1,
  });
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState({
    customerName: "",
    customerPhone: "",
    cccd: "",
  });

  const handleBooking = async (status) => {
    const newBooking = await createBooking({
      customerName: customer.customerName,
      customerPhone: customer.customerPhone,
      cccd: customer.cccd,
      roomId: booking.roomId,
      type: booking.type,
      status,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      unitPrice: booking.unitPrice,
      totalPrice: booking.totalPrice,
      depositAmount: booking.depositAmount,
      channel: booking.channel,
    });
    if (newBooking) {
      const state =
        status === BookingStatus.CHECKED_IN
          ? RoomState.IN_USE
          : RoomState.PENDING;
      setBookingRoom({ ...newBooking.room, state: state });
      onClose();
    }
    setIsConfirmDialogOpen(false);
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

  const handleSelectRoom = (room) => {
    setSearchRoom(room.roomName); // Điền tên phòng vào input
    setFilteredRooms([]); // Ẩn danh sách gợi ý
    setBooking((prev) => ({
      ...prev,
      roomName: room.roomName,
      roomId: room.roomId,
    }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Lọc danh sách khách hàng dựa trên tên, số điện thoại hoặc mã CCCD
    if (value.trim() === "") {
      setFilteredCustomers([]);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(value.toLowerCase()) ||
          customer.phone.includes(value) ||
          customer.idCard.includes(value)
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleSelectCustomer = (customer) => {
    setSearchTerm(customer.name);
    setCustomer(customer.name);
    setFilteredCustomers([]);
  };

  const handleOpenCustomerModal = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCloseCustomerModal = () => {
    setIsCustomerModalOpen(false);
  };

  const fetchRoomTypes = async (roomType) => {
    const rooms = await findByRoomType(roomType.roomTypeId, 1);
    if (rooms) {
      setRooms(rooms);
    } else {
      setRooms([]);
      handleCloseBookingModal();
    }
  };

  const fetchBookedTimeSlots = async (roomId) => {
    const bookedTimeSlots = await findBookedTimeSlots(roomId);
    setBookedTimeSlots(bookedTimeSlots);
  };

  useEffect(() => {
    if (isOpen) {
      if (room.roomId) {
        setRoomType(room?.roomType);
        setBooking((prev) => ({
          ...prev,
          roomName: room.roomName,
          roomId: room.roomId,
          roomTypeId: room.roomType.roomTypeId,
          unitPrice: room.roomType.priceByDay,
        }));
        setSearchRoom(room.roomName);
        const totalPrice = previewPrice(room?.roomType);
        setBooking((prev) => ({
          ...prev,
          totalPrice,
        }));
        fetchRoomTypes(room?.roomType);
        fetchBookedTimeSlots(room.roomId);
      } else {
        setRoomType(bookingInfo?.roomType);
        setBooking((prev) => ({
          ...prev,
          roomTypeId: bookingInfo.roomType.roomTypeId,
          unitPrice: bookingInfo.roomType.priceByDay,
          checkInDate: bookingInfo.checkInDate,
          checkOutDate: bookingInfo.checkOutDate,
          type: bookingInfo.type,
          totalPrice: bookingInfo.totalPrice,
        }));

        fetchRoomTypes(bookingInfo?.roomType);
        fetchBookedTimeSlots(bookingInfo?.roomId);
      }
    }
  }, [isOpen]);

  const previewPrice = (roomType) => {
    const price =
      booking.type == "Ngày"
        ? roomType.priceByDay
        : booking.type == "Đêm"
        ? roomType.priceOvernight
        : roomType.priceByHour;

    const totalPrice = calculatePrice({
      checkInStr: booking.checkInDate,
      checkOutStr: booking.checkOutDate,
      type: booking.type,
      price,
    });

    return totalPrice;
  };

  const handleCloseBookingModal = () => {
    setBooking({
      roomTypeId: "",
      roomId: "",
      roomName: "",
      type: "Ngày",
      checkInDate: "",
      checkOutDate: "",
      unitPrice: 0,
      totalPrice: 0,
      depositAmount: 0,
    });
    setCustomer({ customerName: "", customerPhone: "", cccd: "" });
    setFilteredRooms([]);
    setSearchRoom("");
    setError("");
    setBookedTimeSlots([]);
    onClose();
  };
  useEffect(() => {
    const totalPrice = previewPrice(roomType);

    const price =
      booking.type == "Ngày"
        ? roomType.priceByDay
        : booking.type == "Đêm"
        ? roomType.priceOvernight
        : roomType.priceByHour;

    setBooking((prev) => ({ ...prev, totalPrice, unitPrice: price }));
  }, [booking.checkInDate, booking.checkOutDate, booking.type]);

  useEffect(() => {
    console.log("check time");
    const isOverlappingCheckin = bookedTimeSlots.some(
      (slot) =>
        new Date(booking.checkInDate) < new Date(slot.checkOutDate) &&
        new Date(booking.checkInDate) >= new Date(slot.checkInDate)
    );

    const isOverlappingCheckOut = bookedTimeSlots.some(
      (slot) =>
        new Date(booking.checkOutDate) > new Date(slot.checkInDate) &&
        new Date(booking.checkOutDate) <= new Date(slot.checkOutDate)
    );

    if (isOverlappingCheckin || isOverlappingCheckOut) {
      setError("Thời gian nhận phòng trùng với khung giờ đã đặt!");
    } else {
      setError("");
    }
  }, [booking.checkInDate, booking.checkOutDate]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay booking-modal">
      <div className="modal">
        <button
          className="close-button"
          onClick={() => handleCloseBookingModal()}
        >
          <i class="fa-regular fa-circle-xmark"></i>
        </button>
        <h2>Đặt/Nhận phòng</h2>

        <div className="booking-header-container">
          {customer.customerName === "" ? (
            <div className="search-customer">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Nhập tên, SĐT, mã CCCD khách hàng"
                className="search-customer-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button onClick={handleOpenCustomerModal}>
                <i class="fa-solid fa-circle-plus"></i>
              </button>

              {filteredCustomers.length > 0 && (
                <div className="autocomplete-dropdown">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="autocomplete-item"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <span className="customer-name">{customer.name}</span>
                      <span className="customer-phone">{customer.phone}</span>
                      <span className="customer-id">{customer.idCard}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="search-customer">
              <i class="fa-regular fa-user"></i>
              <span>{customer.customerName}</span>
              <button
                onClick={() => {
                  setCustomer({
                    customerName: "",
                    customerPhone: "",
                    cccd: "",
                  });
                  setSearchTerm("");
                }}
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          <div className="channel-dropdown">
            <div
              className="channel-selected"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <i
                className={
                  channels.find((ch) => ch.id === selectedChannel).icon
                }
              ></i>
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
                      setSelectedChannel(channel.id);
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
          {error && (
            <div className="error">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="table-header">
          <span>Loại phòng</span>
          <span>Phòng</span>
          <span>Hình thức</span>
          <span>Nhận phòng</span>
          <span>Trả phòng</span>
          <span>Thành tiền</span>
        </div>

        <div className="table-body">
          <div className="table-row">
            <span>{roomType.roomTypeName}</span>

            <div className="autocomplete-container">
              <input
                type="text"
                className="autocomplete-input"
                placeholder="Tên phòng"
                value={searchRoom}
                onChange={handleRoomSearchChange}
                onFocus={() => {
                  const filtered = rooms.filter((room) =>
                    room.roomName
                      .toLowerCase()
                      .includes(searchRoom.toLowerCase())
                  );
                  setFilteredRooms(filtered);
                }}
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
                setBooking((prev) => ({ ...prev, type: e.target.value }));
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
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) =>
                setBooking((prev) => ({ ...prev, checkInDate: e.target.value }))
              }
            />
            <input
              type="datetime-local"
              className="input-date"
              value={booking.checkOutDate}
              min={booking.checkInDate}
              onChange={(e) =>
                setBooking((prev) => ({
                  ...prev,
                  checkOutDate: e.target.value,
                }))
              }
            />
            <span style={{ fontWeight: 600 }}>
              {booking.totalPrice.toLocaleString()} ₫
            </span>
          </div>
        </div>

        <div className="payment">
          <span>Khách cần trả: {booking.totalPrice.toLocaleString()} ₫</span>
          <span>
            Khách đặt cọc:{" "}
            <input
              type="text"
              className="deposit-input"
              placeholder="Nhập số tiền"
              onFocus={(e) => {
                e.target.select();
              }}
              value={booking.depositAmount.toLocaleString("vi-VN") || ""}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setBooking((prev) => ({ ...prev, depositAmount: 0 }));
                }
              }}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, ""); // Chỉ giữ số
                setBooking((prev) => ({
                  ...prev,
                  depositAmount: Number(raw) ? Number(raw) : 0,
                }));
              }}
            />
          </span>
        </div>

        <div className="button-group">
          {/* <div onClick={onOpenServiceModal}>
            <i class="fa-solid fa-circle-plus"></i>
            <span>Thêm dịch vụ</span>
          </div> */}
          <button
            className="add-button"
            style={{ padding: "8px 14px" }}
            onClick={() => {
              setTypeBooking("Đã nhận phòng");
              setIsConfirmDialogOpen(true);
            }}
            disabled={error ? true : false}
          >
            Nhận phòng
          </button>
          <button
            className="add-button"
            style={{ padding: "16px", backgroundColor: "#ff8800" }}
            onClick={() => {
              setTypeBooking(BookingStatus.PENDING);
              setIsConfirmDialogOpen(true);
            }}
            disabled={error ? true : false}
          >
            Đặt trước
          </button>
        </div>
      </div>
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={handleCloseCustomerModal}
        custommer={customer}
        setCustomer={setCustomer}
      />

      {isConfirmDialogOpen && (
        <div className="confirm-dialog">
          <div className="dialog-content">
            <p>Xác nhận đặt phòng </p>
            <div className="dialog-actions">
              <button
                className="cancel-button"
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                Hủy
              </button>
              <button
                className="confirm-button"
                onClick={() => handleBooking(typeBooking)}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingModal;
