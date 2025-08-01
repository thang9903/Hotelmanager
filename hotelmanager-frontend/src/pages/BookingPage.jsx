import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./../styles/BookingPage.css";
import RoomSelectionModal from "../components/modal/RoomSelectionModal";
import BookingModal from "../components/modal/BookingModal";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import ServiceModal from "../components/modal/ServiceModal";
import { searchRoom, updateRoom } from "../services/room";
import { debounce } from "lodash";
import {
  cancelBooking,
  checkinBooking,
  searchBooking,
} from "../services/booking";
import BookingStatus from "../type/booking-status-enum";
import RoomState from "../type/room-state-enum";
import { useNavigate } from "react-router-dom";
import InvoiceDrawer from "../components/modal/InvoiceDrawer";

const channels = [
  { id: "all", name: "Tất cả", icon: "fa-solid fa-border-all" },
  { id: "direct", name: "Khách đến trực tiếp", icon: "fa-solid fa-store" },
  { id: "facebook", name: "Facebook", icon: "fa-brands fa-facebook" },
  { id: "zalo", name: "Zalo", icon: "fa-solid fa-comment-dots" },
  { id: "online", name: "Đặt online", icon: "fa-solid fa-globe" },
];

export default function Booking() {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("card");
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState({
    roomId: "",
    roomName: "",
    roomTypeId: "",
  });
  const [searchData, setSearchData] = useState("");
  const [isSelectRoomModalOpen, setIsSelectRoomModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [state, setState] = useState("");
  const [bookingInfo, setBookingInfo] = useState({
    roomType: null,
    checkInDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    checkOutDate: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    type: "Ngày",
    totalPrice: 0,
  });

  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [filterRoomName, setFilterRoomName] = useState("");
  const [filterCustomerName, setFilterCustomerName] = useState("");

  const [selectedChannel, setSelectedChannel] = useState("Tất cả");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openRoomId, setOpenRoomId] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(false);
  const bookingId = useRef("");
  const [confirmCheckInDialogOpen, setConfirmCheckInDialogOpen] =
    useState(false);
  const [confirmCancelDialogOpen, setConfirmCancelDialogOpen] = useState(false);

  const fetchRooms = async (search, status) => {
    const rooms = await searchRoom(search, status, state);
    if (rooms) {
      setRooms(rooms);
    } else {
      setRooms([]);
    }
  };

  const fetchBookings = async (filter) => {
    console.log("ok");
    const bookings = await searchBooking(filter);
    console.log("ok", bookings);
    setBookings(bookings);
  };

  const updateCleanRoom = async (roomId, clean) => {
    const updatedRoom = await updateRoom(roomId, { clean });
    if (updatedRoom) {
      setRooms((prev) =>
        prev.map((item) =>
          item.roomId === updatedRoom.roomId ? updatedRoom : item
        )
      );
    }
  };

  const handleCleanRoom = async (roomId, clean) => {
    await updateCleanRoom(roomId, clean);
    setOpenRoomId(null);
  };
  const handleOpenModal = () => {
    setIsSelectRoomModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSelectRoomModalOpen(false);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setRoom({ roomId: "", roomName: "", roomTypeId: "" });
  };

  const handleOpenServiceModal = () => {
    setIsServiceModalOpen(true);
  };
  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
  };

  const handleChangeSearchData = (e) => {
    const newValue = e.target.value;
    setSearchData(e.target.value);
    debouncedSearch(newValue, 1);
  };

  const handleCheckin = async () => {
    const updatedBooking = await checkinBooking(bookingId.current);
    if (updatedBooking) {
      setBookings((prev) =>
        prev.map((item) =>
          checkinBooking.id === item.id ? updatedBooking : item
        )
      );

      setConfirmCheckInDialogOpen(false);
    }
  };

  const handleCancel = async () => {
    const canceled = await cancelBooking(bookingId.current);
    if (canceled) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingId.current));
    }
    setConfirmCancelDialogOpen(false);
  };

  const debouncedSearch = useCallback(
    debounce(async (searchValue, statusValue) => {
      try {
        const rooms = await searchRoom(searchValue, statusValue, state);
        if (rooms) {
          setRooms(rooms);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
    }, 1000),
    []
  );

  const debouncedFetchBookings = useCallback(
    debounce(async (filter) => {
      await fetchBookings(filter);
    }, 1000),
    []
  );

  const handleClickCard = (room) => {
    setRoom(room);
    setIsBookingModalOpen(true);
  };

  const handlePayButtonClick = (booking) => {
    bookingId.current = booking.id;
    console.log("bookingId", booking.id);
    if (booking.status === BookingStatus.CHECKED_IN) {
      console.log("current", bookingId.current);

      setOpenDrawer(true);
    } else {
      setConfirmCheckInDialogOpen(true);
    }
  };

  // useEffect(() => {
  //   console.log("effect");
  //   fetchBookings({
  //     customerName: filterCustomerName,
  //     roomName: filterRoomName,
  //     channel: selectedChannel,
  //     status: [BookingStatus.PENDING, BookingStatus.CHECKED_IN],
  //   });
  //   // fetchRooms(searchData, 1);
  // }, []);

  useEffect(() => {
    if (!isBookingModalOpen && !openDrawer) {
      console.log("effect");
      fetchBookings({
        customerName: filterCustomerName,
        roomName: filterRoomName,
        channel: selectedChannel,
        status: [BookingStatus.PENDING, BookingStatus.CHECKED_IN],
      });
      fetchRooms(searchData, 1);
    }
  }, [isBookingModalOpen, openDrawer]);

  useEffect(() => {
    fetchRooms(searchData, 1, state);
  }, [state]);

  useEffect(() => {
    if (bookingRoom?.roomId) {
      setRooms((prev) =>
        prev.map((item) =>
          item.roomId === bookingRoom.roomId ? bookingRoom : item
        )
      );
    }
  }, [bookingRoom]);

  useEffect(() => {}, [room]);

  return (
    // header
    <div className="container booking-page">
      <div className="header">
        <div className="view-toggle">
          <button
            className={`toggle-button ${viewMode === "card" ? "active" : ""}`}
            onClick={() => setViewMode("card")}
          >
            <i className="fas fa-th-large"></i> {/* Icon dạng card */}
            {viewMode === "card" && <span>Sơ đồ</span>}
          </button>
          <button
            className={`toggle-button ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <i className="fas fa-table"></i> {/* Icon dạng bảng */}
            {viewMode === "table" && <span>Danh sách</span>}
          </button>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Tìm kiếm mã phòng, loại phòng..."
            className="search-input"
            onChange={(e) => handleChangeSearchData(e)}
          />
          <button className="add-button" onClick={handleOpenModal}>
            + Đặt phòng
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="filter-section">
          <div className="channel-dropdown">
            <div
              className="channel-selected"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <i
                className={
                  channels.find((ch) => ch.name === selectedChannel)?.icon
                }
              ></i>
              <span>
                {channels.find((ch) => ch.name === selectedChannel)?.name}
              </span>
            </div>
            {isDropdownOpen && (
              <div className="channel-options">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="channel-option"
                    onClick={() => {
                      setSelectedChannel(channel.name);
                      fetchBookings({
                        customerName: filterCustomerName,
                        roomName: filterRoomName,
                        channel: channel.name,
                      });
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
          <input
            type="text"
            placeholder="Lọc theo tên phòng"
            value={filterRoomName}
            onChange={(e) => {
              setFilterRoomName(e.target.value);
              debouncedFetchBookings({
                roomName: e.target.value,
                customerName: filterCustomerName,
                channel: selectedChannel,
                status: [BookingStatus.PENDING, BookingStatus.CHECKED_IN],
              });
            }}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Lọc theo tên khách"
            value={filterCustomerName}
            onChange={(e) => {
              setFilterCustomerName(e.target.value);
              debouncedFetchBookings({
                roomName: filterRoomName,
                customerName: e.target.value,
                channel: selectedChannel,
                status: [BookingStatus.PENDING, BookingStatus.CHECKED_IN],
              });
            }}
            className="filter-input"
          />
        </div>
      ) : (
        <div className="tabs">
          <div
            className="tab"
            onClick={() => {
              setState(RoomState.AVAILABLE);
            }}
          >
            <span className="tab-icon available"></span> {RoomState.AVAILABLE}
          </div>
          <div
            className="tab"
            onClick={() => {
              setState(RoomState.PENDING);
            }}
          >
            <span className="tab-icon pending"></span> {RoomState.PENDING}
          </div>
          <div
            className="tab"
            onClick={() => {
              setState(RoomState.IN_USE);
            }}
          >
            <span className="tab-icon in-use"></span> {RoomState.IN_USE}
          </div>
          <div
            className="tab"
            onClick={() => {
              setState(null);
            }}
          >
            <span className="tab-icon all"></span> Tất cả
          </div>
        </div>
      )}

      <RoomSelectionModal
        isOpen={isSelectRoomModalOpen}
        onClose={handleCloseModal}
        onBooking={() => setIsBookingModalOpen(true)}
        bookingInfo={bookingInfo}
        setBookingInfo={setBookingInfo}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onOpenServiceModal={handleOpenServiceModal}
        room={room}
        bookingInfo={bookingInfo}
        setBookingRoom={setBookingRoom}
      />

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={handleCloseServiceModal}
      />

      <InvoiceDrawer
        isOpen={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
        }}
        bookingId={bookingId.current}
      />

      {viewMode === "card" ? (
        <div className="grid-card">
          {rooms.map((room) => (
            <div
              className={
                room.state === RoomState.AVAILABLE
                  ? "card available"
                  : room.state === RoomState.IN_USE
                  ? "card in-use"
                  : "card pending"
              }
              key={room.roomId}
              onClick={() => handleClickCard(room)}
            >
              <div className="card-header">
                <span
                  className={`card-badge ${
                    room.clean === "Sạch" ? "clean" : "dirty"
                  }`}
                >
                  <i
                    className={`status-icon ${
                      room.clean === "Sạch"
                        ? "fa-solid fa-star"
                        : "fas fa-broom"
                    }`}
                  ></i>
                  {room.clean}
                </span>
                <button
                  className="icon-button"
                  style={{ fontSize: "24px", backgroundColor: "transparent" }}
                  onClick={(e) => {
                    e.stopPropagation(); // ngăn click lan ra card
                    setOpenRoomId(
                      openRoomId === room.roomId ? null : room.roomId
                    );
                  }}
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>

                {openRoomId === room.roomId && (
                  <ul
                    className="dropdown-menu"
                    style={{ right: "0%", top: "100%" }}
                  >
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCleanRoom(
                          room.roomId,
                          room.clean === "Sạch" ? "Chưa dọn" : "Sạch"
                        );
                      }}
                    >
                      {room.clean === "Sạch" ? "Chưa dọn" : "làm sạch"}
                    </li>
                  </ul>
                )}
              </div>
              <div className="card-content">
                <div className="card-title">{room.roomName}</div>
                <div className="room-type">{room.roomType.roomTypeName}</div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700 space-x-3">
                    <i className="fas fa-clock"></i>
                    <span>
                      {room.roomType.priceByHour.toLocaleString()}₫ / giờ
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700 space-x-3">
                    <i className="fas fa-sun"></i>
                    <span>
                      {room.roomType.priceByDay.toLocaleString()}₫ / ngày
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700 space-x-3">
                    <i className="fas fa-moon"></i>
                    <span>
                      {room.roomType.priceOvernight.toLocaleString()}₫ / đêm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table">
          <div className="table-header">
            <span>STT</span>
            <span>Tên phòng</span>
            <span>Kênh bán</span>
            <span>Khách đặt</span>
            <span>Số CCCD</span>
            <span>Giờ nhận</span>
            <span>Giờ trả</span>
            <span>Thành tiền</span>
            <span>Tiền cọc</span>
          </div>

          <div className="table-body">
            {bookings.map((booking, index) => (
              <div className="table-row" key={booking.id}>
                <span>{index + 1}. </span>
                <span>{booking.room.roomName}</span>
                <span>{booking.channel}</span>

                <span>
                  {booking.customerName ? booking.customerName : "Khách lẻ"}
                </span>
                <span>{booking.cccd ? booking.cccd : "---"}</span>
                <span>
                  {format(new Date(booking.checkInDate), "dd/MM/yyyy, HH:mm", {
                    locale: vi,
                  })}
                </span>
                <span>
                  {format(new Date(booking.checkOutDate), "dd/MM/yyyy, HH:mm", {
                    locale: vi,
                  })}
                </span>
                <span>{booking.totalPrice.toLocaleString()} ₫</span>
                <span>
                  {booking.depositAmount
                    ? booking.depositAmount.toLocaleString()
                    : 0}{" "}
                  ₫
                </span>
                <div className="button-access-group">
                  <button
                    className="add-button"
                    style={{
                      padding: "8px",
                      minWidth: "100px",
                      backgroundColor:
                        booking.status === BookingStatus.PENDING
                          ? "#3b82f6"
                          : booking.status === BookingStatus.CHECKED_IN
                          ? "#279656"
                          : "#6b7280",
                    }}
                    onClick={() => handlePayButtonClick(booking)}
                  >
                    {booking.status === BookingStatus.PENDING
                      ? "Nhận phòng"
                      : "Thanh toán"}
                  </button>
                  <div
                    className="menu-wrapper"
                    style={{ position: "relative", marginLeft: "auto" }}
                  >
                    <button
                      className="icon-button"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === booking.id ? null : booking.id
                        )
                      }
                    >
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>

                    {openMenuId === booking.id && (
                      <ul className="dropdown-menu">
                        <li
                          onClick={() =>
                            navigate(`/booking-detail/${booking.id}`)
                          }
                        >
                          Chi tiết
                        </li>
                        <li
                          onClick={() =>
                            navigate(`/booking-detail/${booking.id}`)
                          }
                        >
                          Sửa đặt phòng
                        </li>
                        {booking.status === BookingStatus.PENDING && (
                          <li
                            onClick={() => {
                              bookingId.current = booking.id;
                              setConfirmCancelDialogOpen(true);
                              setOpenMenuId(null);
                            }}
                          >
                            Hủy đặt phòng
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {confirmCheckInDialogOpen && (
        <div className="confirm-dialog">
          <div className="dialog-content">
            <p>Xác nhận Khách nhận phòng </p>
            <div className="dialog-actions">
              <button
                className="cancel-button"
                onClick={() => setConfirmCheckInDialogOpen(false)}
              >
                Hủy
              </button>
              <button
                className="confirm-button"
                onClick={() => handleCheckin()}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmCancelDialogOpen && (
        <div className="confirm-dialog">
          <div className="dialog-content">
            <p>Xác nhận hủy đơn </p>
            <div className="dialog-actions">
              <button
                className="cancel-button"
                onClick={() => setConfirmCancelDialogOpen(false)}
              >
                Hủy
              </button>
              <button className="confirm-button" onClick={() => handleCancel()}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
