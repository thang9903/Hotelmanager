import React, { use, useEffect, useState } from "react";
import "../../styles/modal/RoomModal.css";
import { findAllRoomType } from "../../services/room-type";

const RoomModal = ({ isOpen, room, setRoom, onClose, onSave }) => {
  const [roomTypes, setRoomTypes] = useState([]);

  const [roomType, setRoomType] = useState({
    roomTypeId: "",
    roomTypeName: "",
    priceByDay: 0,
    priceByHour: 0,
    priceOvernight: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectRoomType = (e) => {
    handleInputChange(e);
    setRoomType(() => {
      const selectedRoomType = roomTypes.find(
        (type) => type.roomTypeId === e.target.value
      );
      return {
        roomTypeId: e.target.value,
        roomTypeName: selectedRoomType?.roomTypeName || "",
        priceByDay: selectedRoomType?.priceByDay || 0,
        priceByHour: selectedRoomType?.priceByHour || 0,
        priceOvernight: selectedRoomType?.priceOvernight || 0,
      };
    });
  };

  const handleSave = () => {
    onSave();
    onClose();
  };

  const handleClose = () => {
    setRoom({ roomId: "", roomName: "", roomTypeId: "" });
    onClose();
  };

  const fetchRoomTypes = async (search, status) => {
    const roomTypes = await findAllRoomType(search, status);
    if (roomTypes) {
      setRoomTypes(roomTypes);
    }
  };

  useEffect(() => {
    fetchRoomTypes();

    if (room.roomType) {
      const selectedRoomType = room.RoomType;

      setRoomType(() => ({
        roomTypeId: room.roomType.roomTypeId,
        roomTypeName: room.roomType?.roomTypeName || "",
        priceByDay: room.roomType?.priceByDay || 0,
        priceByHour: room.roomType?.priceByHour || 0,
        priceOvernight: room.roomType?.priceOvernight || 0,
      }));
    }

    console.log("roomType", roomType);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay room-modal">
      <div className="modal">
        <div className="modal-header">
          <h3>phòng</h3>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form">
            <div className="form-left">
              <div className="form-group">
                <label htmlFor="roomName" className="form-label required">
                  Tên phòng
                </label>
                <input
                  id="roomName"
                  name="roomName"
                  className="input-field"
                  type="text"
                  value={room.roomName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên phòng"
                />
              </div>

              <div className="form-group">
                <label htmlFor="roomType" className="form-label required">
                  Hạng phòng
                </label>
                <select
                  id="roomType"
                  name="roomTypeId"
                  className="input-field"
                  value={room.roomTypeId}
                  onChange={handleSelectRoomType}
                >
                  <option value="">
                    {roomType.roomTypeName
                      ? roomType.roomTypeName
                      : "-- Chọn hạng phòng --"}
                  </option>
                  {roomTypes.map((type) => (
                    <option key={type.roomTypeId} value={type.roomTypeId}>
                      {type.roomTypeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-right">
              <p>Phòng sẽ được áp dụng theo giá của hạng phòng:</p>
              <ul>
                <li>Giá giờ: {roomType.priceByHour || "Chưa có thông tin"}</li>
                <li>
                  Giá cả ngày: {roomType.priceByDay || "Chưa có thông tin"}
                </li>
                <li>
                  Giá qua đêm: {roomType.priceOvernight || "Chưa có thông tin"}
                </li>
              </ul>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Ghi chú
            </label>
            <textarea
              id="notes"
              name="notes"
              className="input-field"
              // value={roomData.notes}
              // onChange={handleInputChange}
              placeholder="Nhập ghi chú"
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            Hủy
          </button>
          <button className="save-button" onClick={handleSave}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
