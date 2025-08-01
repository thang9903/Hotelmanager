import React, { useEffect, useState } from "react";
import "../../styles/modal/InvoiceDrawer.css";
import Drawer from "./Drawer";
import { findBookingById, payBooking } from "../../services/booking";
import { findRoomTypeByRoomId } from "../../services/room";
import { calculateTime } from "../../utils/caculate-time";
import { getBookingItemsByBooking } from "../../services/booking-service";

const InvoiceDrawer = ({ isOpen, onClose, bookingId }) => {
  const [roomType, setRoomType] = useState({
    roomTypeId: "",
    roomTypeName: "",
    priceByDay: 0,
    priceByHour: 0,
    priceOvernight: 0,
    status: 1,
  });
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

  const [customerPaid, setCustomerPaid] = useState(0);
  const [servicesItems, setServiceItems] = useState([]);

  const handlePayBooking = async () => {
    const paidedBooking = await payBooking(bookingId, customerPaid);
    if (paidedBooking) {
      onClose();
    }
  };
  const fetchRoomType = async (roomId) => {
    const roomType = await findRoomTypeByRoomId(roomId);
    if (roomType) {
      //   console.log("room type", roomType);
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

  const fetchBookingItem = async () => {
    const serviceItems = await getBookingItemsByBooking(bookingId);

    setServiceItems(serviceItems);
  };
  useEffect(() => {
    if (isOpen) {
      fetchBooking();
      fetchBookingItem();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Chi tiết đơn bán">
      <div className="booking-drawer">
        <div className="booking-detail">
          <div className="room-items">
            <div className="table-header">
              <span>STT</span>
              <span>Hạng mục</span>
              <span>Số lượng</span>
              <span>Đơn giá</span>
              <span>Thành tiền</span>
            </div>

            <div className="table-body">
              <span
                style={{
                  fontWeight: "600",
                  color: "#677484",
                  fontSize: "13px",
                  paddingTop: "8px",
                }}
              >
                Tiền phòng
              </span>
              <div className="table-row" key={booking.id}>
                <span>1.</span>
                <span>{roomType.roomTypeName}</span>
                <div className="quantity-control">
                  <span>
                    {calculateTime(booking.checkInDate, booking.checkOutDate)}
                  </span>
                </div>
                <span>{booking.unitPrice.toLocaleString()} ₫</span>
                <span>{booking.totalPrice.toLocaleString("vi-VN")} ₫</span>
              </div>
              <span
                style={{
                  fontWeight: "600",
                  color: "#677484",
                  fontSize: "13px",
                  paddingTop: "8px",
                }}
              >
                Tiền dịch vụ
              </span>
              {servicesItems.map((item, index) => (
                <div className="table-row" key={booking.id}>
                  <span>{index + 1}.</span>
                  <span>{item.service.name}</span>
                  <div className="quantity-control">
                    <span>{item.quantity}</span>
                  </div>
                  <span>{item.unitPrice.toLocaleString("vi-VN")} ₫</span>
                  <span>{item.totalPrice.toLocaleString("vi-VN")} ₫</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="booking-total-price">
          <div className="booking-info">
            <div className="form-group">
              <label>Nhân viên đặt</label>
              <div>
                <input readOnly>{booking.createdBy}</input>
              </div>
            </div>
            <div className="form-group">
              <label>Thời gian đặt</label>
              <div className="datetime-input">
                <input type="text" value={booking.createdAt} readOnly />
              </div>
            </div>
          </div>

          <div className="summary">
            <div class="summary-row">
              <strong>Tiền phòng:</strong>
              <span class="summary-value">
                {booking.totalPrice.toLocaleString()} ₫
              </span>
            </div>

            <div class="summary-row">
              <strong>Tiền dịch vụ:</strong>
              <span class="summary-value">
                {booking.totalServicePrice.toLocaleString()} ₫
              </span>
            </div>
            <div class="summary-row">
              <strong>Đã cọc:</strong>{" "}
              <span class="summary-value">
                {" "}
                {booking.depositAmount?.toLocaleString()} ₫
              </span>
            </div>
            {/* <div class="summary-row">
              <strong>Thu khác:</strong>
              <span class="summary-value">0</span>
            </div> */}
            <div class="summary-row">
              <strong>Còn cần trả:</strong>
              <span class="summary-value">
                {(
                  booking.totalPrice +
                  booking.totalServicePrice -
                  booking.depositAmount
                ).toLocaleString()}{" "}
                ₫
              </span>
            </div>
          </div>

          <div className="summary">
            <div className="summary-row">
              <strong>Khách trả:</strong>
              <input
                className="summary-value"
                value={customerPaid.toLocaleString("vi-VN")}
                onChange={(e) => {
                  // Xóa dấu phân cách để parse thành số
                  const raw = e.target.value
                    .replace(/\./g, "")
                    .replace(/[^0-9]/g, "");
                  setCustomerPaid(Number(raw));
                }}
                onFocus={(e) => e.target.select()}
              />
            </div>
            <div class="summary-row">
              <strong>Tiền thừa:</strong>{" "}
              <span class="summary-value">
                {customerPaid -
                  (booking.totalPrice +
                    booking.totalServicePrice -
                    booking.depositAmount) >
                0
                  ? (
                      customerPaid -
                      (booking.totalPrice +
                        booking.totalServicePrice -
                        booking.depositAmount)
                    ).toLocaleString("vi-VN")
                  : "0"}{" "}
                ₫
              </span>
            </div>
          </div>
          <button className="complete-button" onClick={handlePayBooking}>
            Hoàn thành
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default InvoiceDrawer;
