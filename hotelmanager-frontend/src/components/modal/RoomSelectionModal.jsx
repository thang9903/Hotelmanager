import React, { useEffect, useState } from "react";
import "../../styles/modal/RoomSelectionModal.css";
import { searchRoomType } from "../../services/room-type";
import { addDays, format } from "date-fns";
import { calculateTime } from "../../utils/caculate-time";
import { calculatePrice } from "../../utils/caculate-price";
import { findByRoomType } from "../../services/room";

const RoomSelectionModal = ({
  isOpen,
  onClose,
  onBooking,
  bookingInfo,
  setBookingInfo,
}) => {
  const [roomTypes, setRoomTypes] = useState([]);

  const fetchRoomTypes = async (search, status) => {
    const roomTypes = await searchRoomType(search, status);
    if (roomTypes) {
      console.log("roomTypes");
      setRoomTypes(roomTypes);
    } else {
      setRoomTypes([]);
    }
  };

  const fetchRoom = async (roomType) => {
    const rooms = await findByRoomType(roomType.roomTypeId, 1);
    if (rooms) {
      return true;
    } else {
      return false;
    }
  };

  const reviewPrice = (roomType) => {
    const price =
      bookingInfo.type === "Ngày"
        ? roomType.priceByDay
        : bookingInfo.type === "Giờ"
        ? roomType.priceByHour
        : roomType.priceOvernight;
    const total = calculatePrice({
      checkInStr: bookingInfo.checkInDate,
      checkOutStr: bookingInfo.checkOutDate,
      type: bookingInfo.type,
      price,
    });

    return total;
  };

  useEffect(() => {
    fetchRoomTypes("", 1);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay room-selection-modal">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          <i class="fa-regular fa-circle-xmark"></i>
        </button>
        <h2>Chọn Phòng</h2>
        <div className="view-toggle">
          <button
            className={`toggle-button ${
              bookingInfo.type === "Ngày" ? "active" : ""
            }`}
            onClick={() =>
              setBookingInfo((prev) => ({ ...prev, type: "Ngày" }))
            }
          >
            Theo Ngày
          </button>
          <button
            className={`toggle-button ${
              bookingInfo.type === "Đêm" ? "active" : ""
            }`}
            onClick={() => setBookingInfo((prev) => ({ ...prev, type: "Đêm" }))}
          >
            Qua Đêm
          </button>
          <button
            className={`toggle-button ${
              bookingInfo.type === "Giờ" ? "active" : ""
            }`}
            onClick={() => setBookingInfo((prev) => ({ ...prev, type: "Giờ" }))}
          >
            Theo Giờ
          </button>
        </div>

        <div className="date-time-container">
          <div className="date-time-item">
            <label className="date-time-label">Nhận phòng</label>
            <input
              type="datetime-local"
              className="input"
              value={bookingInfo.checkInDate}
              onChange={(e) =>
                setBookingInfo((prev) => ({
                  ...prev,
                  checkInDate: e.target.value,
                }))
              }
            />
          </div>
          <div className="date-time-item">
            <label className="date-time-label">Trả phòng</label>
            <input
              type="datetime-local"
              className="input"
              value={bookingInfo.checkOutDate}
              onChange={(e) =>
                setBookingInfo((prev) => ({
                  ...prev,
                  checkOutDate: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="table-header">
          <span>Loại phòng</span>
          <span>Giá</span>
          <span>Số lượng</span>
          <span>Tổng cộng</span>
        </div>

        <div className="table-body">
          {roomTypes.map((roomType, index) => (
            <div className="table-row" key={index}>
              <span>{roomType.roomTypeName}</span>
              <span>
                {bookingInfo.type === "Ngày"
                  ? roomType.priceByDay.toLocaleString()
                  : bookingInfo.type === "Đêm"
                  ? roomType.priceOvernight.toLocaleString()
                  : roomType.priceByHour.toLocaleString()}
                ₫
              </span>
              <span>
                {calculateTime(
                  bookingInfo.checkInDate,
                  bookingInfo.checkOutDate
                )}
              </span>
              <div>
                <span>{reviewPrice(roomType).toLocaleString()}₫</span>
                <button
                  className="add-button"
                  style={{ padding: "8px 14px" }}
                  onClick={async () => {
                    const haveRoom = await fetchRoom(roomType);
                    if (haveRoom) {
                      setBookingInfo((prev) => ({
                        ...prev,
                        roomType,
                        totalPrice: reviewPrice(roomType),
                      }));
                      onBooking();
                      onClose();
                    }
                  }}
                >
                  Đặt phòng
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomSelectionModal;
